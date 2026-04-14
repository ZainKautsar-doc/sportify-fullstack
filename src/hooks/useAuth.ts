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

    const loginResult = await apiRequest<User>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!Number.isInteger(loginResult.id) || (loginResult.role !== 'admin' && loginResult.role !== 'user')) {
      throw new Error('Data user dari server tidak valid');
    }

    const nextRole: UserRole = loginResult.role;
    const nextUser: User = {
      ...loginResult,
      id: Number(loginResult.id),
      email: loginResult.email ?? email.toLowerCase(),
      createdAt: loginResult.createdAt ?? new Date().toISOString(),
    };

    setRole(nextRole);
    setUser(nextUser);
    setStoredRole(nextRole);
    setStoredUser(nextUser);

    toast.success(nextRole === 'admin' ? 'Admin mode aktif' : 'User mode aktif');
    return nextRole;
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setRole(null);
    setUser(null);
    toast.success('Sampai jumpa lagi, Sobat Sportify');
  }, []);

  return {
    role,
    user,
    setRole,
    setUser,
    login,
    logout,
    isInitializing
  };
}
