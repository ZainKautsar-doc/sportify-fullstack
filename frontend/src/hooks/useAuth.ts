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

    // Simulasi network request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let nextRole: UserRole | null = null;
    let nextUser: User | null = null;

    // Hardcoded Dummy Users
    if (email === 'admin@sportify.com' && password === 'admin1234') {
      nextRole = 'admin';
      nextUser = {
        id: 1,
        email,
        name: 'Admin Sportify',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
    } else if (email === 'user@sportify.com' && password === 'user1234') {
      nextRole = 'user';
      nextUser = {
        id: 2,
        email,
        name: 'User Dummy',
        role: 'user',
        createdAt: new Date().toISOString()
      };
    } else {
      // Check local storage registered users
      const storedUsersRaw = localStorage.getItem('registered_users');
      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        const registeredUser = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (registeredUser) {
          nextRole = registeredUser.role as UserRole;
          nextUser = {
            id: Date.now(),
            email,
            name: registeredUser.name,
            role: nextRole,
            createdAt: new Date().toISOString()
          };
        }
      }
    }

    if (!nextRole || !nextUser) {
      throw new Error('Email atau password salah');
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
