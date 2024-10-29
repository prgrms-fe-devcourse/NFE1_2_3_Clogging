// store/useTagStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TagStore {
  selectedTags: string[];
  setSelectedTag: (tag: string) => void;
  resetTags: () => void;
}

export const useTagStore = create<TagStore>()(
  persist(
    (set) => ({
      selectedTags: [],
      setSelectedTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),
      resetTags: () => set({ selectedTags: [] }),
    }),
    {
      name: 'tag-storage',
    },
  ),
);
