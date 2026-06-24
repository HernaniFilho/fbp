import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import MemberAllList from '#/features/staff/components/memberAllList'
import MemberCreateForm from '#/features/staff/components/memberCreateForm'
import { staffMembersQueryOptions } from '#/features/staff/service/staff'
import { createFileRoute } from '@tanstack/react-router'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/_app/staff')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(staffMembersQueryOptions),
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
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-primary text-4xl md:text-6xl break-normal font-bold uppercase">
              Staff Members
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              Here you can view and manage all staff members. Feel free to add a
              new member, update an existing one or delete a member.
            </p>
            <MemberAllList />
          </div>
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
