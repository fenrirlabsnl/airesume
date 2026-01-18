import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useChat } from '@/hooks/useChat'

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  candidateName?: string
}

const suggestedQuestions = [
  "What are your biggest weaknesses?",
  "Why did you leave your last job?",
  "What's your salary expectation?",
  "Are you a good fit for a senior role?",
]

export default function ChatDrawer({ isOpen, onClose, candidateName = 'Candidate' }: ChatDrawerProps) {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Welcome message
  const welcomeMessage = {
    id: 'welcome',
    role: 'assistant' as const,
    content: `Hi! I'm an AI assistant that will answer questions about ${candidateName} honestly. I won't oversell or dodge difficult questions.\n\nAsk me anything - weaknesses, gaps, why they left jobs, salary expectations. I'll give you the real picture.`,
    session_id: '',
    created_at: '',
  }

  const allMessages = [welcomeMessage, ...messages]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput('')
    await sendMessage(message)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="size-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">Ask AI About Me</h3>
                  <p className="text-xs text-muted-foreground">Brutally honest answers</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {allMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={message.role === 'assistant' ? 'bg-accent/20 text-accent' : 'bg-muted'}>
                        {message.role === 'assistant' ? 'AI' : 'You'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-accent/20 text-accent">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <MessageSquare className="size-3 inline mr-1" />
                AI responses are based on honest self-reported data
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
