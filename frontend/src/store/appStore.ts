import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  createStaffSlice,
  type StaffSlice,
} from '#/features/staff/store/staffStore'
import createExpiringStorage from './expiringStorage'

type StoreState = StaffSlice

const EXPIRING_TIME = 5 * 1000 * 60

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createStaffSlice(...a),
    }),
    {
      name: 'fbp-app-storage',
      storage: createJSONStorage(() => createExpiringStorage(EXPIRING_TIME)),
    },
  ),
)
