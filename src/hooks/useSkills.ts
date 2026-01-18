import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { Skill } from '@/types/database'

// Placeholder data for demo mode
const placeholderSkills: Skill[] = [
  // Strong skills (PM competencies, 7-10)
  {
    id: '1',
    skill_name: 'Product Strategy',
    category: 'Product',
    self_rating: 9,
    evidence: 'Defined strategy for products with $50M+ ARR. Led roadmap prioritization.',
    honest_notes: 'Strong at connecting business goals to product decisions. Best in B2C consumer.',
    years_experience: 5,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    skill_name: 'User Research',
    category: 'Research',
    self_rating: 8,
    evidence: 'Conducted 200+ user interviews. Built research practice from scratch.',
    honest_notes: 'Love talking to users. Sometimes over-index on qualitative vs quantitative.',
    years_experience: 6,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    skill_name: 'Stakeholder Management',
    category: 'Leadership',
    self_rating: 8,
    evidence: 'Regularly present to C-suite. Align engineering, design, marketing.',
    honest_notes: 'Good at getting buy-in. Can be impatient with slow decision-makers.',
    years_experience: 5,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    skill_name: 'Data Analysis',
    category: 'Analytics',
    self_rating: 8,
    evidence: 'Daily Amplitude/Mixpanel user. Built dashboards, ran A/B tests.',
    honest_notes: 'Can find insights in data. Would call myself data-informed, not data-driven.',
    years_experience: 5,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    skill_name: 'Roadmap Planning',
    category: 'Product',
    self_rating: 8,
    evidence: 'Own quarterly and annual roadmaps. Balance short-term wins vs long-term bets.',
    honest_notes: 'Good at prioritization. Still learning to leave buffer for surprises.',
    years_experience: 4,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Moderate skills (5-6)
  {
    id: '6',
    skill_name: 'SQL',
    category: 'Technical',
    self_rating: 6,
    evidence: 'Write queries for analysis, join tables, basic aggregations',
    honest_notes: 'Can pull my own data. Complex queries I ask data team to review.',
    years_experience: 3,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    skill_name: 'A/B Testing',
    category: 'Analytics',
    self_rating: 6,
    evidence: 'Designed and ran 20+ experiments. Understand statistical significance.',
    honest_notes: 'Know enough to be dangerous. Call in data science for complex designs.',
    years_experience: 3,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    skill_name: 'Technical Architecture',
    category: 'Technical',
    self_rating: 5,
    evidence: 'Can discuss tradeoffs with engineers. Understand APIs, databases, caching.',
    honest_notes: 'Enough to have productive conversations. Cannot implement.',
    years_experience: 4,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    skill_name: 'Agile/Scrum',
    category: 'Process',
    self_rating: 6,
    evidence: 'Run sprints, backlog grooming, retros. Certified Scrum Product Owner.',
    honest_notes: 'Pragmatic about process. Adapt methodology to team, not the other way.',
    years_experience: 5,
    last_used: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Growth areas (1-4)
  {
    id: '10',
    skill_name: 'Machine Learning Concepts',
    category: 'Technical',
    self_rating: 4,
    evidence: 'Understand basics, worked with ML teams on product requirements',
    honest_notes: 'Can PM an ML product but would need strong ML partner for deep work.',
    years_experience: 1,
    last_used: '2024-06-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    skill_name: 'Public Speaking',
    category: 'Leadership',
    self_rating: 4,
    evidence: 'Comfortable in meetings and small groups. Nervous at large events.',
    honest_notes: 'Working on this. Fine for team updates, not great at conferences.',
    years_experience: 2,
    last_used: '2024-03-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '12',
    skill_name: 'Enterprise Sales',
    category: 'Business',
    self_rating: 3,
    evidence: 'Limited B2B experience. Mostly consumer/SMB products.',
    honest_notes: 'Would need to learn enterprise sales cycles, procurement, etc.',
    years_experience: 0,
    last_used: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<Skill[]> => {
      if (isMissingCredentials) {
        return placeholderSkills
      }

      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('self_rating', { ascending: false })

      if (error) {
        console.error('Error fetching skills:', error)
        return []
      }

      return data || []
    },
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
      if (isMissingCredentials) {
        return { ...skill, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Skill
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('skills')
        .insert(skill)
        .select()
        .single()

      if (error) throw error
      return data as Skill
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

export function useUpdateSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Skill> & { id: string }) => {
      if (isMissingCredentials) {
        return { id, ...updates } as Skill
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Skill
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isMissingCredentials) {
        return { id }
      }

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}
