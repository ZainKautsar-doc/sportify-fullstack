import { useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '@/src/types/domain';
import { clearAuthStorage, getStoredRole, getStoredUser, setStoredRole, setStoredUser } from '@/src/lib/storage';
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let nextRole: UserRole | null = null;
    let nextUser: User | null = null;

    if (email === 'admin@sportify.com' && password === 'admin1234') {
      nextRole = 'admin';
      nextUser = {
        id: 'admin_1',
        email: 'admin@sportify.com',
        name: 'Super Admin',
        role: 'admin',
        phone: '081234567890',
        createdAt: new Date().toISOString()
      };
    } else if (email === 'user@sportify.com' && password === 'user1234') {
      nextRole = 'user';
      nextUser = {
        id: 'user_1',
        email: 'user@sportify.com',
        name: 'Sobat Sportify',
        role: 'user',
        phone: '081987654321',
        createdAt: new Date().toISOString()
      };
    } else {
      throw new Error('Email atau password tidak valid');
    }

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
