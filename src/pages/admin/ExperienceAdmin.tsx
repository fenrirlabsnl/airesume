import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from '@/hooks/useExperiences'
import type { Experience } from '@/types/database'

const experienceSchema = z.object({
  company_name: z.string().min(1, 'Company name required'),
  title: z.string().min(1, 'Job title required'),
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().optional(),
  is_current: z.boolean(),
  bullet_points: z.string(), // Will be split by newlines
  proudest_achievement: z.string().optional(),
  why_joined: z.string().optional(),
  why_left: z.string().optional(),
  actual_contributions: z.string().optional(),
  challenges_faced: z.string().optional(),
  lessons_learned: z.string().optional(),
  would_do_differently: z.string().optional(),
  manager_would_say: z.string().optional(),
})

type ExperienceForm = z.infer<typeof experienceSchema>

export default function ExperienceAdmin() {
  const { data: experiences = [], isLoading } = useExperiences()
  const createExperience = useCreateExperience()
  const updateExperience = useUpdateExperience()
  const deleteExperienceMutation = useDeleteExperience()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      is_current: false,
      bullet_points: '',
    },
  })

  const isCurrent = watch('is_current')

  const openNewDialog = () => {
    reset({
      company_name: '',
      title: '',
      start_date: '',
      end_date: '',
      is_current: false,
      bullet_points: '',
      proudest_achievement: '',
      why_joined: '',
      why_left: '',
      actual_contributions: '',
      challenges_faced: '',
      lessons_learned: '',
      would_do_differently: '',
      manager_would_say: '',
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (exp: Experience) => {
    reset({
      company_name: exp.company_name,
      title: exp.title,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      bullet_points: exp.bullet_points?.join('\n') || '',
      proudest_achievement: exp.proudest_achievement || '',
      why_joined: exp.why_joined || '',
      why_left: exp.why_left || '',
      actual_contributions: exp.actual_contributions || '',
      challenges_faced: exp.challenges_faced || '',
      lessons_learned: exp.lessons_learned || '',
      would_do_differently: exp.would_do_differently || '',
      manager_would_say: exp.manager_would_say || '',
    })
    setEditingId(exp.id)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: ExperienceForm) => {
    const experienceData = {
      company_name: data.company_name,
      title: data.title,
      title_progression: null,
      start_date: data.start_date,
      end_date: data.is_current ? null : data.end_date || null,
      is_current: data.is_current,
      bullet_points: data.bullet_points.split('\n').filter(Boolean),
      why_joined: data.why_joined || null,
      why_left: data.why_left || null,
      actual_contributions: data.actual_contributions || null,
      proudest_achievement: data.proudest_achievement || null,
      would_do_differently: data.would_do_differently || null,
      challenges_faced: data.challenges_faced || null,
      lessons_learned: data.lessons_learned || null,
      manager_would_say: data.manager_would_say || null,
      reports_would_say: null,
      quantified_impact: null,
      display_order: experiences.length + 1,
    }

    if (editingId) {
      await updateExperience.mutateAsync({ id: editingId, ...experienceData })
    } else {
      await createExperience.mutateAsync(experienceData)
    }

    setIsDialogOpen(false)
  }

  const handleDeleteExperience = async (id: string) => {
    if (confirm('Delete this experience?')) {
      await deleteExperienceMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage your work history with honest context
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="size-4" />
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {exp.title}
                  {exp.is_current && <Badge variant="success">Current</Badge>}
                </CardTitle>
                <CardDescription>{exp.company_name}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteExperience(exp.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                {' - '}
                {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
              {exp.bullet_points && exp.bullet_points.length > 0 && (
                <ul className="mt-2 text-sm space-y-1">
                  {exp.bullet_points.slice(0, 2).map((point, i) => (
                    <li key={i} className="text-muted-foreground">• {point}</li>
                  ))}
                  {exp.bullet_points.length > 2 && (
                    <li className="text-muted-foreground">+ {exp.bullet_points.length - 2} more</li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        {experiences.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No experiences yet. Add your first one!</p>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription>
              Include both public info and private AI context
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" {...register('company_name')} />
                {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...register('start_date')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" disabled={isCurrent} {...register('end_date')} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register('is_current')} className="rounded" />
                  <span className="text-sm">Current role</span>
                </label>
              </div>
            </div>

            {/* Public Description */}
            <div className="space-y-2">
              <Label htmlFor="bullet_points">Bullet Points (one per line)</Label>
              <Textarea
                id="bullet_points"
                placeholder="Led migration of monolithic app&#10;Mentored 3 junior engineers&#10;Reduced deployment time by 80%"
                className="min-h-[100px]"
                {...register('bullet_points')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proudest_achievement">Proudest Achievement</Label>
              <Input id="proudest_achievement" placeholder="What are you most proud of from this role?" {...register('proudest_achievement')} />
            </div>

            {/* AI Context Section */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">AI Context (Private - only used by AI)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="why_joined">Why You Joined</Label>
                  <Textarea id="why_joined" placeholder="What attracted you to this role?" {...register('why_joined')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="why_left">Why You Left</Label>
                  <Textarea id="why_left" placeholder="Honest reason for leaving" {...register('why_left')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_contributions">Actual Contributions</Label>
                  <Textarea id="actual_contributions" placeholder="What did you really do? Be honest." {...register('actual_contributions')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenges_faced">Challenges Faced</Label>
                  <Textarea id="challenges_faced" placeholder="What was hard about this role?" {...register('challenges_faced')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessons_learned">Lessons Learned</Label>
                  <Textarea id="lessons_learned" placeholder="What did this role teach you?" {...register('lessons_learned')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="would_do_differently">Would Do Differently</Label>
                  <Textarea id="would_do_differently" placeholder="Looking back, what would you change?" {...register('would_do_differently')} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="manager_would_say">What Your Manager Would Say</Label>
                  <Textarea id="manager_would_say" placeholder="Honestly, how would your manager describe you?" {...register('manager_would_say')} />
                </div>
              </div>
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
