import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  title: z.string().min(1, 'Title is required'),
  elevator_pitch: z.string().optional(),
  career_narrative: z.string().optional(),
  looking_for: z.string().optional(),
  not_looking_for: z.string().optional(),
  location: z.string().optional(),
  remote_preference: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  availability_status: z.enum(['actively_looking', 'open', 'not_looking']),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

// Placeholder data - will be replaced with Supabase fetch
const placeholderProfile: ProfileForm = {
  name: 'Blaine Holt',
  email: 'blaine@example.com',
  title: 'Senior Product Manager',
  elevator_pitch: 'I ship products that solve real problems. Brutally honest about what I can and cannot do.',
  career_narrative: 'Started in customer success, transitioned to PM by being the person who always knew what customers needed.',
  looking_for: 'Strong product culture, clear business metrics, engineers who want a PM partner',
  not_looking_for: 'Feature factories, PM as project management, shipping by committee',
  location: 'San Francisco, CA',
  remote_preference: 'hybrid',
  availability_status: 'actively_looking',
  github_url: '',
  linkedin_url: 'https://linkedin.com/in/blaineholt',
  twitter_url: '',
}

export default function ProfileAdmin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: placeholderProfile,
  })

  const onSubmit = async (data: ProfileForm) => {
    // Will be replaced with Supabase update
    console.log('Saving profile:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Profile saved! (Demo mode - not persisted)')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your basic information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your name and contact details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" placeholder="e.g., Senior Software Engineer" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Narrative */}
        <Card>
          <CardHeader>
            <CardTitle>Your Story</CardTitle>
            <CardDescription>Help AI understand and represent you accurately</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="elevator_pitch">Elevator Pitch</Label>
              <Textarea
                id="elevator_pitch"
                placeholder="A brief, honest summary of who you are"
                {...register('elevator_pitch')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_narrative">Career Narrative</Label>
              <Textarea
                id="career_narrative"
                placeholder="The story of your career - motivations, transitions, growth"
                className="min-h-[150px]"
                {...register('career_narrative')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Job Preferences</CardTitle>
            <CardDescription>What you're looking for (and not looking for)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="looking_for">Looking For</Label>
                <Textarea
                  id="looking_for"
                  placeholder="What makes a role attractive to you"
                  {...register('looking_for')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="not_looking_for">Not Looking For</Label>
                <Textarea
                  id="not_looking_for"
                  placeholder="Deal breakers and red flags"
                  {...register('not_looking_for')}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" {...register('location')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remote_preference">Remote Preference</Label>
                <select
                  id="remote_preference"
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  {...register('remote_preference')}
                >
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability_status">Availability</Label>
                <select
                  id="availability_status"
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  {...register('availability_status')}
                >
                  <option value="actively_looking">Actively Looking</option>
                  <option value="open">Open to Opportunities</option>
                  <option value="not_looking">Not Currently Looking</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Where people can find you online</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub</Label>
              <Input id="github_url" placeholder="https://github.com/..." {...register('github_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" placeholder="https://linkedin.com/in/..." {...register('linkedin_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter</Label>
              <Input id="twitter_url" placeholder="https://twitter.com/..." {...register('twitter_url')} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
