import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import MemberAllList from '#/features/staff/components/memberAllList'
import MemberCreateForm from '#/features/staff/components/memberCreateForm'
import MemberEditForm from '#/features/staff/components/memberEditForm'
import { staffMembersQueryOptions } from '#/features/staff/service/staffService'
import { useAppStore } from '#/store/appStore'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Activity, useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/_app/staff')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(staffMembersQueryOptions),
  component: Staff,
})

function Staff() {
  const [currentTab, setCurrentTab] = useState('all')
  const { data: members } = useSuspenseQuery(staffMembersQueryOptions)

  const selectedStaffMemberId = useAppStore((s) => s.selectedStaffMemberId)
  const setSelectedStaffMemberId = useAppStore(
    (s) => s.setSelectedStaffMemberId,
  )

  const editingMember = useMemo(
    () => members.find((m) => m.id === selectedStaffMemberId) ?? null,
    [members, selectedStaffMemberId],
  )

  useEffect(() => {
    if (editingMember) setCurrentTab('edit')
  }, [editingMember])

  // Edge Case
  useEffect(() => {
    if (selectedStaffMemberId && !editingMember && currentTab === 'edit') {
      setCurrentTab('all')
      setSelectedStaffMemberId(null)
    }
  }, [selectedStaffMemberId, editingMember, currentTab])

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)

    if (tab !== 'edit' && selectedStaffMemberId) {
      setSelectedStaffMemberId(null)
    }
  }

  return (
    <div className="mx-6 mt-6 flex flex-col gap-6">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        orientation="horizontal"
      >
        <TabsList variant="line">
          <TabsTrigger value="all" className="font-semibold">
            All
          </TabsTrigger>
          <TabsTrigger value="register" className="font-semibold">
            Register
          </TabsTrigger>
          {editingMember && (
            <TabsTrigger value="edit" className="font-semibold">
              Edit
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Activity mode={currentTab === 'all' ? 'visible' : 'hidden'}>
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-center text-primary text-5xl md:text-6xl break-normal font-bold uppercase">
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
            <h2 className="self-center text-center text-primary text-5xl md:text-6xl break-normal font-bold uppercase">
              Application Form
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              Please fill out the form below to register a new staff member for
              the facility. Remember to save your changes when you're done.
            </p>
            <MemberCreateForm />
          </div>
        </Activity>
        <Activity mode={currentTab === 'edit' ? 'visible' : 'hidden'}>
          <div className="flex flex-col gap-2">
            <h2 className="self-center text-center text-primary text-5xl md:text-6xl break-normal font-bold uppercase">
              Update Member Details
            </h2>
            <p className="self-center text-muted-foreground text-justify mb-4">
              Please update the member's details below. Make sure to save your
              changes when you're done.
            </p>
            {editingMember && (
              <MemberEditForm
                member={editingMember}
                onSubmit={() => {
                  setSelectedStaffMemberId(null)
                  setCurrentTab('all')
                }}
              />
            )}
          </div>
        </Activity>
      </div>
    </div>
  )
}
