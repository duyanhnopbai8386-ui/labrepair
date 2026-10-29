import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  Monitor,
  AlertCircle,
  Clock,
  Send,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

export const HeaderClient = ({ currentTab, setCurrentTab, onOpenReportModal }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'rooms', label: 'Sơ đồ Phòng máy & Thiết bị', icon: Monitor },
    { id: 'incidents', label: 'Theo dõi Tiến độ Sửa chữa', icon: Clock },
    { id: 'dashboard', label: 'Tổng quan Phòng máy', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/85 border-b border-white/80 shadow-[0_4px_25px_rgba(0,100,200,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('rooms')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Wrench size={22} className="stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  Lab<span className="text-sky-600">Repair</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full border border-sky-200/80">
                  CỔNG NGƯỜI DÙNG (FE)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Hệ thống Báo hỏng & Giám sát Phòng máy vi tính (HITC)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (iOS Segmented Control) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-100/80 backdrop-blur-lg rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-white text-sky-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Report Button + User Info (NO ADMIN SWITCHER) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Report Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Send size={14} className="stroke-[2.5]" />
              <span>Gửi Báo Hỏng</span>
            </button>

            {/* User Profile (If logged in) */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 py-1 px-3 text-xs font-semibold rounded-lg ${
                  isActive ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
