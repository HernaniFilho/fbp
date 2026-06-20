import z from 'zod'

export const SEX = z.enum(['male', 'female', 'other', 'n/a'])
export const HANDEDNESS = z.enum(['left', 'right', 'ambidextrous', 'n/a'])
export const PARANORMAL_EVENT_TYPE = z.enum([
  'artefact',
  'place',
  'entity',
  'spontaneous',
  'n/a',
])

export const memberSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(255),
  // Biological
  sex: SEX,
  age: z.union([z.number().min(0), z.enum(['inf', 'n/a'])]),
  handedness: HANDEDNESS,
  hasParanormalParent: z.boolean(),
  // Exposure
  numberOfMissions: z.number().min(0),
  serviceTime: z.number().min(0),
  // Paranormal events
  hadParanormalEvent: z.boolean(),
  ageOfFirstParanormalEvent: z.union([
    z.number().min(0),
    z.enum(['inf', 'n/a']),
  ]),
  typeOfFirstParanormalEvent: PARANORMAL_EVENT_TYPE,
  // Paranormal Level
  paranormalLevel: z.number().min(0).max(100),
})
export type Member = z.infer<typeof memberSchema>
export type MemberCreate = Omit<Member, 'id'>
export type MemberUpdate = Partial<Omit<MemberCreate, 'name'>>
