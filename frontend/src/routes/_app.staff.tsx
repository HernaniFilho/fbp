import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import MemberCreateForm from '#/features/staff/components/memberCreateForm'
import { createFileRoute } from '@tanstack/react-router'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/_app/staff')({
  component: Staff,
})

function Staff() {
  const [currentTab, setCurrentTab] = useState('all')

  return (
    <div className="mx-6 mt-6 flex flex-col gap-6">
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        orientation="horizontal"
      >
        <TabsList variant="line">
          <TabsTrigger value="all" className="font-semibold">
            All
          </TabsTrigger>
          <TabsTrigger value="register" className="font-semibold">
            Register
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Activity mode={currentTab === 'all' ? 'visible' : 'hidden'}>
          <h1>You are viewing all staff</h1>
        </Activity>
        <Activity mode={currentTab === 'register' ? 'visible' : 'hidden'}>
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-primary text-4xl md:text-6xl break-normal font-bold uppercase">
              Application Form
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              Please fill out the form below to register a new staff member for
              the facility. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit.
            </p>
            <MemberCreateForm />
          </div>
        </Activity>
      </div>
    </div>
  )
}
