import z from 'zod'

export const SEX = z.enum(['male', 'female', 'other', 'n/a'])
export type Sex = z.infer<typeof SEX>
export const SEX_LABELS: Record<Sex, string> = {
  'n/a': 'N/A',
  male: 'Male',
  female: 'Female',
  other: 'Other',
}
export const AGE_SPECIAL_VALUES = ['n/a', 'inf'] as const
export const AGE = z.union([z.number().min(0), z.enum(AGE_SPECIAL_VALUES)])
export type Age = z.infer<typeof AGE>
export const AGE_SPECIAL_LABELS: Record<
  (typeof AGE_SPECIAL_VALUES)[number],
  string
> = {
  'n/a': 'N/A',
  inf: 'Infinite',
}
export const HANDEDNESS = z.enum(['left', 'right', 'ambidextrous', 'n/a'])
export const HANDEDNESS_LABELS: Record<Handedness, string> = {
  'n/a': 'N/A',
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
  'n/a',
])
export type ParanormalEventType = z.infer<typeof PARANORMAL_EVENT_TYPE>
export const PARANORMAL_EVENT_TYPE_LABELS: Record<ParanormalEventType, string> =
  {
    'n/a': 'N/A',
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
  ageOfFirstParanormalEvent: AGE,
  typeOfFirstParanormalEvent: PARANORMAL_EVENT_TYPE,
  // Paranormal Level
  paranormalLevel: z.number().min(0).max(100),
})
export type Member = z.infer<typeof memberSchema>
export const memberCreateSchema = memberSchema.omit({ id: true })
export type MemberCreate = z.infer<typeof memberCreateSchema>
export const memberUpdateSchema = memberCreateSchema.omit({ name: true })
export type MemberUpdate = z.infer<typeof memberUpdateSchema>
