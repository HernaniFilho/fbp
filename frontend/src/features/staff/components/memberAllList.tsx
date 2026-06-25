import { useSuspenseQuery } from '@tanstack/react-query'
import {
  staffMembersQueryOptions,
  useDeleteStaffMember,
} from '../service/staff'
import MemberCard from './memberCard'
import { useState } from 'react'
import type { Member } from '../schemas/staff'
import MemberViewDialog from './memberViewDialog'
import { MemberDeleteAlertDialog } from './memberDeleteAlertDialog'

export default function MemberAllList() {
  const { data: members, isFetching } = useSuspenseQuery(
    staffMembersQueryOptions,
  )
  const { mutateAsync: deleteStaffMember } = useDeleteStaffMember()

  const [viewingMember, setViewingMember] = useState<Member | null>(null)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)

  if (isFetching)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="">
            <MemberCard isLoading={true} />
          </div>
        ))}
      </div>
    )

  if (members.length === 0) return <p>No members found.</p>

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            onView={() => setViewingMember(m)}
            onEdit={() => {}}
            onDelete={() => setDeletingMember(m)}
          />
        ))}
      </div>

      <MemberViewDialog
        member={viewingMember}
        isOpen={viewingMember !== null}
        onClose={() => setViewingMember(null)}
      />

      <MemberDeleteAlertDialog
        memberName={deletingMember?.name}
        isOpen={deletingMember !== null}
        onCancel={() => setDeletingMember(null)}
        onConfirm={() => {
          deleteStaffMember({
            id: deletingMember!.id,
            name: deletingMember!.name,
          })
          setDeletingMember(null)
        }}
      />
    </>
  )
}
