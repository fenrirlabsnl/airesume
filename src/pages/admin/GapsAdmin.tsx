import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useGaps, useCreateGap, useUpdateGap, useDeleteGap } from '@/hooks/useGaps'
import type { GapWeakness } from '@/types/database'

const gapSchema = z.object({
  gap_type: z.string().min(1, 'Gap type required'),
  description: z.string().min(1, 'Description required'),
  why_its_a_gap: z.string().optional(),
  interest_in_learning: z.boolean(),
})

type GapForm = z.infer<typeof gapSchema>

export default function GapsAdmin() {
  const { data: gaps = [], isLoading } = useGaps()
  const createGap = useCreateGap()
  const updateGap = useUpdateGap()
  const deleteGapMutation = useDeleteGap()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GapForm>({
    resolver: zodResolver(gapSchema),
  })

  const openNewDialog = () => {
    reset({
      gap_type: 'Technical',
      description: '',
      why_its_a_gap: '',
      interest_in_learning: true,
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (gap: GapWeakness) => {
    reset({
      gap_type: gap.gap_type,
      description: gap.description,
      why_its_a_gap: gap.why_its_a_gap || '',
      interest_in_learning: gap.interest_in_learning,
    })
    setEditingId(gap.id)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: GapForm) => {
    const gapData = {
      gap_type: data.gap_type,
      description: data.description,
      why_its_a_gap: data.why_its_a_gap || null,
      interest_in_learning: data.interest_in_learning,
    }

    if (editingId) {
      await updateGap.mutateAsync({ id: editingId, ...gapData })
    } else {
      await createGap.mutateAsync(gapData)
    }

    setIsDialogOpen(false)
  }

  const handleDeleteGap = async (id: string) => {
    if (confirm('Delete this gap?')) {
      await deleteGapMutation.mutateAsync(id)
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
          <h1 className="font-serif text-3xl font-bold">Gaps & Weaknesses</h1>
          <p className="text-muted-foreground mt-1">
            Be honest about areas for improvement
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="size-4" />
          Add Gap
        </Button>
      </div>

      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="size-5" />
            <CardTitle className="text-base">Why document weaknesses?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            These gaps are used by the AI to give honest assessments. When employers ask about weaknesses
            or role fit, the AI will reference these to provide genuine, helpful responses instead of
            generic answers. This builds trust and saves everyone time.
          </p>
        </CardContent>
      </Card>

      {/* Gaps List */}
      <div className="space-y-4">
        {gaps.map((gap) => (
          <Card key={gap.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {gap.description}
                  {gap.interest_in_learning && (
                    <Badge variant="outline" className="text-xs">Actively learning</Badge>
                  )}
                </CardTitle>
                <CardDescription>{gap.gap_type}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(gap)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteGap(gap.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            {gap.why_its_a_gap && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{gap.why_its_a_gap}</p>
              </CardContent>
            )}
          </Card>
        ))}

        {gaps.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No gaps documented yet. Being honest about weaknesses builds trust!</p>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Gap' : 'Add Gap'}</DialogTitle>
            <DialogDescription>
              Document areas where you need growth
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gap_type">Gap Type</Label>
              <select
                id="gap_type"
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                {...register('gap_type')}
              >
                <option value="Technical">Technical Skill</option>
                <option value="Soft Skill">Soft Skill</option>
                <option value="Domain">Domain Knowledge</option>
                <option value="Experience">Experience Gap</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What's the gap?"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="why_its_a_gap">Why It's a Gap</Label>
              <Textarea
                id="why_its_a_gap"
                placeholder="Be specific about what's missing"
                {...register('why_its_a_gap')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="interest_in_learning" {...register('interest_in_learning')} />
              <Label htmlFor="interest_in_learning" className="cursor-pointer">
                I'm interested in learning this
              </Label>
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
