import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { SEX_LABELS, type Member } from '../schemas/staff'

type MemberCardPropsLoading = {
  isLoading: true
}

type MemberCardPropsLoaded = {
  isLoading?: false
  member: Member
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}
type MemberCardProps = MemberCardPropsLoading | MemberCardPropsLoaded

export default function MemberCard(props: MemberCardProps) {
  if (props.isLoading)
    return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-60 rounded-none" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-8 w-10 rounded-none" />
                <Skeleton className="h-6 w-5 rounded-none" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-row justify-between w-full gap-2">
            <div className="flex flex-row gap-2">
              <Skeleton className="h-8 w-20 rounded-none" />
              <Skeleton className="h-8 w-20 rounded-none" />
            </div>
            <Skeleton className="h-8 w-20 rounded-none" />
          </div>
        </CardFooter>
      </Card>
    )

  const { member, onView, onEdit, onDelete } = props

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-3xl text-destructive font-serif font-bold">
          {member.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col">
            <h3 className="font-semibold break-normal">Age</h3>
            <p className="text-muted-foreground">{member.age}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold break-normal">Sex</h3>
            <p className="text-muted-foreground">{SEX_LABELS[member.sex]}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold break-normal">Paranormal Level</h3>
            <p className="text-muted-foreground">
              {member.paranormalLevel ?? 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row justify-between w-full gap-2">
          <div className="flex flex-row gap-2">
            <Button
              variant="secondary"
              onClick={onView}
              className="rounded-none w-20"
            >
              View
            </Button>
            <Button
              variant="secondary"
              onClick={onEdit}
              className="rounded-none w-20"
            >
              Edit
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="rounded-none w-20"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
