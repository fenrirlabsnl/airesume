// supabase/functions/analyze-jd/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Frontend sends job_description (snake_case)
    const { job_description: jobDescription } = await req.json()

    if (!jobDescription) {
      return new Response(JSON.stringify({ error: 'job_description is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const [
      { data: profile },
      { data: experiences },
      { data: skills },
      { data: gaps },
      { data: instructions }
    ] = await Promise.all([
      supabase.from('candidate_profile').select('*').maybeSingle(),
      supabase.from('experiences').select('*').order('display_order'),
      supabase.from('skills').select('*'),
      supabase.from('gaps_weaknesses').select('*'),
      supabase.from('ai_instructions').select('*').order('priority', { ascending: false })
    ])

    // Handle case where profile doesn't exist
    if (!profile) {
      return new Response(JSON.stringify({
        match_score: 50,
        recommendation: 'consider',
        strengths: ['Unable to analyze - no candidate profile found'],
        gaps: ['Please add profile data first'],
        summary: 'No candidate profile available for analysis.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Build candidate context
    const candidateContext = `
## ABOUT ${profile.name || 'Candidate'}
${profile.career_narrative || 'No career narrative provided.'}

What I'm looking for: ${profile.looking_for || 'Not specified'}
What I'm NOT looking for: ${profile.not_looking_for || 'Not specified'}

## WORK EXPERIENCE
${(experiences || []).map(exp => `
### ${exp.company_name} (${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'N/A'})
Title: ${exp.title}
${exp.bullet_points ? exp.bullet_points.map(b => `- ${b}`).join('\n') : ''}
`).join('\n---\n')}

## SKILLS
${(skills || []).map(s => `- ${s.skill_name} (${s.category}): ${s.self_rating}/10`).join('\n')}

## GAPS & WEAKNESSES
${(gaps || []).map(g => `- ${g.description}: ${g.why_its_a_gap || 'No details'}`).join('\n')}
`

    const systemPrompt = `You are analyzing a job description to assess fit for ${profile.name || 'the candidate'}.

Analyze the job description and return a JSON object with these EXACT fields:
{
  "match_score": <number 0-100>,
  "recommendation": "good_fit" | "consider" | "not_ideal",
  "strengths": ["strength 1", "strength 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "summary": "1-2 sentence assessment"
}

CANDIDATE CONTEXT:
${candidateContext}

IMPORTANT: Return ONLY valid JSON, no markdown code blocks.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this job description:\n\n${jobDescription}`
        }
      ]
    })

    // Parse the JSON response (strip markdown code blocks if present)
    let jsonText = response.content[0].text
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

    const analysis = JSON.parse(jsonText)

    // Ensure the response has all required fields with correct types
    const result = {
      match_score: typeof analysis.match_score === 'number' ? analysis.match_score : 50,
      recommendation: ['good_fit', 'consider', 'not_ideal'].includes(analysis.recommendation)
        ? analysis.recommendation
        : 'consider',
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      gaps: Array.isArray(analysis.gaps) ? analysis.gaps : [],
      summary: typeof analysis.summary === 'string' ? analysis.summary : 'Analysis complete.'
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in analyze-jd:', error)
    return new Response(JSON.stringify({
      error: error.message,
      match_score: 50,
      recommendation: 'consider',
      strengths: [],
      gaps: ['Error during analysis'],
      summary: 'An error occurred during analysis. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
