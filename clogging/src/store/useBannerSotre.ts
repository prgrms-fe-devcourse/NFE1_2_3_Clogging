// store/useBannerStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BannerState {
  bannerImage: string;
  setBannerImage: (url: string) => void;
  resetBannerImage: () => void;
}

const DEFAULT_BANNER = '/images/banner-img.png'; // 기본 이미지 경로

export const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      bannerImage: DEFAULT_BANNER,
      setBannerImage: (url: string) => set({ bannerImage: url }),
      resetBannerImage: () => set({ bannerImage: DEFAULT_BANNER }),
    }),
    {
      name: 'banner-storage', // localStorage에 저장될 키 이름
    },
  ),
);
