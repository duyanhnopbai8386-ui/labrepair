import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Wrench, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('STUDENT');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1-Click Quick Demo Login Helper
  const fillAndLogin = async (accId, accPass) => {
    setIdentifier(accId);
    setPassword(accPass);
    setErrorMsg('');
    setLoading(true);
    const res = await login(accId, accPass);
    setLoading(false);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isRegisterMode) {
      try {
        await authApi.register({
          email: identifier,
          password,
          fullName,
          employeeCode,
          phone,
          department,
          role,
        });
        setSuccessMsg('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
        setTimeout(() => {
          fillAndLogin(identifier, password);
        }, 1200);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!');
      } finally {
        setLoading(false);
      }
    } else {
      const res = await login(identifier, password);
      setLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* iOS Glassmorphism Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/60 relative overflow-hidden">
          {/* Subtle top decoration glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 rounded-b-full shadow-sm" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Wrench size={30} className="stroke-[2.5]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Hệ thống Quản lý Thiết bị & Sửa chữa Phòng máy (HITC)
            </p>
          </div>

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-700 text-sm flex items-center gap-2.5 animate-shake">
              <AlertCircle size={18} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Lê Nguyễn Ngọc Duy Anh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-slate-200/80 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                      Mã NV / MSSV
                    </label>
                    <input
                      type="text"
                      placeholder="2124110340"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white/70 border border-slate-200/80 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                      Vai trò
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white/70 border border-slate-200/80 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 text-sm transition-all"
                    >
                      <option value="STUDENT">Sinh viên</option>
                      <option value="TEACHER">Giảng viên</option>
                      <option value="TECHNICIAN">Kỹ thuật viên</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                Email đăng nhập hoặc Mã nhân viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin@school.edu hoặc tech@school.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-slate-200/80 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 border border-slate-200/80 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              {isRegisterMode
                ? 'Đã có tài khoản? Nhấn vào đây để đăng nhập'
                : 'Chưa có tài khoản? Đăng ký tài khoản mới'}
            </button>
          </div>

          {/* 1-Click Demo Accounts Pill Bar */}
          {!isRegisterMode && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                Bấm nhanh để thử nghiệm (Demo 1-Click)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillAndLogin('admin@school.edu', 'admin123')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100/70 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/60 text-xs text-slate-700 font-medium transition-all text-left flex items-center gap-2 active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate">👑 Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillAndLogin('tech@school.edu', 'tech123')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100/70 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/60 text-xs text-slate-700 font-medium transition-all text-left flex items-center gap-2 active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span className="truncate">🔧 Kỹ thuật viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillAndLogin('teacher@school.edu', 'teacher123')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100/70 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/60 text-xs text-slate-700 font-medium transition-all text-left flex items-center gap-2 active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="truncate">👨‍🏫 Giảng viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillAndLogin('student@school.edu', 'student123')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100/70 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/60 text-xs text-slate-700 font-medium transition-all text-left flex items-center gap-2 active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">🎓 SV Duy Anh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
