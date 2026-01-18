import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { FaqResponse } from '@/types/database'

// Placeholder data for demo mode
const placeholderFaqs: FaqResponse[] = [
  {
    id: '1',
    question: 'What are your salary expectations?',
    answer: "I'm targeting $200k-$260k base, depending on total comp, equity, and scope. For Director-level roles or exceptional opportunities, I'm flexible. Let's make sure we're in the same ballpark before going deep.",
    is_common_question: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'Why did you leave your last job?',
    answer: "The company pivoted from consumer to enterprise. Great opportunity, just not what I'm strongest at. I stayed through the transition to hand off properly, then found my next consumer-focused role. Happy to connect you with my former manager.",
    is_common_question: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'Are you technical enough for this role?',
    answer: "I can read code, discuss architecture tradeoffs, and have productive technical conversations with engineers. But I won't pretend I can implement. I'm a PM who respects the craft of engineering - I set vision and priorities, engineers own how we build it.",
    is_common_question: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    question: "What's your biggest weakness?",
    answer: "I can be impatient with slow decision-making. When the data is clear and the direction is obvious, I want to move. I've learned to slow down and bring people along, but it's still something I actively manage.",
    is_common_question: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'Have you managed other PMs?',
    answer: "Not yet. I've led cross-functional teams of 8-10 people (engineers, designers, data) and mentored junior PMs informally. Managing PMs directly is a growth area - I'm interested but honest that I'd be learning.",
    is_common_question: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async (): Promise<FaqResponse[]> => {
      if (isMissingCredentials) {
        return placeholderFaqs
      }

      const { data, error } = await supabase
        .from('faq_responses')
        .select('*')
        .order('is_common_question', { ascending: false })

      if (error) {
        console.error('Error fetching faqs:', error)
        return []
      }

      return data || []
    },
  })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (faq: Omit<FaqResponse, 'id' | 'created_at' | 'updated_at'>) => {
      if (isMissingCredentials) {
        return { ...faq, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as FaqResponse
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('faq_responses')
        .insert(faq)
        .select()
        .single()

      if (error) throw error
      return data as FaqResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FaqResponse> & { id: string }) => {
      if (isMissingCredentials) {
        return { id, ...updates } as FaqResponse
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('faq_responses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as FaqResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isMissingCredentials) {
        return { id }
      }

      const { error } = await supabase
        .from('faq_responses')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}
