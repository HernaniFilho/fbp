import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import MemberCreateForm from '#/features/staff/components/memberCreateForm'
import { useIsMobile } from '#/hooks/use-mobile'
import { createFileRoute } from '@tanstack/react-router'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/_app/staff')({
  component: Staff,
})

function Staff() {
  const [currentTab, setCurrentTab] = useState('all')
  const isMobile = useIsMobile()

  return (
    <div className="mx-6 mt-6 flex flex-col md:flex-row gap-6">
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        orientation={isMobile ? 'horizontal' : 'vertical'}
      >
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Activity mode={currentTab === 'all' ? 'visible' : 'hidden'}>
          <h1>You are viewing all staff</h1>
        </Activity>
        <Activity mode={currentTab === 'register' ? 'visible' : 'hidden'}>
          <MemberCreateForm />
        </Activity>
      </div>
    </div>
  )
}
