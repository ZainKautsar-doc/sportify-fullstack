import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import type { User, UserRole } from '@/src/types/domain';
import TopNav from '@/src/components/layout/TopNav';
import MobileBottomNav from '@/src/components/layout/MobileBottomNav';
import Footer from '@/src/components/layout/Footer';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import HomePage from '@/src/pages/HomePage';
import LoginPage from '@/src/pages/LoginPage';
import RegisterPage from '@/src/pages/RegisterPage';
import { useAuth } from '@/src/hooks/useAuth';
import BookingPage from '@/src/pages/BookingPage';
import AdminDashboard from '@/src/pages/AdminDashboard';
import FieldDetailPage from '@/src/pages/FieldDetailPage';
import PaymentUploadPage from '@/src/pages/PaymentUploadPage';
import UserSchedulePage from '@/src/pages/UserSchedulePage';
import UserProfilePage from '@/src/pages/UserProfilePage';
import ContactPage from '@/src/pages/ContactPage';

export default function App() {
  const { role, user, setRole, setUser, login, logout, isInitializing } = useAuth();

  if (isInitializing) {
    return null; // or a nice loading screen
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-app text-slate-900">
        <AppContent role={role} user={user} setRole={setRole} setUser={setUser} onLogin={login} onLogout={logout} />
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
  onLogin,
  onLogout,
}: {
  role: UserRole | null;
  user: User | null;
  setRole: (role: UserRole | null) => void;
  setUser: (user: User | null) => void;
  onLogin: (email?: string, password?: string) => Promise<UserRole | null>;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (email?: string, password?: string) => {
    try {
      const role = await onLogin(email, password);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      throw error;
    }
  };

  const isFullWidth = ['/', '/kontak'].includes(location.pathname);

  return (
    <>
      <TopNav role={role} userName={user?.name} onLogout={onLogout} />
      <main className={`flex-1 w-full ${isFullWidth ? '' : 'mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8'} pb-[calc(env(safe-area-inset-bottom)+5.8rem)]`}>
        <Routes>
          <Route path="/" element={role === 'admin' ? <Navigate to="/admin" replace /> : <HomePage role={role} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/lapangan/:fieldId" element={role === 'admin' ? <Navigate to="/admin" replace /> : <FieldDetailPage role={role} />} />
          
          <Route
            path="/booking"
            element={<BookingPage user={user} />}
          />
          <Route
            path="/booking/:fieldId"
            element={<BookingPage user={user} />}
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute currentRole={role} allowedRole="user">
                <PaymentUploadPage user={user!} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jadwal"
            element={
              <ProtectedRoute currentRole={role} allowedRole="user">
                <UserSchedulePage user={user!} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute currentRole={role} allowedRole="user">
                <UserProfilePage user={user!} onLogout={onLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute currentRole={role} allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <MobileBottomNav role={role} />
      {role === 'admin' ? null : <Footer />}
    </>
  );
}
