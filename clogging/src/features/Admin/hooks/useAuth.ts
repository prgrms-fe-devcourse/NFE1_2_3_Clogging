'use client';

import { useEffect } from 'react';
import { useAdminStore } from '../stores/useAdminStore';

export const useAuth = () => {
  const { isAdmin, setAdmin } = useAdminStore();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin' && !isAdmin) {
      setAdmin(true);
    } else if (userRole !== 'admin' && isAdmin) {
      setAdmin(false);
    }
  }, [isAdmin, setAdmin]);

  return { isAdmin };
};
