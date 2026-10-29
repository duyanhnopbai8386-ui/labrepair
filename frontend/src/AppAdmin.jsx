import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminLayout } from './components/AdminLayout';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EquipmentManagement } from './pages/admin/EquipmentManagement';
import { RoomManagement } from './pages/admin/RoomManagement';
import { IncidentManagement } from './pages/admin/IncidentManagement';
import { SparePartManagement } from './pages/admin/SparePartManagement';
import { UserManagement } from './pages/admin/UserManagement';

import {
  Server,
  Database,
  CheckCircle2
} from 'lucide-react';

function SystemSettingsView() {
  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      <div className="border-b border-[#272e3d] pb-3">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Cấu hình kết nối Backend RESTful API & MySQL Database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Server size={16} className="text-sky-400" /> Cấu hình Máy Chủ Spring Boot
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">Server Port:</span>
              <strong className="text-white font-mono">8080</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">Context Path:</span>
              <strong className="text-white font-mono">/api</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">CORS Policy:</span>
              <span className="text-emerald-400 font-bold">Enabled (Origins Allowed)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Database size={16} className="text-sky-400" /> Cấu hình Cơ Sở Dữ Liệu MySQL
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">Database Name:</span>
              <strong className="text-white font-mono">labrepair_db</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">Hibernate DDL:</span>
              <strong className="text-white font-mono">update</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#272e3d]">
              <span className="text-slate-400">JDBC Driver:</span>
              <span className="text-sky-400 font-mono">com.mysql.cj.jdbc.Driver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppAdmin() {
  const navigate = useNavigate();

  // Active Menu in Admin Portal
  const [activeAdminMenu, setActiveAdminMenu] = useState(() => {
    return localStorage.getItem('labrepair_admin_menu') || 'equipment';
  });

  const [notification, setNotification] = useState(null);

  const handleSelectAdminMenu = (menu) => {
    setActiveAdminMenu(menu);
    try {
      localStorage.setItem('labrepair_admin_menu', menu);
    } catch (e) {}
  };

  const handleSwitchToUserPortal = () => {
    navigate('/');
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Dark Enterprise Sidebar Layout */}
      <AdminLayout
        activeMenu={activeAdminMenu}
        setActiveMenu={handleSelectAdminMenu}
        onSwitchToUserPortal={handleSwitchToUserPortal}
      >
        {activeAdminMenu === 'dashboard' && <AdminDashboard onNavigate={handleSelectAdminMenu} />}
        {activeAdminMenu === 'equipment' && <EquipmentManagement />}
        {activeAdminMenu === 'rooms' && <RoomManagement />}
        {activeAdminMenu === 'incidents' && <IncidentManagement />}
        {activeAdminMenu === 'spare-parts' && <SparePartManagement />}
        {activeAdminMenu === 'users' && <UserManagement />}
        {activeAdminMenu === 'settings' && <SystemSettingsView />}
      </AdminLayout>
    </>
  );
}
