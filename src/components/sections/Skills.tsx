import { motion } from 'framer-motion'
import { TrendingUp, Minus, Sprout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Skill } from '@/types/database'

interface SkillsProps {
  skills: Skill[]
}

// Categorize skills by self_rating
// Strong: 7-10, Moderate: 5-6, Growth: 1-4
function getStrengthCategory(rating: number | null): 'strong' | 'moderate' | 'growth' {
  if (!rating || rating < 5) return 'growth'
  if (rating < 7) return 'moderate'
  return 'strong'
}

const categoryConfig = {
  strong: {
    title: 'Strong',
    description: 'I can hit the ground running',
    icon: TrendingUp,
    iconColor: 'text-green-400',
    badgeVariant: 'success' as const,
  },
  moderate: {
    title: 'Moderate',
    description: 'Competent with some ramp-up',
    icon: Minus,
    iconColor: 'text-yellow-400',
    badgeVariant: 'warning' as const,
  },
  growth: {
    title: 'Growth Areas',
    description: 'Learning or want to learn',
    icon: Sprout,
    iconColor: 'text-blue-400',
    badgeVariant: 'secondary' as const,
  },
}

function SkillBadge({ skill, category }: { skill: Skill; category: keyof typeof categoryConfig }) {
  const hasTooltip = skill.evidence || skill.honest_notes

  const badge = (
    <Badge
      variant={categoryConfig[category].badgeVariant}
      className="cursor-default hover:opacity-80 transition-opacity"
    >
      {skill.skill_name}
      {skill.self_rating && (
        <span className="ml-1 opacity-70">({skill.self_rating}/10)</span>
      )}
    </Badge>
  )

  if (!hasTooltip) return badge

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          {skill.evidence && (
            <p className="text-sm"><span className="font-medium">Evidence:</span> {skill.evidence}</p>
          )}
          {skill.honest_notes && (
            <p className="text-sm text-muted-foreground italic">{skill.honest_notes}</p>
          )}
          {skill.years_experience !== null && skill.years_experience !== undefined && (
            <p className="text-xs text-muted-foreground">{skill.years_experience} years experience</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function SkillColumn({ category, skills }: { category: keyof typeof categoryConfig; skills: Skill[] }) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${config.iconColor}`} />
          <CardTitle className="text-lg">{config.title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} category={category} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">None listed</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills by strength category derived from self_rating
  const groupedSkills = {
    strong: skills.filter(s => getStrengthCategory(s.self_rating) === 'strong'),
    moderate: skills.filter(s => getStrengthCategory(s.self_rating) === 'moderate'),
    growth: skills.filter(s => getStrengthCategory(s.self_rating) === 'growth'),
  }

  return (
    <TooltipProvider>
      <section id="skills" className="py-16 bg-muted/20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Skills</h2>
            <p className="text-muted-foreground mt-2">
              Honest self-assessment. Hover for details.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <SkillColumn category="strong" skills={groupedSkills.strong} />
            <SkillColumn category="moderate" skills={groupedSkills.moderate} />
            <SkillColumn category="growth" skills={groupedSkills.growth} />
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  )
}
