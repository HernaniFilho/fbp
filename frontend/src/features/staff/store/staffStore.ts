import type { StateCreator } from 'zustand'

export interface StaffSlice {
  selectedStaffMemberId: string | null
  setSelectedStaffMemberId: (id: string | null) => void
}

export const createStaffSlice: StateCreator<StaffSlice, [], [], StaffSlice> = (
  set,
) => ({
  selectedStaffMemberId: null,
  setSelectedStaffMemberId: (id: string | null) =>
    set({ selectedStaffMemberId: id }),
})
