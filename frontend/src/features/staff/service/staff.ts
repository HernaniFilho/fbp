'use server'
import { createServerFn } from '@tanstack/react-start'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { apiClient } from '#/lib/api-client'
import {
  memberSchema,
  StaffMembersSchema,
  type Member,
  type MemberCreate,
} from '../schemas/staff'

type MemberCreateJSON = Omit<
  MemberCreate,
  | 'age'
  | 'ageOfFirstParanormalEvent'
  | 'typeOfFirstParanormalEvent'
  | 'paranormalLevel'
> & {
  age: string | number
  ageOfFirstParanormalEvent?: string | number | null
  typeOfFirstParanormalEvent?: string | null
  paranormalLevel?: number | null
}

// ─── Server Functions ────────────────────────────────────────────────────────

export const getStaffMembers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Member[]> => {
    const { data } = await apiClient.get('/staff')
    return StaffMembersSchema.parse(data)
  },
)

export const createStaffMember = createServerFn({ method: 'POST' })
  .validator((data: MemberCreateJSON) => ({
    ...data,
    age: Number(data.age),
    ageOfFirstParanormalEvent:
      data.ageOfFirstParanormalEvent != null
        ? Number(data.ageOfFirstParanormalEvent)
        : undefined,
    typeOfFirstParanormalEvent: data.typeOfFirstParanormalEvent ?? undefined,
    paranormalLevel: data.paranormalLevel ?? undefined,
  }))
  .handler(async ({ data: payload }) => {
    const { data } = await apiClient.post('/staff', payload)
    return memberSchema.parse(data)
  })

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
}

// ─── Query Options ───────────────────────────────────────────────────────────

export const staffMembersQueryOptions = queryOptions({
  queryKey: staffKeys.lists(),
  queryFn: () => getStaffMembers(),
  staleTime: 5 * 1000 * 60,
})

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useStaffMembers() {
  return staffMembersQueryOptions
}

export function useCreateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MemberCreate) => createStaffMember({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
    },
  })
}
