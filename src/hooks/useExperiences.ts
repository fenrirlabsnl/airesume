import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { Experience } from '@/types/database'

// Placeholder data for demo mode
const placeholderExperiences: Experience[] = [
  {
    id: '1',
    company_name: 'Fintech Co',
    title: 'Senior Product Manager',
    title_progression: 'Started as PM, promoted to Senior PM after 18 months',
    start_date: '2022-03-01',
    end_date: null,
    is_current: true,
    bullet_points: [
      'Own product strategy for consumer payments vertical (3M+ MAU, $50M ARR)',
      'Led cross-functional team of 8 engineers, 2 designers to ship 12 major features',
      'Reduced user churn 23% through data-driven onboarding redesign',
    ],
    why_joined: 'Opportunity to own a large product area with direct revenue impact. Strong engineering culture.',
    why_left: null,
    actual_contributions: 'Primary PM for mobile app. Drove adoption of OKR framework. Spend a lot of time in Amplitude and talking to customers.',
    proudest_achievement: 'Killed a feature the CEO loved because data showed it confused users. Revenue went up 15% after removal.',
    would_do_differently: 'Would have hired for product ops earlier. Spent too much time on manual reporting.',
    challenges_faced: 'Inherited a product with significant tech debt. Had to balance new features vs fixing existing issues.',
    lessons_learned: 'Saying no is the hardest and most important part of the job. Data wins arguments.',
    manager_would_say: 'Strong strategic thinker, can be impatient with slow decision-making. Gets alignment without drama.',
    reports_would_say: null,
    quantified_impact: { revenue_impact: 8000000, users_impacted: 500000 },
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    company_name: 'Series A Startup',
    title: 'Product Manager',
    title_progression: null,
    start_date: '2019-08-01',
    end_date: '2022-02-28',
    is_current: false,
    bullet_points: [
      'First PM hire - built product practice from scratch (roadmap process, customer feedback loops, metrics)',
      'Took core product from MVP to product-market fit, 10x user growth in 18 months',
      'Led discovery for 3 new product lines, 2 of which became profitable',
    ],
    why_joined: 'Wanted early-stage experience and the chance to shape product culture from day one.',
    why_left: 'Great run, but company pivoted to enterprise. Wanted to stay consumer-focused.',
    actual_contributions: 'Built customer research practice. Created the first product roadmap. A lot of the work was just talking to users.',
    proudest_achievement: 'Discovered a pivot opportunity from user research that saved the company. New direction led to Series B.',
    would_do_differently: 'Should have documented decisions better. Institutional knowledge walked out with me.',
    challenges_faced: 'No PM mentor. Founders had strong opinions. Had to learn stakeholder management fast.',
    lessons_learned: 'Early-stage PM is 70% customer discovery, 20% prioritization, 10% specs. Get comfortable with ambiguity.',
    manager_would_say: 'Customer-obsessed. Not afraid to push back on founders. Sometimes moves too fast.',
    reports_would_say: null,
    quantified_impact: { features_launched: 15, user_growth: '10x' },
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async (): Promise<Experience[]> => {
      if (isMissingCredentials) {
        return placeholderExperiences
      }

      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching experiences:', error)
        return []
      }

      return data || []
    },
  })
}

export function useCreateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
      if (isMissingCredentials) {
        return { ...experience, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Experience
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('experiences')
        .insert(experience)
        .select()
        .single()

      if (error) throw error
      return data as Experience
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Experience> & { id: string }) => {
      if (isMissingCredentials) {
        return { id, ...updates } as Experience
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Experience
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isMissingCredentials) {
        return { id }
      }

      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}
