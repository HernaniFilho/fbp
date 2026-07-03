import type { Member } from '../schemas/staff'

type MemberEditFormProps = {
  member: Member
  onSubmit: () => void
}

export default function MemberEditForm({
  member,
  onSubmit,
}: MemberEditFormProps) {
  return <div>Edit Member</div>
}
