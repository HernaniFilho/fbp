'use server'
import { createServerFn } from '@tanstack/react-start'
import { apiClient } from '#/lib/api-client'
import {
  memberCreateBackendSchema,
  memberCreateSchema,
  memberSchema,
  StaffMembersSchema,
  type Member,
  type MemberCreate,
} from '../schemas/staff'

export const getStaffMembers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Member[]> => {
    const { data } = await apiClient.get('/staff')
    return StaffMembersSchema.parse(data)
  },
)

export const createStaffMember = createServerFn({ method: 'POST' })
  .validator((data: MemberCreate) => memberCreateBackendSchema.parse(data))
  .handler(async ({ data: payload }) => {
    const { data } = await apiClient.post('/staff', payload)
    return memberSchema.parse(data)
  })
