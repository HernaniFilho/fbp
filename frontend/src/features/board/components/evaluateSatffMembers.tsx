import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge' // <-- seu badge do shadcn
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import MemberCard from '#/features/staff/components/memberCard'
import { staffMembersQueryOptions } from '#/features/staff/service/staffService'
import {
  useEvaluateStaffMember,
  useEvaluateStaffMembers,
} from '#/features/board/service/boardService'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function EvaluateStaffMembers() {
  const { data: members, isFetching } = useSuspenseQuery(
    staffMembersQueryOptions,
  )

  const evaluateAll = useEvaluateStaffMembers()
  const evaluateOne = useEvaluateStaffMember()

  const evaluated = members.filter((m) => m.paranormalLevel !== null)
  const pending = members.filter((m) => m.paranormalLevel === null)

  if (isFetching)
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <MemberCard isLoading={true} />
            </div>
          ))}
        </div>
      </div>
    )

  if (members.length === 0) return <p>No members found.</p>

  return (
    <Accordion type="multiple" defaultValue={['pending']} className="w-full">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  EVALUATED                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AccordionItem value="evaluated">
        <AccordionTrigger className="text-3xl font-bold uppercase tracking-wide text-primary hover:no-underline">
          <span className="flex items-center gap-3">
            Evaluated Staff
            <Badge variant="secondary" className="text-base px-3 py-1">
              {evaluated.length}
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {evaluated.length === 0 ? (
            <p className="text-muted-foreground italic py-4">
              No staff members have been evaluated yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
              {evaluated.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  otherButtons={
                    <Button
                      variant="secondary"
                      className="rounded-none opacity-60 cursor-not-allowed hover:opacity-80 hover:bg-secondary/80 transition-colors"
                      disabled
                    >
                      Evaluated — Level {m.paranormalLevel}
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PENDING                                                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AccordionItem value="pending">
        <AccordionTrigger className="text-2xl font-bold uppercase tracking-wide text-muted-foreground hover:no-underline">
          <span className="flex items-center gap-3">
            Pending Evaluation
            <Badge variant="outline" className="text-base px-3 py-1">
              {pending.length}
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex justify-end mb-4">
            {pending.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    className="rounded-none"
                    disabled={evaluateAll.isPending}
                  >
                    {evaluateAll.isPending ? 'Evaluating...' : 'Evaluate All'}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Evaluate all staff members?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will run a paranormal evaluation on every pending
                      staff member at once. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => evaluateAll.mutate()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Yes, evaluate all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {pending.length === 0 ? (
            <p className="text-muted-foreground italic py-4">
              All staff members have been evaluated.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {pending.map((m) => {
                const isEvaluatingThisMember =
                  evaluateOne.isPending && evaluateOne.variables?.id === m.id

                return (
                  <MemberCard
                    key={m.id}
                    member={m}
                    otherButtons={
                      <Button
                        variant="secondary"
                        className={[
                          'rounded-none transition-colors',
                          isEvaluatingThisMember
                            ? 'opacity-60 cursor-not-allowed hover:opacity-80 hover:bg-secondary/80'
                            : 'hover:bg-secondary/90',
                        ].join(' ')}
                        disabled={isEvaluatingThisMember}
                        onClick={() =>
                          evaluateOne.mutate({ id: m.id, name: m.name })
                        }
                      >
                        {isEvaluatingThisMember ? 'Evaluating...' : 'Evaluate'}
                      </Button>
                    }
                  />
                )
              })}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
