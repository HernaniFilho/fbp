import { memberSchema } from '#/features/staff/schemas/staff'
import { staffKeys } from '#/features/staff/service/staffService'
import { apiClient } from '#/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { missionsSchema, type Mission } from '../schemas/missions'

// ─── Server Functions ────────────────────────────────────────────────────────

export const evaluateStaffMembers = createServerFn({ method: 'POST' }).handler(
  async () => {
    await apiClient.post('board/staff-evaluation')
    return null
  },
)

export const evaluateStaffMember = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { data } = await apiClient.post(`board/evaluate/${id}`)
    return memberSchema.parse(data)
  })

export const getMissions = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Mission[]> => {
    const { data } = await apiClient.get('board/missions')
    return missionsSchema.parse(data)
  },
)

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const missionKeys = {
  all: ['missions'] as const,
  lists: () => [...missionKeys.all, 'lists'] as const,
}

// ─── Query Options ───────────────────────────────────────────────────────────

export const missionsQueryOptions = {
  queryKey: missionKeys.lists(),
  queryFn: () => getMissions(),
  staleTime: 5 * 1000 * 60,
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useMissions() {
  return missionsQueryOptions
}

export function useEvaluateStaffMembers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => evaluateStaffMembers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      toast.success(`Staff members have been evaluated for paranormal level`)
    },
    onError: (error) => {
      toast.error(`Failed to evaluate staff members: ${error.message}`)
    },
  })
}

export function useEvaluateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name: _name }: { id: string; name: string }) =>
      evaluateStaffMember({ data: id }),
    onSuccess: (_, { id: _id, name }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      toast.success(
        `Staff member ${name} has been evaluated for paranormal level`,
      )
    },
    onError: (error) => {
      toast.error(`Failed to evaluate staff member: ${error.message}`)
    },
  })
}
