import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EquipmentManagement } from './pages/admin/EquipmentManagement';
import { RoomManagement } from './pages/admin/RoomManagement';
import { IncidentManagement } from './pages/admin/IncidentManagement';
import { SparePartManagement } from './pages/admin/SparePartManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { Server, Database } from 'lucide-react';

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

function MainApp() {
  // Remember the active menu on F5 / Page reload
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('labrepair_active_menu') || 'spare-parts';
  });

  const handleSelectMenu = (menu) => {
    setActiveMenu(menu);
    try {
      localStorage.setItem('labrepair_active_menu', menu);
    } catch (e) {}
  };

  return (
    <AdminLayout activeMenu={activeMenu} setActiveMenu={handleSelectMenu}>
      {activeMenu === 'dashboard' && <AdminDashboard onNavigate={handleSelectMenu} />}
      {activeMenu === 'equipment' && <EquipmentManagement />}
      {activeMenu === 'rooms' && <RoomManagement />}
      {activeMenu === 'incidents' && <IncidentManagement />}
      {activeMenu === 'spare-parts' && <SparePartManagement />}
      {activeMenu === 'users' && <UserManagement />}
      {activeMenu === 'settings' && <SystemSettingsView />}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
