import z from 'zod'

export const SEX = z.enum(['male', 'female', 'other', 'not_specified'])
export type Sex = z.infer<typeof SEX>
export const SEX_LABELS: Record<Sex, string> = {
  not_specified: 'N/A',
  male: 'Male',
  female: 'Female',
  other: 'Other',
}
export const AGE_SPECIAL_VALUES = ['not_specified', 'infinite'] as const
export const AGE = z.union([z.number().min(18), z.enum(AGE_SPECIAL_VALUES)])
export type Age = z.infer<typeof AGE>
export const AGE_SPECIAL_LABELS: Record<
  (typeof AGE_SPECIAL_VALUES)[number],
  string
> = {
  not_specified: 'N/A',
  infinite: 'Infinite',
}
export const HANDEDNESS = z.enum([
  'left',
  'right',
  'ambidextrous',
  'not_specified',
])
export const HANDEDNESS_LABELS: Record<Handedness, string> = {
  not_specified: 'N/A',
  left: 'Left',
  right: 'Right',
  ambidextrous: 'Ambidextrous',
}
export type Handedness = z.infer<typeof HANDEDNESS>
export const PARANORMAL_EVENT_TYPE = z.enum([
  'artefact',
  'place',
  'entity',
  'spontaneous',
  'not_specified',
])
export type ParanormalEventType = z.infer<typeof PARANORMAL_EVENT_TYPE>
export const PARANORMAL_EVENT_TYPE_LABELS: Record<ParanormalEventType, string> =
  {
    not_specified: 'N/A',
    artefact: 'Artefact',
    place: 'Place',
    entity: 'Entity',
    spontaneous: 'Spontaneous',
  }

export const memberSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(255),
  // Biological
  sex: SEX,
  age: AGE,
  handedness: HANDEDNESS,
  hasParanormalParent: z.boolean(),
  // Exposure
  numberOfMissions: z.number().min(0),
  serviceTime: z.number().min(0),
  // Paranormal events
  hadParanormalEvent: z.boolean(),
  ageOfFirstParanormalEvent: AGE.optional(),
  typeOfFirstParanormalEvent: PARANORMAL_EVENT_TYPE.optional(),
  // Paranormal Level
  paranormalLevel: z.number().min(0).max(100).optional(),
})
export type Member = z.infer<typeof memberSchema>
export const memberCreateSchema = memberSchema.omit({ id: true })
export type MemberCreateInput = z.infer<typeof memberCreateSchema>
export const memberCreateBackendSchema = memberCreateSchema.transform(
  (data) => ({
    ...data,
    age: String(data.age),
    ageOfFirstParanormalEvent:
      data.hadParanormalEvent && data.ageOfFirstParanormalEvent !== undefined
        ? String(data.ageOfFirstParanormalEvent)
        : undefined,
    typeOfFirstParanormalEvent:
      data.hadParanormalEvent && data.typeOfFirstParanormalEvent !== undefined
        ? data.typeOfFirstParanormalEvent
        : undefined,
  }),
)
export type MemberCreateOutput = z.infer<typeof memberCreateBackendSchema>
export const memberUpdateSchema = memberCreateSchema.omit({ name: true })
export type MemberUpdate = z.infer<typeof memberUpdateSchema>
export const StaffMembersSchema = z.array(memberSchema)
