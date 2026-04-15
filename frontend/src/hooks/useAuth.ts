import { useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/src/types/domain';
import { clearAuthStorage, getStoredRole, getStoredUser, setStoredRole, setStoredUser } from '@/src/lib/storage';
import { apiRequest } from '@/src/lib/api';
import { toast } from 'sonner';

export function useAuth() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setRole(getStoredRole());
    setUser(getStoredUser());
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (email?: string, password?: string) => {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    // Panggil API backend
    const userData = await apiRequest<User>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const nextRole = userData.role;
    setRole(nextRole);
    setUser(userData);
    setStoredRole(nextRole);
    setStoredUser(userData);

    toast.success(nextRole === 'admin' ? 'Selamat datang, Admin!' : `Halo, ${userData.name}!`);
    return nextRole;
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setRole(null);
    setUser(null);
    toast.success('Sampai jumpa lagi, Sobat Sportify 👋');
  }, []);

  return {
    role,
    user,
    setRole,
    setUser,
    login,
    logout,
    isInitializing,
  };
}
