import z from 'zod'

export const missionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
})
export type Mission = z.infer<typeof missionSchema>
export const missionsSchema = z.array(missionSchema)
