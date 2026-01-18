import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { CandidateProfile } from '@/types/database'

// Placeholder data for demo mode
const placeholderProfile: CandidateProfile = {
  id: 'demo',
  name: 'Blaine Holt',
  email: 'blaine@example.com',
  title: 'Senior Product Manager',
  elevator_pitch: "I ship products that solve real problems. 7 years turning ambiguous customer needs into clear roadmaps, aligning stakeholders who don't agree, and making hard prioritization calls.",
  target_titles: ['Director of Product', 'Group Product Manager', 'VP Product'],
  target_company_stages: ['Series B', 'Growth', 'Late Stage'],
  career_narrative: "Started as a customer success rep who asked too many questions about the product. Transitioned to PM by being the person who always knew what customers actually needed. Now I lead product strategy for consumer-facing products.",
  looking_for: 'A company with strong product culture, clear business metrics, and engineers who want a PM partner (not a ticket-taker).',
  not_looking_for: 'Feature factories, roles where PM is just project management, or companies that ship by committee.',
  salary_min: 200000,
  salary_max: 260000,
  availability_status: 'actively_looking',
  availability_date: null,
  location: 'San Francisco, CA',
  remote_preference: 'hybrid',
  github_url: null,
  linkedin_url: 'https://linkedin.com/in/blaineholt',
  twitter_url: 'https://twitter.com/blaineholt',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<CandidateProfile | null> => {
      if (isMissingCredentials) {
        return placeholderProfile
      }

      const { data, error } = await supabase
        .from('candidate_profile')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<CandidateProfile> & { id: string }) => {
      if (isMissingCredentials) {
        // In demo mode, just return the updates merged with placeholder
        return { ...placeholderProfile, ...updates }
      }

      const { id, ...updateData } = updates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('candidate_profile')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as CandidateProfile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
