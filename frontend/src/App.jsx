import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Portals
import AppClient from './AppClient';
import AppAdmin from './AppAdmin';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. CỔNG NGƯỜI DÙNG BÁO HỎNG (Client / Public Facing Portal) */}
          <Route path="/" element={<AppClient />} />

          {/* 2. TRANG ĐĂNG NHẬP QUẢN TRỊ (Admin & Technician Login) */}
          <Route path="/login" element={<AdminLoginPage />} />

          {/* 3. CỔNG QUẢN TRỊ BACKEND CMS (Admin Back-Office Portal) */}
          {/* Được bảo vệ bởi ProtectedRoute: Chỉ ADMIN & TECHNICIAN mới vào được */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}>
                <AppAdmin />
              </ProtectedRoute>
            }
          />

          {/* 4. ĐIỀU HƯỚNG MẶC ĐỊNH CHO MỌI URL KHÔNG HỢP LỆ VỀ HOME */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
