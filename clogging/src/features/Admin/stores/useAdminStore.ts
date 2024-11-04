import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAdmin: boolean;
  setAdmin: (status: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      setAdmin: (status) => set({ isAdmin: status }),
    }),
    {
      name: 'admin-storage',
    },
  ),
);
