import { useState, useCallback } from 'react'
import { supabase, isMissingCredentials } from '@/lib/supabase'

export interface JDAnalysisResult {
  matchScore: number
  recommendation: 'good_fit' | 'consider' | 'not_ideal'
  strengths: string[]
  gaps: string[]
  summary: string
}

// Keywords for demo analysis (PM-focused)
const strongSkills = ['product manager', 'product management', 'roadmap', 'strategy', 'user research', 'stakeholder', 'metrics', 'okr', 'kpi', 'consumer', 'b2c', 'prioritization', 'cross-functional']
const moderateSkills = ['sql', 'a/b test', 'agile', 'scrum', 'analytics', 'amplitude', 'mixpanel', 'jira', 'data-driven', 'user interview']
const gapSkills = ['engineering manager', 'software engineer', 'coding', 'programming', 'machine learning engineer', 'ml engineer', 'b2b', 'enterprise', 'sales cycle', 'procurement']

function analyzePlaceholder(jobDescription: string): JDAnalysisResult {
  const lower = jobDescription.toLowerCase()

  // Count matches
  const strongMatches = strongSkills.filter(skill => lower.includes(skill))
  const moderateMatches = moderateSkills.filter(skill => lower.includes(skill))
  const gapMatches = gapSkills.filter(skill => lower.includes(skill))

  // Calculate score
  const totalKeywords = strongMatches.length + moderateMatches.length + gapMatches.length
  const positiveWeight = strongMatches.length * 1.0 + moderateMatches.length * 0.6
  const negativeWeight = gapMatches.length * 0.8

  let score = 50 // Base score
  if (totalKeywords > 0) {
    score = Math.round(((positiveWeight - negativeWeight) / totalKeywords + 1) * 50)
    score = Math.max(20, Math.min(95, score)) // Clamp to 20-95
  }

  // Determine recommendation
  let recommendation: 'good_fit' | 'consider' | 'not_ideal' = 'consider'
  if (score >= 75) recommendation = 'good_fit'
  else if (score < 50) recommendation = 'not_ideal'

  // Build strengths
  const strengths: string[] = []
  if (strongMatches.includes('product manager') || strongMatches.includes('product management')) strengths.push('7 years of product management experience (9/10 self-rating)')
  if (strongMatches.includes('roadmap') || strongMatches.includes('strategy')) strengths.push('Strong product strategy and roadmap planning experience')
  if (strongMatches.includes('user research')) strengths.push('200+ user interviews conducted, built research practice from scratch')
  if (strongMatches.includes('stakeholder') || strongMatches.includes('cross-functional')) strengths.push('Proven stakeholder management with C-suite and cross-functional teams')
  if (strongMatches.includes('metrics') || strongMatches.includes('okr') || strongMatches.includes('kpi')) strengths.push('Data-driven decision maker, strong with OKRs and product metrics')
  if (strongMatches.includes('consumer') || strongMatches.includes('b2c')) strengths.push('Deep consumer/B2C product experience (3M+ MAU)')
  if (moderateMatches.includes('sql') || moderateMatches.includes('analytics')) strengths.push('Can pull own data and run basic SQL queries')
  if (moderateMatches.includes('a/b test')) strengths.push('Experience designing and running A/B experiments')
  if (strengths.length === 0) strengths.push('General product management background')

  // Build gaps
  const gaps: string[] = []
  if (gapMatches.includes('engineering manager') || gapMatches.includes('software engineer') || gapMatches.includes('coding') || gapMatches.includes('programming')) {
    gaps.push('Not a technical IC - can discuss architecture but cannot implement code')
  }
  if (gapMatches.includes('machine learning engineer') || gapMatches.includes('ml engineer')) {
    gaps.push('No ML engineering background - would need strong ML partner for deep technical work')
  }
  if (gapMatches.includes('b2b') || gapMatches.includes('enterprise') || gapMatches.includes('sales cycle') || gapMatches.includes('procurement')) {
    gaps.push('Limited enterprise/B2B experience - background is consumer and SMB products')
  }
  if (lower.includes('director') && lower.includes('product')) {
    gaps.push("Haven't managed other PMs directly - cross-functional leadership only")
  }
  if (gaps.length === 0 && score < 70) {
    gaps.push('Role may require skills not prominently featured in my background')
  }

  // Generate summary
  let summary = ''
  if (recommendation === 'good_fit') {
    summary = "Based on the job description, this looks like a strong match. My core skills align well with what you're looking for. Happy to dig into any specific areas."
  } else if (recommendation === 'consider') {
    summary = "There's decent overlap here, but some gaps worth discussing. I can ramp up on some areas, but you should know what you'd be getting into."
  } else {
    summary = "I want to be honest - this might not be the best fit. The role emphasizes skills that aren't my strengths. I'd rather tell you now than waste your time."
  }

  return {
    matchScore: score,
    recommendation,
    strengths,
    gaps,
    summary,
  }
}

export function useJDAnalyzer() {
  const [result, setResult] = useState<JDAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description')
      return null
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      if (isMissingCredentials) {
        // Demo mode: simulate delay and return placeholder analysis
        await new Promise(resolve => setTimeout(resolve, 1500))
        const analysis = analyzePlaceholder(jobDescription)
        setResult(analysis)
        return analysis
      }

      // Real API call to Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('analyze-jd', {
        body: {
          job_description: jobDescription,
        },
      })

      if (fnError) throw fnError

      const analysis: JDAnalysisResult = {
        matchScore: data.match_score,
        recommendation: data.recommendation,
        strengths: data.strengths,
        gaps: data.gaps,
        summary: data.summary,
      }
      setResult(analysis)
      return analysis
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job description'
      setError(errorMessage)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    result,
    isAnalyzing,
    error,
    analyze,
    reset,
  }
}
