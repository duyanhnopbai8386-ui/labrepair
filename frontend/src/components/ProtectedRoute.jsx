import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = ['ADMIN', 'TECHNICIAN'] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#11141a] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Chưa đăng nhập -> Chuyển hướng ngay về /login và nhớ lại trang đang muốn vào
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Đã đăng nhập nhưng không đủ quyền (ví dụ Sinh viên cố tình gõ /admin)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#11141a] flex items-center justify-center px-4 font-sans text-slate-200">
        <div className="max-w-md w-full bg-[#181d26] p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert size={34} />
          </div>
          <h2 className="text-xl font-black text-white">Truy cập bị từ chối (403 Forbidden)</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tài khoản của bạn có vai trò <strong className="text-rose-400 font-mono">[{user.role}]</strong>, không có quyền truy cập vào phân hệ Quản Trị Hệ Thống.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/30"
            >
              <ArrowLeft size={14} />
              <span>Quay về Cổng Người Dùng Báo Hỏng (/)</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
