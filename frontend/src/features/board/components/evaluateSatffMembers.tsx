import { Button } from '#/components/ui/button'
import MemberCard from '#/features/staff/components/memberCard'
import { staffMembersQueryOptions } from '#/features/staff/service/staffService'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function EvaluateStaffMembers() {
  const { data: members, isFetching } = useSuspenseQuery(
    staffMembersQueryOptions,
  )

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
    <div className="flex flex-col items-center gap-4">
      <Button variant="default" className="rounded-none w-fit">
        Evaluate All
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            otherButtons={
              <>
                <Button variant="secondary" className="rounded-none">
                  Evaluate
                </Button>
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}
