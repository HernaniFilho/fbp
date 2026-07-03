import z from 'zod'

export const SEX = z.enum(['male', 'female', 'other', 'not_specified'])
export type Sex = z.infer<typeof SEX>
export const SEX_LABELS: Record<Sex, string> = {
  not_specified: 'N/A',
  male: 'Male',
  female: 'Female',
  other: 'Other',
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
  age: z.coerce.number().int().min(18),
  handedness: HANDEDNESS,
  hasParanormalParent: z.boolean(),
  // Exposure
  numberOfMissions: z.coerce.number().min(0),
  serviceTime: z.coerce.number().min(0),
  // Paranormal events
  hadParanormalEvent: z.boolean(),
  ageOfFirstParanormalEvent: z.coerce
    .number()
    .int()
    .min(0)
    .nullable()
    .optional(),
  typeOfFirstParanormalEvent: PARANORMAL_EVENT_TYPE.nullable().optional(),
  // Paranormal Level
  paranormalLevel: z.coerce.number().min(0).max(100).nullable().optional(),
})
export type Member = z.infer<typeof memberSchema>
export const memberCreateSchema = memberSchema.omit({ id: true })
export type MemberCreate = z.infer<typeof memberCreateSchema>
export const memberUpdateSchema = memberSchema.omit({ name: true })
export type MemberUpdate = z.infer<typeof memberUpdateSchema>
export const StaffMembersSchema = z.array(memberSchema)
