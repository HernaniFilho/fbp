import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  HANDEDNESS_LABELS,
  PARANORMAL_EVENT_TYPE_LABELS,
  SEX_LABELS,
  type Member,
} from '../schemas/staff'

type MemberViewDialogProps = {
  member: Member | null | undefined
  isOpen: boolean
  onClose: () => void
}

export default function MemberViewDialog({
  member,
  isOpen,
  onClose,
}: MemberViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="light rounded-none text-foreground">
        <DialogHeader className="text-start">
          <DialogTitle className="font-sans uppercase text-2xl">
            Federal Bureau of Paranormal Activities
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Keep this information confidential.
          </DialogDescription>
        </DialogHeader>
        <div>
          {member && (
            <div className="grid grid-cols-2 gap-2">
              <h1 className="col-span-full font-bold text-xl underline uppercase">
                Biological Information
              </h1>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Name
                </h2>
                <p>{member.name}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Age
                </h2>
                <p>{member.age}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Sex
                </h2>
                <p>{SEX_LABELS[member.sex]}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Paranormal Parent
                </h2>
                <p>{member.hasParanormalParent ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Handedness
                </h2>
                <p>{HANDEDNESS_LABELS[member.handedness]}</p>
              </div>
              <h1 className="col-span-full font-bold text-xl underline uppercase">
                Exposure History
              </h1>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Number of Missions
                </h2>
                <p>{member.numberOfMissions}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Service Time
                </h2>
                <p>{member.serviceTime}</p>
              </div>
              <h1 className="col-span-full font-bold text-xl underline uppercase">
                Paranormal Events
              </h1>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Paranormal Event Previously
                </h2>
                <p>{member.hadParanormalEvent ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Age of First Paranormal Event
                </h2>
                <p>{member.ageOfFirstParanormalEvent ?? 'N/A'}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="font-sans font-semibold text-sm uppercase">
                  Type of First Paranormal Event
                </h2>
                <p>
                  {
                    PARANORMAL_EVENT_TYPE_LABELS[
                      member.typeOfFirstParanormalEvent ?? 'not_specified'
                    ]
                  }
                </p>
              </div>
              <div className="col-span-full flex flex-row mr-8 items-center justify-between">
                <h1 className="font-bold text-xl uppercase">
                  Paranormal Level
                </h1>
                <p>{member.paranormalLevel ?? 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
