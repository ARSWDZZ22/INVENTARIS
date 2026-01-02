import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLayout from './components/layout/AdminLayout';
import MemberLayout from './components/layout/MemberLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryManagement from './pages/admin/InventoryManagement';
import LoanManagement from './pages/admin/LoanManagement';
import SettingsPage from './pages/admin/SettingsPage';
import UserManagement from './pages/admin/UserManagement';
import MemberDashboard from './pages/member/MemberDashboard';
import LoanFormPage from './pages/member/LoanFormPage';
import MemberHistory from './pages/member/MemberHistory';
import ProfilePage from './pages/ProfilePage';
import { RequireAuth, RequireRole } from './components/RequireAuth';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route
                path="/admin/*"
                element={
                  <RequireAuth>
                    <RequireRole role={Role.ADMIN}>
                      <AdminLayout />
                    </RequireRole>
                  </RequireAuth>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="loans" element={<LoanManagement />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>

              <Route
                path="/member/*"
                element={
                  <RequireAuth>
                    <RequireRole role={Role.ANGGOTA}>
                      <MemberLayout />
                    </RequireRole>
                  </RequireAuth>
                }
              >
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="loan" element={<LoanFormPage />} />
                <Route path="history" element={<MemberHistory />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/member/dashboard" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
