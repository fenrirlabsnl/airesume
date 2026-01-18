import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import Hero from '@/components/sections/Hero'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import JDAnalyzer from '@/components/sections/JDAnalyzer'
import ChatDrawer from '@/components/chat/ChatDrawer'
import { useProfile } from '@/hooks/useProfile'
import { useExperiences } from '@/hooks/useExperiences'
import { useSkills } from '@/hooks/useSkills'

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false)

  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: experiences, isLoading: experiencesLoading } = useExperiences()
  const { data: skills, isLoading: skillsLoading } = useSkills()

  const isLoading = profileLoading || experiencesLoading || skillsLoading

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-accent" />
        </div>
      </Layout>
    )
  }

  // Extract companies from experiences for Hero
  const companies = experiences?.map(exp => exp.company_name) || []

  // Map availability status
  const statusMap: Record<string, 'actively_looking' | 'open' | 'not_looking'> = {
    actively_looking: 'actively_looking',
    open: 'open',
    not_looking: 'not_looking',
  }
  const status = statusMap[profile?.availability_status || 'open'] || 'open'

  return (
    <Layout>
      <Hero
        name={profile?.name || 'Your Name'}
        title={profile?.title || 'Software Engineer'}
        tagline={profile?.elevator_pitch || 'Brutally honest about what I can and cannot do.'}
        status={status}
        companies={companies}
        onAskAI={() => setChatOpen(true)}
      />

      <Experience experiences={experiences || []} />

      <Skills skills={skills || []} />

      <JDAnalyzer />

      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        candidateName={profile?.name || 'the candidate'}
      />
    </Layout>
  )
}
