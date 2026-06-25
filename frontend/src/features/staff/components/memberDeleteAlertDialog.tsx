import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'

type MemberDeleteAlertDialogProps = {
  memberName?: string | null | undefined
  onConfirm: () => void
  isOpen: boolean
  onCancel: () => void
}

export function MemberDeleteAlertDialog({
  memberName,
  onConfirm,
  isOpen,
  onCancel,
}: MemberDeleteAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Are you sure you want to delete this member?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <p>
            Once deleted, the{' '}
            <span className="text-primary font-bold">
              {memberName ?? 'member'}
            </span>
            's data will be permanently removed from the database.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} asChild>
            <Button className="rounded-none text-foreground">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button
              variant="destructive"
              className="rounded-none text-foreground"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
