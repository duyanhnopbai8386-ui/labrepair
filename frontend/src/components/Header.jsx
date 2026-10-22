import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  LayoutDashboard,
  Monitor,
  AlertCircle,
  Package,
  LogOut,
  User,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Header = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'rooms', label: 'Phòng máy & Thiết bị', icon: Monitor },
    { id: 'incidents', label: 'Phiếu sự cố & Sửa chữa', icon: AlertCircle },
    { id: 'spare-parts', label: 'Kho linh kiện', icon: Package },
  ];

  const getRoleBadge = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return { label: 'Quản trị viên', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
      case 'TECHNICIAN':
        return { label: 'Kỹ thuật viên', bg: 'bg-sky-500/10 text-sky-600 border-sky-500/20' };
      case 'TEACHER':
      case 'LECTURER':
        return { label: 'Giảng viên', bg: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      default:
        return { label: 'Sinh viên', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    }
  };

  const roleStyle = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/70 border-b border-white/60 shadow-[0_4px_20px_rgba(0,100,200,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Wrench size={22} className="stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  Lab<span className="text-sky-600">Repair</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full border border-sky-200/60">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Hệ thống Quản lý Thiết bị & Sửa chữa Phòng máy
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (iOS Segmented Control) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-200/50 backdrop-blur-lg rounded-2xl border border-white/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-white text-sky-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Auth Area */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-1.5 pr-2.5 bg-white/70 border border-white/80 rounded-2xl shadow-sm backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.fullName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md border ${roleStyle.bg} ${roleStyle.border} font-medium`}>
                      {roleStyle.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors active:scale-90 ml-1"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('login')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all active:scale-95"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-xs font-medium ${
                  isActive ? 'text-sky-600 font-semibold' : 'text-slate-500'
                }`}
              >
                <Icon size={18} />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
