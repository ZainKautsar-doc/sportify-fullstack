import type { User, UserRole } from '@/src/types/domain';

const STORAGE_KEYS = {
  role: 'sportify_role',
  user: 'sportify_user',
} as const;

function normalizeUserId(id: unknown, role?: UserRole): number | null {
  if (typeof id === 'number' && Number.isInteger(id) && id > 0) return id;
  if (typeof id === 'string') {
    if (/^\d+$/.test(id)) return Number(id);
    if (id === 'admin_1') return 1;
    if (id === 'user_1') return 2;
  }
  if (role === 'admin') return 1;
  if (role === 'user') return 2;
  return null;
}

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
    const parsed = JSON.parse(raw) as Partial<User> & { id?: unknown };
    if (parsed?.role === 'user' || parsed?.role === 'admin') {
      const normalizedId = normalizeUserId(parsed.id, parsed.role);
      if (normalizedId && typeof parsed.name === 'string' && parsed.name.trim()) {
        return {
          ...parsed,
          id: normalizedId,
        } as User;
      }
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
