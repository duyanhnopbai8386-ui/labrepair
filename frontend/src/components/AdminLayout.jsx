import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  LayoutDashboard,
  Monitor,
  AlertCircle,
  Package,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Maximize2,
  Globe,
  LogOut,
  ChevronDown,
  Layers,
  Wrench,
  ShieldCheck,
  Building,
  ExternalLink
} from 'lucide-react';

export const AdminLayout = ({
  activeMenu,
  setActiveMenu,
  children,
  incidentCount = 4,
  lowStockCount = 2,
  onSwitchToUserPortal
}) => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Quản lý Phòng máy', icon: Building },
    { id: 'equipment', label: 'Quản lý Thiết bị', icon: Monitor },
    { id: 'incidents', label: 'Phiếu Sự cố & Sửa chữa', icon: AlertCircle, badge: incidentCount, badgeColor: 'bg-rose-500' },
    { id: 'spare-parts', label: 'Kho Linh kiện & Vật tư', icon: Package, badge: lowStockCount, badgeColor: 'bg-amber-500' },
    { id: 'users', label: 'Quản lý Người dùng', icon: Users },
    { id: 'settings', label: 'Cài đặt Hệ thống', icon: Settings },
  ];

  const getBreadcrumbTitle = () => {
    switch (activeMenu) {
      case 'dashboard': return 'Tổng quan Hệ thống / Dashboard';
      case 'rooms': return 'Phòng máy / Danh sách Phòng thực hành';
      case 'equipment': return 'Thiết bị & Máy tính / Danh sách Thiết bị';
      case 'incidents': return 'Sự cố & Sửa chữa / Quản lý Phiếu báo hỏng';
      case 'spare-parts': return 'Kho linh kiện / Danh mục Vật tư thay thế';
      case 'users': return 'Người dùng / Danh sách Tài khoản & Phân quyền';
      case 'settings': return 'Cài đặt / Cấu hình Hệ thống';
      default: return 'Quản trị Hệ thống';
    }
  };

  return (
    <div className="min-h-screen bg-[#1c222d] text-slate-200 flex flex-col font-sans antialiased">
      <div className="flex flex-1">
        {/* ================= LEFT DARK SIDEBAR (Style EzyPlatform / Admin Portal) ================= */}
        <aside
          className={`bg-[#181d26] border-r border-[#272e3d] flex flex-col transition-all duration-300 z-30 shrink-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center px-4 border-b border-[#272e3d] gap-3 bg-[#131720]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-500/20">
              <Wrench size={20} className="stroke-[2.5]" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  Lab<span className="text-sky-400">Repair</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded border border-sky-500/30 font-mono">
                    ADMIN
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">Hệ thống Quản lý Backend</div>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="p-4 border-b border-[#272e3d]/80 bg-[#151922]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ring-2 ring-amber-500/30">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'D'}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">
                    {user?.fullName || 'Lê Nguyễn Ngọc Duy Anh'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-400 font-medium">
                      {user?.role ? `Vai trò: ${user.role}` : 'Super Admin (CCQ2411E)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Menu Quản Lý
              </div>
            )}

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#232b38]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}

            {/* Shortcut to User Reporting Portal */}
            <div className="pt-3 border-t border-[#272e3d]/80 mt-2">
              <button
                onClick={onSwitchToUserPortal}
                title={sidebarCollapsed ? 'Cổng Người Dùng (Báo Hỏng)' : undefined}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-all"
              >
                <Monitor size={18} className="text-sky-400 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate flex items-center justify-between">
                    <span>Cổng Người Dùng</span>
                    <ExternalLink size={13} />
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#272e3d] bg-[#141821]">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all border border-rose-500/20"
            >
              <LogOut size={16} />
              {!sidebarCollapsed && <span>Đăng xuất hệ thống</span>}
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT WRAPPER ================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#212734]">
          {/* TOP NAVBAR */}
          <header className="h-16 bg-[#181d26] border-b border-[#272e3d] px-6 flex items-center justify-between z-20">
            {/* Left Nav Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#272e3d] transition-colors"
                title="Thu gọn / Mở rộng menu"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <span className="hover:text-white cursor-pointer" onClick={() => setActiveMenu('dashboard')}>Home</span>
                <span>/</span>
                <span className="text-slate-200 font-semibold">{getBreadcrumbTitle().split(' / ')[0]}</span>
              </div>
            </div>

            {/* Right Tools (Switch to User Portal, Notifications, Profile) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Switch to User Portal Button */}
              <button
                onClick={onSwitchToUserPortal}
                title="Chuyển sang Cổng Người Dùng (Sơ đồ phòng máy & Gửi báo hỏng)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                <Monitor size={15} />
                <span className="hidden sm:inline">Cổng Người Dùng (Báo Hỏng)</span>
                <span className="sm:hidden">Cổng SV/GV</span>
              </button>

              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#272e3d] text-xs text-slate-300">
                <Globe size={14} className="text-sky-400" />
                <span>Tiếng Việt</span>
              </div>

              <button
                onClick={() => setActiveMenu('incidents')}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#272e3d] transition-colors"
                title="Thông báo sự cố"
              >
                <Bell size={18} />
                {incidentCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#272e3d] transition-colors border border-transparent hover:border-[#384256]"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden md:block">
                    {user?.fullName || 'Admin'}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#181d26] border border-[#2e3748] shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="p-2 border-b border-[#272e3d] text-xs">
                      <div className="font-bold text-white">{user?.fullName}</div>
                      <div className="text-slate-400 font-mono text-[11px] truncate">{user?.email || 'admin@school.edu'}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveMenu('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#232b38] rounded-lg mt-1"
                    >
                      <Settings size={14} /> Cài đặt tài khoản
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg mt-1"
                    >
                      <LogOut size={14} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="h-12 border-t border-[#272e3d] bg-[#181d26] px-6 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <strong className="text-slate-300">LabRepair Backend System</strong> • Cao đẳng Công Thương TP.HCM (HITC)
            </div>
            <div>
              Sinh viên thực hiện: <strong className="text-sky-400">Lê Nguyễn Ngọc Duy Anh</strong> • Lớp CCQ2411E
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
