import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { GapWeakness } from '@/types/database'

// Placeholder data for demo mode
const placeholderGaps: GapWeakness[] = [
  {
    id: '1',
    gap_type: 'Technical',
    description: 'Deep technical implementation',
    why_its_a_gap: 'Can discuss architecture and tradeoffs with engineers, but cannot implement. I\'m a PM who can read code, not write it.',
    interest_in_learning: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    gap_type: 'Soft Skill',
    description: 'Public speaking at large events',
    why_its_a_gap: 'Confident in meetings and team settings, but nervous at conferences or all-hands with 100+ people. Actively working on this.',
    interest_in_learning: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    gap_type: 'Domain',
    description: 'Enterprise / B2B product experience',
    why_its_a_gap: 'My background is consumer and SMB products. Would need to learn enterprise sales cycles, procurement, and longer deal cycles.',
    interest_in_learning: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    gap_type: 'Experience',
    description: 'Managing other PMs',
    why_its_a_gap: 'Led cross-functional teams but never had PM direct reports. Interested in people management but would be learning on the job.',
    interest_in_learning: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useGaps() {
  return useQuery({
    queryKey: ['gaps'],
    queryFn: async (): Promise<GapWeakness[]> => {
      if (isMissingCredentials) {
        return placeholderGaps
      }

      const { data, error } = await supabase
        .from('gaps_weaknesses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching gaps:', error)
        return []
      }

      return data || []
    },
  })
}

export function useCreateGap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (gap: Omit<GapWeakness, 'id' | 'created_at' | 'updated_at'>) => {
      if (isMissingCredentials) {
        return { ...gap, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as GapWeakness
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('gaps_weaknesses')
        .insert(gap)
        .select()
        .single()

      if (error) throw error
      return data as GapWeakness
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] })
    },
  })
}

export function useUpdateGap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GapWeakness> & { id: string }) => {
      if (isMissingCredentials) {
        return { id, ...updates } as GapWeakness
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('gaps_weaknesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as GapWeakness
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] })
    },
  })
}

export function useDeleteGap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isMissingCredentials) {
        return { id }
      }

      const { error } = await supabase
        .from('gaps_weaknesses')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] })
    },
  })
}
