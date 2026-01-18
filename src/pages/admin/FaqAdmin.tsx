import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Save, X, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/hooks/useFaqs'
import type { FaqResponse } from '@/types/database'

const faqSchema = z.object({
  question: z.string().min(1, 'Question required'),
  answer: z.string().min(1, 'Answer required'),
  is_common_question: z.boolean(),
})

type FaqForm = z.infer<typeof faqSchema>

export default function FaqAdmin() {
  const { data: faqs = [], isLoading } = useFaqs()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()
  const deleteFaqMutation = useDeleteFaq()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
  })

  const openNewDialog = () => {
    reset({
      question: '',
      answer: '',
      is_common_question: false,
    })
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (faq: FaqResponse) => {
    reset({
      question: faq.question,
      answer: faq.answer,
      is_common_question: faq.is_common_question,
    })
    setEditingId(faq.id)
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: FaqForm) => {
    const faqData = {
      question: data.question,
      answer: data.answer,
      is_common_question: data.is_common_question,
    }

    if (editingId) {
      await updateFaq.mutateAsync({ id: editingId, ...faqData })
    } else {
      await createFaq.mutateAsync(faqData)
    }

    setIsDialogOpen(false)
  }

  const handleDeleteFaq = async (id: string) => {
    if (confirm('Delete this FAQ?')) {
      await deleteFaqMutation.mutateAsync(id)
    }
  }

  const commonFaqs = faqs.filter(f => f.is_common_question)
  const otherFaqs = faqs.filter(f => !f.is_common_question)

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
          <h1 className="font-serif text-3xl font-bold">FAQ Responses</h1>
          <p className="text-muted-foreground mt-1">
            Pre-written answers for consistent AI responses
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="size-4" />
          Add FAQ
        </Button>
      </div>

      {/* Common Questions */}
      {commonFaqs.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-medium flex items-center gap-2">
            <Star className="size-4 text-yellow-500" />
            Common Questions
          </h2>
          {commonFaqs.map((faq) => (
            <FaqCard key={faq.id} faq={faq} onEdit={openEditDialog} onDelete={handleDeleteFaq} />
          ))}
        </div>
      )}

      {/* Other Questions */}
      {otherFaqs.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-medium">Other Questions</h2>
          {otherFaqs.map((faq) => (
            <FaqCard key={faq.id} faq={faq} onEdit={openEditDialog} onDelete={handleDeleteFaq} />
          ))}
        </div>
      )}

      {faqs.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No FAQs yet. Add common questions employers might ask!</p>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>
              Pre-write honest answers for common questions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="What might employers ask?"
                {...register('question')}
              />
              {errors.question && <p className="text-sm text-destructive">{errors.question.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Your honest response"
                className="min-h-[150px]"
                {...register('answer')}
              />
              {errors.answer && <p className="text-sm text-destructive">{errors.answer.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_common_question" {...register('is_common_question')} />
              <Label htmlFor="is_common_question" className="cursor-pointer">
                This is a common question (shown prominently)
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

function FaqCard({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FaqResponse
  onEdit: (faq: FaqResponse) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            {faq.question}
            {faq.is_common_question && (
              <Badge variant="outline" className="text-xs">Common</Badge>
            )}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(faq)}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(faq.id)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
      </CardContent>
    </Card>
  )
}
