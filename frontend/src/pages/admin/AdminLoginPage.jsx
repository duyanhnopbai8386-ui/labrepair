import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectTarget = location.state?.from?.pathname || '/admin';

  // 1-Click Quick Demo Login Helper
  const fillAndLogin = async (accId, accPass) => {
    setIdentifier(accId);
    setPassword(accPass);
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(accId, accPass);
      setLoading(false);
      if (res.success) {
        const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (loggedUser.role === 'STUDENT') {
          setErrorMsg('Tài khoản Sinh viên không có quyền truy cập vào Cổng Quản Trị Hệ Thống (/admin)!');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        navigate(redirectTarget, { replace: true });
      } else {
        setErrorMsg(res.message || 'Sai thông tin đăng nhập quản trị!');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Lỗi kết nối máy chủ quản trị (Port 8080)!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(identifier, password);
      setLoading(false);
      if (res.success) {
        const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (loggedUser.role === 'STUDENT') {
          setErrorMsg('Tài khoản Sinh viên không có quyền truy cập vào Cổng Quản Trị Hệ Thống (/admin)!');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        navigate(redirectTarget, { replace: true });
      } else {
        setErrorMsg(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Không thể kết nối đến Backend Server (Port 8080)!');
    }
  };

  return (
    <div className="min-h-screen bg-[#11141a] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Dark Enterprise Card */}
        <div className="bg-[#181d26] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#272e3d] relative overflow-hidden text-slate-200">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#141821] flex items-center justify-center text-sky-400">
                <ShieldCheck size={32} className="stroke-[2.2]" />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[11px] font-bold tracking-wider uppercase mb-2">
              <Lock size={12} /> Cổng Quản Trị Backend (/admin)
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Lab<span className="text-sky-400">Repair</span> Admin
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Khu vực dành riêng cho Ban Quản trị & Kỹ thuật viên HITC
            </p>
          </div>

          {/* Security Notice Alert */}
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Khu vực bảo mật nội bộ (/admin):</strong> Người dùng thông thường (Sinh viên) không có quyền đăng nhập vào phân hệ này.
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Tài khoản / Email Quản trị <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin@school.edu hoặc tech@school.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131720] border border-[#272e3d] focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Mật khẩu Quản trị <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#131720] border border-[#272e3d] focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-white placeholder-slate-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Xác thực & Đăng nhập Quản Trị</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Section */}
          <div className="mt-6 pt-5 border-t border-[#272e3d]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Tài khoản thử nghiệm nhanh (1-Click Login)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillAndLogin('admin@school.edu', 'admin123')}
                className="px-3 py-2.5 rounded-xl bg-[#131720] hover:bg-[#1f2633] border border-[#272e3d] text-xs text-slate-200 font-semibold transition-all text-left flex items-center gap-2 active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-sm shadow-rose-500" />
                <div className="truncate">
                  <div className="font-bold text-white">👑 Admin</div>
                  <div className="text-[10px] text-slate-400 font-mono">admin123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillAndLogin('tech@school.edu', 'tech123')}
                className="px-3 py-2.5 rounded-xl bg-[#131720] hover:bg-[#1f2633] border border-[#272e3d] text-xs text-slate-200 font-semibold transition-all text-left flex items-center gap-2 active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 shadow-sm shadow-sky-500" />
                <div className="truncate">
                  <div className="font-bold text-white">🔧 Kỹ thuật viên</div>
                  <div className="text-[10px] text-slate-400 font-mono">tech123</div>
                </div>
              </button>
            </div>
          </div>

          {/* Link to Client Portal */}
          <div className="mt-6 pt-4 border-t border-[#272e3d]/80 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Quay về Cổng Người Dùng Báo Hỏng (/)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
