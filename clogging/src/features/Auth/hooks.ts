'use client';

import { create } from 'zustand'; // 상태 관리를 위해 Zustand 사용

interface AuthState {
  userRole: 'user' | 'admin' | null;
  isAdmin: boolean;
  verifyAdmin: (password: string) => Promise<boolean>;
  setAsUser: () => void;
}

// Zustand store로 전역 상태 관리
export const useAuthStore = create<AuthState>((set) => ({
  userRole: null,
  isAdmin: false,
  verifyAdmin: async (password: string) => {
    const isValid = password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (isValid) {
      localStorage.setItem('userRole', 'admin');
      set({ userRole: 'admin', isAdmin: true });
    }
    return isValid;
  },
  setAsUser: () => {
    localStorage.setItem('userRole', 'user');
    set({ userRole: 'user', isAdmin: false });
  },
}));

// 초기 상태 로드
if (typeof window !== 'undefined') {
  const savedRole = localStorage.getItem('userRole');
  if (savedRole) {
    useAuthStore.setState({
      userRole: savedRole as 'user' | 'admin',
      isAdmin: savedRole === 'admin',
    });
  }
}

// hooks.ts에서 export할 훅
export const useAuth = () => {
  const { userRole, isAdmin, verifyAdmin, setAsUser } = useAuthStore();
  return { userRole, isAdmin, verifyAdmin, setAsUser };
};
