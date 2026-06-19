import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/staff')({
  component: Staff,
})

function Staff() {
  return <div>WIP see staff here</div>
}
