import type { User, UserRole } from '@/src/types/domain';

const STORAGE_KEYS = {
  role: 'sportify_role',
  user: 'sportify_user',
} as const;

export function getStoredRole(): UserRole | null {
  const value = localStorage.getItem(STORAGE_KEYS.role);
  return value === 'user' || value === 'admin' ? value : null;
}

export function setStoredRole(role: UserRole) {
  localStorage.setItem(STORAGE_KEYS.role, role);
}

export function clearStoredRole() {
  localStorage.removeItem(STORAGE_KEYS.role);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<User>;
    if (
      typeof parsed.id === 'number' &&
      parsed.id > 0 &&
      typeof parsed.name === 'string' &&
      typeof parsed.email === 'string' &&
      (parsed.role === 'user' || parsed.role === 'admin')
    ) {
      return parsed as User;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function clearAuthStorage() {
  clearStoredRole();
  clearStoredUser();
}
