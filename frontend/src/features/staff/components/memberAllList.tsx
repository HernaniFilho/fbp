import { useSuspenseQuery } from '@tanstack/react-query'
import { staffMembersQueryOptions } from '../service/staff'
import MemberCard from './memberCard'

export default function MemberAllList() {
  const { data: members, isFetching } = useSuspenseQuery(
    staffMembersQueryOptions,
  )

  if (isFetching)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <MemberCard isLoading={true} />
          </div>
        ))}
      </div>
    )

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
