import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroProps {
  name: string
  title: string
  tagline?: string
  status: 'actively_looking' | 'open' | 'not_looking'
  companies: string[]
  onAskAI: () => void
}

const statusConfig = {
  actively_looking: { label: 'Actively Looking', variant: 'success' as const },
  open: { label: 'Open to Opportunities', variant: 'warning' as const },
  not_looking: { label: 'Not Currently Looking', variant: 'secondary' as const },
}

export default function Hero({
  name,
  title,
  tagline,
  status,
  companies,
  onAskAI,
}: HeroProps) {
  const statusInfo = statusConfig[status]

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge
              variant={statusInfo.variant}
              className={status === 'actively_looking' ? 'animate-pulse-glow' : ''}
            >
              <span className="relative flex size-2 mr-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${
                  status === 'actively_looking' ? 'bg-green-400 animate-ping' :
                  status === 'open' ? 'bg-yellow-400' : 'bg-zinc-400'
                } opacity-75`} />
                <span className={`relative inline-flex rounded-full size-2 ${
                  status === 'actively_looking' ? 'bg-green-500' :
                  status === 'open' ? 'bg-yellow-500' : 'bg-zinc-500'
                }`} />
              </span>
              {statusInfo.label}
            </Badge>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 font-serif text-5xl md:text-7xl font-bold tracking-tight"
          >
            {name}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl md:text-2xl text-muted-foreground"
          >
            {title}
          </motion.p>

          {/* Tagline */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-2 text-lg text-muted-foreground/80 max-w-2xl"
            >
              {tagline}
            </motion.p>
          )}

          {/* Company Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-muted-foreground hover:border-accent/50 hover:text-foreground transition-all glow-accent">
                  {company}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <Button size="lg" onClick={onAskAI} className="gap-2">
              <MessageSquare className="size-5" />
              Ask AI About Me
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
