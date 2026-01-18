import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Calendar, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Experience as ExperienceType } from '@/types/database'

interface ExperienceProps {
  experiences: ExperienceType[]
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const startDate = new Date(start)
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  if (isCurrent) return `${startStr} - Present`
  if (!end) return startStr

  const endDate = new Date(end)
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}

function ExperienceCard({ experience, index }: { experience: ExperienceType; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  const hasAiContext = experience.why_joined || experience.why_left ||
    experience.actual_contributions || experience.lessons_learned ||
    experience.challenges_faced || experience.would_do_differently

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass glow-accent">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl">{experience.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Building2 className="size-4" />
                <span>{experience.company_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {experience.is_current && (
                <Badge variant="success">Current</Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>{formatDateRange(experience.start_date, experience.end_date, experience.is_current)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bullet Points */}
          {experience.bullet_points && experience.bullet_points.length > 0 && (
            <ul className="space-y-2">
              {experience.bullet_points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-1.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Proudest Achievement */}
          {experience.proudest_achievement && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm">
                <span className="font-medium text-accent">Proudest achievement: </span>
                <span className="text-foreground">{experience.proudest_achievement}</span>
              </p>
            </div>
          )}

          {/* AI Context - Expandable */}
          {hasAiContext && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-between p-2 rounded-lg hover:bg-muted/50">
                <span>AI Context (what the AI knows about this role)</span>
                <ChevronDown className={cn(
                  "size-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
              </CollapsibleTrigger>
              <AnimatePresence>
                {isOpen && (
                  <CollapsibleContent forceMount>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3 p-4 rounded-lg border border-border bg-muted/30">
                        {experience.why_joined && (
                          <ContextItem label="Why I joined" value={experience.why_joined} />
                        )}
                        {experience.why_left && (
                          <ContextItem label="Why I left" value={experience.why_left} />
                        )}
                        {experience.actual_contributions && (
                          <ContextItem label="Actual contributions" value={experience.actual_contributions} />
                        )}
                        {experience.challenges_faced && (
                          <ContextItem label="Challenges faced" value={experience.challenges_faced} />
                        )}
                        {experience.lessons_learned && (
                          <ContextItem label="Lessons learned" value={experience.lessons_learned} />
                        )}
                        {experience.would_do_differently && (
                          <ContextItem label="Would do differently" value={experience.would_do_differently} />
                        )}
                        {experience.manager_would_say && (
                          <ContextItem label="Manager would say" value={experience.manager_would_say} />
                        )}
                      </div>
                    </motion.div>
                  </CollapsibleContent>
                )}
              </AnimatePresence>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  )
}

export default function Experience({ experiences }: ExperienceProps) {
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1
    if (!a.is_current && b.is_current) return 1
    return a.display_order - b.display_order
  })

  return (
    <section id="experience" className="py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Experience</h2>
          <p className="text-muted-foreground mt-2">
            What I've done, with honest context about each role.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sortedExperiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
