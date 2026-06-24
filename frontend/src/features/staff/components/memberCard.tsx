import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { SEX_LABELS, type Member } from '../schemas/staff'

type MemberCardProps = {
  member: Member
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function MemberCard({
  member,
  onView,
  onEdit,
  onDelete,
}: MemberCardProps) {
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
            <h3 className="font-semibold">Age</h3>
            <p className="text-muted-foreground">{member.age}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold">Sex</h3>
            <p className="text-muted-foreground">{SEX_LABELS[member.sex]}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold">Paranormal Level</h3>
            <p className="text-muted-foreground">
              {member.paranormalLevel ?? 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row justify-between w-full gap-2">
          <div className="flex flex-row gap-2">
            <Button variant="default" onClick={onView} className="rounded-none">
              View
            </Button>
            <Button
              variant="secondary"
              onClick={onEdit}
              className="rounded-none"
            >
              Edit
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="rounded-none"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
