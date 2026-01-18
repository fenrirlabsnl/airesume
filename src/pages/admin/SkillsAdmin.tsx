import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Loader2, TrendingUp, Minus, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { Skill } from '@/types/database'

const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name required'),
  category: z.string().min(1, 'Category required'),
  self_rating: z.number().min(1).max(10),
  evidence: z.string().optional(),
  honest_notes: z.string().optional(),
  years_experience: z.number().min(0).optional(),
})

type SkillForm = z.infer<typeof skillSchema>

// Categorize skills by self_rating for display
// Strong: 7-10, Moderate: 5-6, Growth: 1-4
function getStrengthLevel(rating: number | null): 'strong' | 'moderate' | 'growth' {
  if (!rating || rating < 5) return 'growth'
  if (rating < 7) return 'moderate'
  return 'strong'
}

const strengthConfig = {
  strong: { label: 'Strong', icon: TrendingUp, variant: 'success' as const, color: 'text-green-400' },
  moderate: { label: 'Moderate', icon: Minus, variant: 'warning' as const, color: 'text-yellow-400' },
  growth: { label: 'Growth', icon: Sprout, variant: 'secondary' as const, color: 'text-blue-400' },
}

// Placeholder data
const initialSkills: Skill[] = [
  { id: '1', skill_name: 'Product Strategy', category: 'Product', self_rating: 9, evidence: '$50M+ ARR products', honest_notes: 'Best in B2C consumer', years_experience: 5, last_used: null, created_at: '', updated_at: '' },
  { id: '2', skill_name: 'User Research', category: 'Research', self_rating: 8, evidence: '200+ interviews', honest_notes: 'Sometimes over-index on qualitative', years_experience: 6, last_used: null, created_at: '', updated_at: '' },
  { id: '3', skill_name: 'SQL', category: 'Technical', self_rating: 6, evidence: 'Basic queries, joins', honest_notes: 'Call data team for complex work', years_experience: 3, last_used: null, created_at: '', updated_at: '' },
  { id: '4', skill_name: 'Public Speaking', category: 'Leadership', self_rating: 4, evidence: 'Team meetings only', honest_notes: 'Working on this', years_experience: 2, last_used: null, created_at: '', updated_at: '' },
]

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
  })

  const openNewDialog = () => {
    reset({
      skill_name: '',
      category: 'Technical',
      self_rating: 5,
      evidence: '',
      honest_notes: '',
      years_experience: 0,
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (skill: Skill) => {
    reset({
      skill_name: skill.skill_name,
      category: skill.category,
      self_rating: skill.self_rating || 5,
      evidence: skill.evidence || '',
      honest_notes: skill.honest_notes || '',
      years_experience: skill.years_experience || 0,
    })
    setEditingId(skill.id)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: SkillForm) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const skillData: Skill = {
      id: editingId || Date.now().toString(),
      skill_name: data.skill_name,
      category: data.category,
      self_rating: data.self_rating,
      evidence: data.evidence || null,
      honest_notes: data.honest_notes || null,
      years_experience: data.years_experience || null,
      last_used: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      setSkills(prev => prev.map(s => s.id === editingId ? skillData : s))
    } else {
      setSkills(prev => [...prev, skillData])
    }

    setIsDialogOpen(false)
  }

  const deleteSkill = (id: string) => {
    if (confirm('Delete this skill?')) {
      setSkills(prev => prev.filter(s => s.id !== id))
    }
  }

  // Group skills by strength level (derived from self_rating)
  const groupedSkills = {
    strong: skills.filter(s => getStrengthLevel(s.self_rating) === 'strong'),
    moderate: skills.filter(s => getStrengthLevel(s.self_rating) === 'moderate'),
    growth: skills.filter(s => getStrengthLevel(s.self_rating) === 'growth'),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Honest self-assessment of your abilities
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="size-4" />
          Add Skill
        </Button>
      </div>

      {/* Skills by Strength Level */}
      <div className="grid gap-6 md:grid-cols-3">
        {(['strong', 'moderate', 'growth'] as const).map((level) => {
          const config = strengthConfig[level]
          const Icon = config.icon
          return (
            <Card key={level}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`size-5 ${config.color}`} />
                  {config.label}
                  <Badge variant={config.variant}>
                    {groupedSkills[level].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedSkills[level].map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group"
                  >
                    <div>
                      <div className="font-medium text-sm">{skill.skill_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {skill.category} · {skill.self_rating}/10
                        {skill.years_experience && ` · ${skill.years_experience}y exp`}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => openEditDialog(skill)}>
                        <Pencil className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => deleteSkill(skill.id)}>
                        <Trash2 className="size-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {groupedSkills[level].length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No skills in this level
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogDescription>
              Be honest about your proficiency level
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill_name">Skill Name</Label>
              <Input id="skill_name" placeholder="e.g., TypeScript" {...register('skill_name')} />
              {errors.skill_name && <p className="text-sm text-destructive">{errors.skill_name.message}</p>}
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  {...register('category')}
                >
                  <option value="Language">Language</option>
                  <option value="Framework">Framework</option>
                  <option value="Runtime">Runtime</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="DevOps">DevOps</option>
                  <option value="API">API</option>
                  <option value="AI">AI/ML</option>
                  <option value="Tool">Tool</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="self_rating">Self Rating (1-10)</Label>
                <Input
                  id="self_rating"
                  type="number"
                  min={1}
                  max={10}
                  {...register('self_rating', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  7-10 = Strong, 5-6 = Moderate, 1-4 = Growth
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min={0}
                {...register('years_experience', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence</Label>
              <Input id="evidence" placeholder="What proves this rating?" {...register('evidence')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="honest_notes">Honest Notes</Label>
              <Textarea
                id="honest_notes"
                placeholder="Any caveats or limitations? Be honest."
                {...register('honest_notes')}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="size-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="size-4 animate-spin" />Saving...</>
                ) : (
                  <><Save className="size-4" />Save</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
