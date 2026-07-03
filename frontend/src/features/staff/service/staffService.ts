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
  type MemberUpdate,
} from '../schemas/staff'
import { toast } from 'sonner'

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

type MemberUpdateJSON = Omit<
  MemberUpdate,
  | 'age'
  | 'ageOfFirstParanormalEvent'
  | 'typeOfFirstParanormalEvent'
  | 'paranormalLevel'
> & {
  age?: string | number
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

export const updateStaffMember = createServerFn({ method: 'POST' })
  .validator((data: MemberUpdateJSON) => ({
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
    const { data } = await apiClient.put(`/staff/${payload.id}`, payload)
    return memberSchema.parse(data)
  })

export const deleteStaffMember = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await apiClient.delete(`/staff/${id}`)
    return null
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
    onSuccess: (createdMember) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      toast.success(`Staff member: ${createdMember.name} created successfully`)
    },
    onError: (error) => {
      toast.error(`Failed to create staff member: ${error.message}`)
    },
  })
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MemberUpdate) => updateStaffMember({ data }),
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      toast.success(`Staff member: ${updatedMember.name} updated successfully`)
    },
    onError: (error) => {
      toast.error(`Failed to update staff member: ${error.message}`)
    },
  })
}

export function useDeleteStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name: _name }: { id: string; name: string }) =>
      deleteStaffMember({ data: id }),
    onSuccess: (_, { id: _id, name }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      toast.success(`Staff member: ${name} deleted successfully`)
    },
    onError: (error) => {
      toast.error(`Failed to delete staff member: ${error.message}`)
    },
  })
}
