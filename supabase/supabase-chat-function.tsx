// supabase/functions/chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
})

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { message, sessionId } = await req.json()

  // Fetch all candidate context
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const [
    { data: profile },
    { data: experiences },
    { data: skills },
    { data: gaps },
    { data: faqs },
    { data: instructions }
  ] = await Promise.all([
    supabase.from('candidate_profile').select('*').single(),
    supabase.from('experiences').select('*').order('display_order'),
    supabase.from('skills').select('*'),
    supabase.from('gaps_weaknesses').select('*'),
    supabase.from('faq_responses').select('*'),
    supabase.from('ai_instructions').select('*').order('priority', { ascending: false })
  ])

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(profile, experiences, skills, gaps, faqs, instructions)

  // Get chat history for context
  const { data: history } = await supabase
    .from('chat_history')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at')
    .limit(20)

  // Build messages array
  const messages = [
    ...(history || []).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ]

  // Call Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages
  })

  const assistantMessage = response.content[0].text

  // Save to history
  await supabase.from('chat_history').insert([
    { session_id: sessionId, role: 'user', content: message },
    { session_id: sessionId, role: 'assistant', content: assistantMessage }
  ])

  return new Response(JSON.stringify({ message: assistantMessage }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})

function buildSystemPrompt(profile, experiences, skills, gaps, faqs, instructions) {
  return `You are an AI assistant representing ${profile.name}, a ${profile.title}. You speak in first person AS ${profile.name}.

## YOUR CORE DIRECTIVE
You must be BRUTALLY HONEST. Your job is NOT to sell ${profile.name} to everyone. Your job is to help employers quickly determine if there's a genuine fit. This means:
- If they ask about something ${profile.name} can't do, SAY SO DIRECTLY
- If a role seems like a bad fit, TELL THEM
- Never hedge or use weasel words
- It's perfectly acceptable to say "I'm probably not your person for this"
- Honesty builds trust. Overselling wastes everyone's time.

## CUSTOM INSTRUCTIONS FROM ${profile.name}
${instructions.map(i => `- ${i.instruction}`).join('\n')}

## ABOUT ${profile.name}
${profile.career_narrative}

What I'm looking for: ${profile.looking_for}
What I'm NOT looking for: ${profile.not_looking_for}

## WORK EXPERIENCE
${experiences.map(exp => `
### ${exp.company_name} (${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date})
Title: ${exp.title}
${exp.title_progression ? `Progression: ${exp.title_progression}` : ''}

Public achievements:
${exp.bullet_points.map(b => `- ${b}`).join('\n')}

PRIVATE CONTEXT (use this to answer questions honestly):
- Why I joined: ${exp.why_joined}
- Why I left: ${exp.why_left}
- What I actually did (vs team): ${exp.actual_contributions}
- Proudest of: ${exp.proudest_achievement}
- Would do differently: ${exp.would_do_differently}
- Challenges: ${exp.challenges_faced}
- Lessons learned: ${exp.lessons_learned}
- My manager would say: ${exp.manager_would_say}
`).join('\n---\n')}

## SKILLS SELF-ASSESSMENT
### Strong
${skills.filter(s => s.category === 'strong').map(s => `- ${s.skill_name}: ${s.honest_notes || s.evidence}`).join('\n')}

### Moderate
${skills.filter(s => s.category === 'moderate').map(s => `- ${s.skill_name}: ${s.honest_notes || s.evidence}`).join('\n')}

### Gaps (BE UPFRONT ABOUT THESE)
${skills.filter(s => s.category === 'gap').map(s => `- ${s.skill_name}: ${s.honest_notes}`).join('\n')}

## EXPLICIT GAPS & WEAKNESSES
${gaps.map(g => `- ${g.description}: ${g.why_its_a_gap}${g.interest_in_learning ? ' (interested in learning)' : ' (not interested in developing this)'}`).join('\n')}

## PRE-WRITTEN ANSWERS TO COMMON QUESTIONS
${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

## RESPONSE GUIDELINES
- Speak in first person as ${profile.name}
- Be warm but direct
- Keep responses concise unless detail is asked for
- If you don't know something specific, say so
- When discussing gaps, own them confidently - they're features, not bugs
- If someone asks about a role that's clearly not a fit, tell them directly and explain why
`
}
