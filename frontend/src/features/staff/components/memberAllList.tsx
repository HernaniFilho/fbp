import { useSuspenseQuery } from '@tanstack/react-query'
import { staffMembersQueryOptions } from '../service/staff'
import MemberCard from './memberCard'

export default function MemberAllList() {
  const { data: members } = useSuspenseQuery(staffMembersQueryOptions)

  if (members.length === 0) return <p>No members found.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {members.map((m) => (
        <MemberCard
          key={m.id}
          member={m}
          onView={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  )
}
