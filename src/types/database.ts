// Database types matching Supabase schema
// These will be used by the Supabase client for type safety

export interface CandidateProfile {
  id: string
  name: string
  email: string
  title: string
  target_titles: string[]
  target_company_stages: string[]
  elevator_pitch: string
  career_narrative: string
  looking_for: string
  not_looking_for: string
  salary_min: number | null
  salary_max: number | null
  availability_status: 'actively_looking' | 'open' | 'not_looking'
  availability_date: string | null
  location: string
  remote_preference: 'remote' | 'hybrid' | 'onsite' | 'flexible'
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company_name: string
  title: string
  title_progression: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  bullet_points: string[]
  why_joined: string | null
  why_left: string | null
  actual_contributions: string | null
  proudest_achievement: string | null
  would_do_differently: string | null
  challenges_faced: string | null
  lessons_learned: string | null
  manager_would_say: string | null
  reports_would_say: string | null
  quantified_impact: Record<string, unknown> | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  skill_name: string
  category: string // Skill type: Language, Framework, Tool, Cloud, DevOps, API, AI, etc.
  self_rating: number | null // 1-10
  evidence: string | null
  honest_notes: string | null
  years_experience: number | null
  last_used: string | null
  created_at: string
  updated_at: string
}

export interface GapWeakness {
  id: string
  gap_type: string
  description: string
  why_its_a_gap: string | null
  interest_in_learning: boolean
  created_at: string
  updated_at: string
}

export interface FaqResponse {
  id: string
  question: string
  answer: string
  is_common_question: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface AiInstruction {
  id: string
  instruction_type: string
  instruction: string
  priority: number
  created_at: string
  updated_at: string
}

// Supabase Database type for the client
export interface Database {
  public: {
    Tables: {
      candidate_profile: {
        Row: CandidateProfile
        Insert: Omit<CandidateProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CandidateProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      experiences: {
        Row: Experience
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
      }
      gaps_weaknesses: {
        Row: GapWeakness
        Insert: Omit<GapWeakness, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GapWeakness, 'id' | 'created_at' | 'updated_at'>>
      }
      faq_responses: {
        Row: FaqResponse
        Insert: Omit<FaqResponse, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FaqResponse, 'id' | 'created_at' | 'updated_at'>>
      }
      chat_history: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
      }
      ai_instructions: {
        Row: AiInstruction
        Insert: Omit<AiInstruction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AiInstruction, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
