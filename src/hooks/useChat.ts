import { useState, useCallback } from 'react'
import { supabase, isMissingCredentials } from '@/lib/supabase'
import type { ChatMessage } from '@/types/database'

// Placeholder responses for demo mode
const placeholderResponses: Record<string, string> = {
  weakness: "Good question. I'm honest about my gaps:\n\n• **Technical depth** - I can discuss architecture and read code, but I'm a PM, not an engineer. If you need someone who can implement, that's not me.\n\n• **Public speaking** - Confident in meetings and small groups, but large conferences still make me nervous. Working on it.\n\n• **Enterprise/B2B** - My background is consumer and SMB. Long sales cycles and procurement processes would be new territory.\n\nI'd rather you know this upfront than discover it later.",
  salary: "I'm targeting $200k-$260k base, depending on total comp, equity, and scope of the role. For Director-level opportunities, I'm flexible. But if you're significantly below this range, let's save each other time.",
  experience: "I have about 7 years of product management experience:\n\n• Currently at Fintech Co (3 years) as Senior PM, owning consumer payments vertical - 3M+ MAU, $50M ARR.\n\n• Before that, first PM at a Series A startup where I built the product practice from scratch and helped find product-market fit.\n\nI'm strongest in consumer products, user research, and data-driven decision making. I partner closely with engineering but don't pretend to be technical.",
  fit: "Honestly? It depends. Here's where I'd be a strong fit:\n\n• **Consumer products** with clear metrics and user feedback loops\n• **Teams that value data** over opinions (including mine)\n• **Companies with strong engineering culture** who want a PM partner, not a ticket-taker\n\nWhere I'd struggle:\n\n• Heavy enterprise/B2B (not my background)\n• Roles that are really project management in disguise\n• Organizations that ship by committee\n\nWhat's the role you're considering?",
  default: "Good question. I try to be transparent about my background - including both strengths and gaps. Is there something specific about my PM experience you'd like to explore?",
}

function getPlaceholderResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('weakness') || lower.includes('gap') || lower.includes('struggle') || lower.includes('not good')) {
    return placeholderResponses.weakness
  }
  if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay') || lower.includes('money')) {
    return placeholderResponses.salary
  }
  if (lower.includes('experience') || lower.includes('background') || lower.includes('worked')) {
    return placeholderResponses.experience
  }
  if (lower.includes('fit') || lower.includes('right') || lower.includes('good for') || lower.includes('team')) {
    return placeholderResponses.fit
  }
  return placeholderResponses.default
}

interface UseChatOptions {
  sessionId?: string
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionId = options.sessionId || `session_${Date.now()}`

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)
    setError(null)

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      session_id: sessionId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])

    try {
      if (isMissingCredentials) {
        // Demo mode: simulate delay and return placeholder
        await new Promise(resolve => setTimeout(resolve, 1000))
        const response = getPlaceholderResponse(content)
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          session_id: sessionId,
          role: 'assistant',
          content: response,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, aiMessage])
        return aiMessage
      }

      // Real API call to Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('chat', {
        body: {
          session_id: sessionId,
          message: content,
        },
      })

      if (fnError) throw fnError

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMessage])
      return aiMessage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMessage)
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        session_id: sessionId,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorChatMessage])
      return null
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
