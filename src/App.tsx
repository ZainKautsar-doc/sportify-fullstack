import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import type { User, UserRole } from '@/src/types/domain';
import { apiRequest } from '@/src/lib/api';
import { clearAuthStorage, getStoredRole, getStoredUser, setStoredRole, setStoredUser } from '@/src/lib/storage';
import TopNav from '@/src/components/layout/TopNav';
import MobileBottomNav from '@/src/components/layout/MobileBottomNav';
import Footer from '@/src/components/layout/Footer';
import RequireRole from '@/src/components/auth/RequireRole';
import HomePage from '@/src/pages/HomePage';
import RoleSelectionPage from '@/src/pages/RoleSelectionPage';
import BookingPage from '@/src/pages/BookingPage';
import AdminDashboard from '@/src/pages/AdminDashboard';
import FieldDetailPage from '@/src/pages/FieldDetailPage';
import PaymentUploadPage from '@/src/pages/PaymentUploadPage';
import UserSchedulePage from '@/src/pages/UserSchedulePage';
import UserProfilePage from '@/src/pages/UserProfilePage';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setRole(getStoredRole());
    setUser(getStoredUser());
  }, []);

  const logout = () => {
    clearAuthStorage();
    setRole(null);
    setUser(null);
    toast.success('Sampai jumpa lagi, Sobat Sportify');
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-app text-slate-900">
        <AppContent role={role} user={user} setRole={setRole} setUser={setUser} onLogout={logout} />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'rounded-2xl border border-slate-100 bg-white shadow-xl',
          }}
        />
      </div>
    </BrowserRouter>
  );
}

function AppContent({
  role,
  user,
  setRole,
  setUser,
  onLogout,
}: {
  role: UserRole | null;
  user: User | null;
  setRole: (role: UserRole | null) => void;
  setUser: (user: User | null) => void;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  const handleSelectRole = async (nextRole: UserRole) => {
    try {
      const userData = await apiRequest<User>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });

      setRole(nextRole);
      setUser(userData);
      setStoredRole(nextRole);
      setStoredUser(userData);
      toast.success(nextRole === 'admin' ? 'Admin mode aktif' : 'User mode aktif');
      navigate(nextRole === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ups, coba lagi ya');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <TopNav role={role} userName={user?.name} onLogout={onLogout} />
      <main className={`flex-1 w-full ${isHome ? '' : 'mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8'} pb-[calc(env(safe-area-inset-bottom)+5.8rem)]`}>
        <Routes>
          <Route path="/" element={role === 'admin' ? <Navigate to="/admin" replace /> : <HomePage role={role} />} />
          <Route path="/pilih-role" element={<RoleSelectionPage onSelectRole={handleSelectRole} />} />
          <Route path="/lapangan/:fieldId" element={role === 'admin' ? <Navigate to="/admin" replace /> : <FieldDetailPage role={role} />} />
          <Route
            path="/booking"
            element={
              role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="user">
                  {user ? <BookingPage user={user} /> : <Navigate to="/pilih-role?next=%2Fbooking" replace />}
                </RequireRole>
              )
            }
          />
          <Route
            path="/booking/:fieldId"
            element={
              role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="user">
                  {user ? <BookingPage user={user} /> : <Navigate to="/pilih-role?next=%2Fbooking" replace />}
                </RequireRole>
              )
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="user">
                  {user ? <PaymentUploadPage user={user} /> : <Navigate to="/pilih-role?next=%2Fbooking" replace />}
                </RequireRole>
              )
            }
          />
          <Route
            path="/jadwal"
            element={
              role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="user">
                  {user ? <UserSchedulePage user={user} /> : <Navigate to="/pilih-role?next=%2Fbooking" replace />}
                </RequireRole>
              )
            }
          />
          <Route
            path="/profil"
            element={
              role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="user">
                  {user ? <UserProfilePage user={user} onLogout={onLogout} /> : <Navigate to="/pilih-role?next=%2Fbooking" replace />}
                </RequireRole>
              )
            }
          />
          <Route
            path="/admin"
            element={
              role === 'user' ? (
                <Navigate to="/" replace />
              ) : (
                <RequireRole currentRole={role} allowedRole="admin">
                  <AdminDashboard />
                </RequireRole>
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <MobileBottomNav role={role} />
      {role === 'admin' ? null : <Footer />}
    </>
  );
}
