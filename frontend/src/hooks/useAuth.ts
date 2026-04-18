import { useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/src/types/domain';
import { 
  clearAuthStorage, 
  getStoredRole, 
  getStoredUser, 
  getStoredToken,
  setStoredRole, 
  setStoredUser,
  setStoredToken
} from '@/src/lib/storage';
import { fetchWithAuth } from '@/src/lib/api';
import { toast } from 'sonner';

export function useAuth() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setRole(getStoredRole());
    setUser(getStoredUser());
    setToken(getStoredToken());
    setIsInitializing(false);
  }, []);

  const login = useCallback(async (email?: string, password?: string) => {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    // Panggil API backend
    const response = await fetchWithAuth<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const { token: nextToken, user: nextUser } = response;
    const nextRole = nextUser.role;

    // Simpan ke state
    setToken(nextToken);
    setUser(nextUser);
    setRole(nextRole);

    // Simpan ke localStorage
    setStoredToken(nextToken);
    setStoredUser(nextUser);
    setStoredRole(nextRole);

    toast.success(nextRole === 'admin' ? 'Selamat datang, Admin!' : `Halo, ${nextUser.name}!`);
    return nextRole;
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
    setRole(null);
    toast.success('Sampai jumpa lagi, Sobat Sportify 👋');
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  return {
    role,
    user,
    token,
    setRole,
    setUser,
    login,
    logout,
    isAuthenticated,
    isInitializing,
  };
}
