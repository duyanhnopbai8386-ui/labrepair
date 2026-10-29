import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { Header } from './components/Header';
import { GlassModal } from './components/GlassModal';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EquipmentManagement } from './pages/admin/EquipmentManagement';
import { RoomManagement } from './pages/admin/RoomManagement';
import { IncidentManagement } from './pages/admin/IncidentManagement';
import { SparePartManagement } from './pages/admin/SparePartManagement';
import { UserManagement } from './pages/admin/UserManagement';

// User Portal Pages (iOS Frosted Glass Style)
import { ComputerRoomsPage } from './pages/ComputerRoomsPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { DashboardPage } from './pages/DashboardPage';

import {
  Server,
  Database,
  ShieldCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Monitor
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

function MainApp() {
  const { user } = useAuth();

  // Portal Mode: 'user' (Cổng Người Dùng Báo Hỏng) hoặc 'admin' (Trang Quản Trị Backend)
  const [portalMode, setPortalMode] = useState(() => {
    return localStorage.getItem('labrepair_portal_mode') || 'user';
  });

  // Active Menu in Admin Portal
  const [activeAdminMenu, setActiveAdminMenu] = useState(() => {
    return localStorage.getItem('labrepair_admin_menu') || 'equipment';
  });

  // Active Tab in User Portal
  const [activeUserTab, setActiveUserTab] = useState(() => {
    return localStorage.getItem('labrepair_user_tab') || 'rooms';
  });

  // Modal Báo Hỏng Nhanh (Dùng chung cho cả 2 cổng)
  const [quickReportModalOpen, setQuickReportModalOpen] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    roomName: 'Phòng Máy 01 (Thực hành Web)',
    equipmentCode: 'PC-PM01-08',
    description: '',
    priority: 'CAO',
    reporterName: user?.fullName || 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    reporterPhone: '0987.654.321'
  });

  const [notification, setNotification] = useState(null);

  const handleSwitchPortal = (mode) => {
    setPortalMode(mode);
    try {
      localStorage.setItem('labrepair_portal_mode', mode);
    } catch (e) {}
  };

  const handleSelectAdminMenu = (menu) => {
    setActiveAdminMenu(menu);
    try {
      localStorage.setItem('labrepair_admin_menu', menu);
    } catch (e) {}
  };

  const handleSelectUserTab = (tab) => {
    setActiveUserTab(tab);
    try {
      localStorage.setItem('labrepair_user_tab', tab);
    } catch (e) {}
  };

  // Kích hoạt báo hỏng từ máy tính cụ thể trong Sơ đồ phòng máy
  const handleReportFromWorkstation = (data) => {
    setReportFormData(prev => ({
      ...prev,
      roomName: data.roomName || prev.roomName,
      equipmentCode: data.equipmentCode || prev.equipmentCode,
      description: `Báo hỏng tại máy trạm ${data.equipmentCode}: `
    }));
    setQuickReportModalOpen(true);
  };

  // Xử lý gửi phiếu báo hỏng
  const handleSubmitReport = (e) => {
    e.preventDefault();

    // 1. Tạo phiếu sự cố mới
    const incidentStorageKey = 'labrepair_incidents_v2';
    let currentIncidents = [];
    try {
      const saved = localStorage.getItem(incidentStorageKey);
      if (saved) currentIncidents = JSON.parse(saved);
    } catch (err) {}

    const maxId = currentIncidents.length > 0 ? Math.max(...currentIncidents.map(i => Number(i.id) || 0)) : 4;
    const cleanId = maxId + 1;

    const newTicket = {
      id: cleanId,
      ticketCode: `SC-2024-00${cleanId}`,
      equipmentCode: reportFormData.equipmentCode,
      equipmentName: `Máy trạm ${reportFormData.equipmentCode}`,
      roomName: reportFormData.roomName,
      description: reportFormData.description,
      reporterName: reportFormData.reporterName,
      reporterPhone: reportFormData.reporterPhone,
      technicianName: null,
      priority: reportFormData.priority,
      status: 'MOI_TAO',
      totalCost: 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    const updatedIncidents = [newTicket, ...currentIncidents];
    try {
      localStorage.setItem(incidentStorageKey, JSON.stringify(updatedIncidents));
    } catch (err) {}

    // 2. Tự động đánh dấu máy tính đó sang trạng thái 'CHO_SUA' (Chờ sửa)
    const eqStorageKey = 'labrepair_equipments_v2';
    try {
      const savedEq = localStorage.getItem(eqStorageKey);
      if (savedEq) {
        const eqList = JSON.parse(savedEq);
        const updatedEq = eqList.map(item =>
          item.equipmentCode === reportFormData.equipmentCode ? { ...item, status: 'CHO_SUA' } : item
        );
        localStorage.setItem(eqStorageKey, JSON.stringify(updatedEq));
      }
    } catch (err) {}

    setQuickReportModalOpen(false);
    setNotification(`✅ Đã gửi báo hỏng máy ${reportFormData.equipmentCode} thành công! Kỹ thuật viên sẽ tiếp nhận.`);
    setTimeout(() => setNotification(null), 5000);
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

      {/* ========================================================================= */}
      {/* CASE 1: CỔNG NGƯỜI DÙNG (USER PORTAL - iOS White & Aqua Blue)             */}
      {/* Dành cho Giảng viên & Sinh viên xem phòng máy, gửi báo hỏng sự cố        */}
      {/* ========================================================================= */}
      {portalMode === 'user' ? (
        <div className="min-h-screen flex flex-col relative text-slate-800 antialiased selection:bg-sky-500 selection:text-white bg-[#f0f6fc]">
          {/* iOS Frosted Glass Header */}
          <Header
            currentTab={activeUserTab}
            setCurrentTab={handleSelectUserTab}
            onSwitchToAdminPortal={() => handleSwitchPortal('admin')}
            onOpenReportModal={() => setQuickReportModalOpen(true)}
          />

          {/* User Portal Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            {activeUserTab === 'rooms' && (
              <ComputerRoomsPage onReportIssue={handleReportFromWorkstation} />
            )}

            {activeUserTab === 'incidents' && (
              <IncidentReportsPage
                initialOpenCreate={false}
                prefillData={null}
              />
            )}

            {activeUserTab === 'dashboard' && (
              <DashboardPage onNavigate={handleSelectUserTab} />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">LabRepair v2.0</span>
                <span>•</span>
                <span>Cổng Người Dùng Báo Hỏng & Quản Lý Phòng Máy</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span>Sinh viên thực hiện:</span>
                <strong className="text-sky-700">Lê Nguyễn Ngọc Duy Anh</strong>
                <span>• MSSV: 2124110340</span>
                <span>• Lớp CCQ2411E (HITC)</span>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE 2: TRANG QUẢN TRỊ BACKEND (ADMIN PORTAL - Dark Enterprise Sidebar)   */
        /* Dành cho Quản trị viên & Kỹ thuật viên tiếp nhận, sửa chữa, trừ kho       */
        /* ========================================================================= */
        <AdminLayout
          activeMenu={activeAdminMenu}
          setActiveMenu={handleSelectAdminMenu}
          onSwitchToUserPortal={() => handleSwitchPortal('user')}
        >
          {activeAdminMenu === 'dashboard' && <AdminDashboard onNavigate={handleSelectAdminMenu} />}
          {activeAdminMenu === 'equipment' && <EquipmentManagement />}
          {activeAdminMenu === 'rooms' && <RoomManagement />}
          {activeAdminMenu === 'incidents' && <IncidentManagement />}
          {activeAdminMenu === 'spare-parts' && <SparePartManagement />}
          {activeAdminMenu === 'users' && <UserManagement />}
          {activeAdminMenu === 'settings' && <SystemSettingsView />}
        </AdminLayout>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL GỬI BÁO HỎNG NHANH (Quick Report Modal for Users)              */}
      {/* ========================================================================= */}
      <GlassModal
        isOpen={quickReportModalOpen}
        onClose={() => setQuickReportModalOpen(false)}
        title="Gửi Phiếu Báo Hỏng Thiết Bị Phòng Máy"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-start gap-2.5 text-rose-800">
            <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Thông tin báo hỏng của bạn sẽ được gửi thẳng đến <strong>Bộ phận Quản trị & Kỹ thuật viên HITC</strong> để tiếp nhận và xuất linh kiện sửa chữa ngay lập tức.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phòng máy gặp sự cố *</label>
              <select
                value={reportFormData.roomName}
                onChange={(e) => setReportFormData({ ...reportFormData, roomName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="Phòng Máy 01 (Thực hành Web)">Phòng Máy 01 (Web & App)</option>
                <option value="Phòng Máy 02 (Mạng Máy Tính)">Phòng Máy 02 (Mạng & An Ninh)</option>
                <option value="Phòng Máy 03 (Đồ Họa)">Phòng Máy 03 (Đồ Họa)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mã máy tính bị hỏng *</label>
              <input
                type="text"
                required
                placeholder="VD: PC-PM01-08..."
                value={reportFormData.equipmentCode}
                onChange={(e) => setReportFormData({ ...reportFormData, equipmentCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mức độ khẩn cấp *</label>
            <select
              value={reportFormData.priority}
              onChange={(e) => setReportFormData({ ...reportFormData, priority: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
            >
              <option value="THAP">Thấp (Chưa ảnh hưởng trực tiếp đến buổi học)</option>
              <option value="TRUNG_BINH">Trung bình (Bàn phím, chuột lỗi nhẹ)</option>
              <option value="CAO">Cao (Máy không khởi động được / Màn hình xanh)</option>
              <option value="KHAN_CAP">Khẩn cấp (Sập nguồn, chập điện, mất kết nối mạng toàn phòng)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mô tả hiện tượng sự cố chi tiết *</label>
            <textarea
              required
              rows={3}
              placeholder="Mô tả cụ thể hiện tượng: Màn hình xanh WHEA_UNCORRECTABLE, quạt nguồn không quay, kêu 3 tiếng bíp liên tục..."
              value={reportFormData.description}
              onChange={(e) => setReportFormData({ ...reportFormData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ tên người báo cáo</label>
              <input
                type="text"
                value={reportFormData.reporterName}
                onChange={(e) => setReportFormData({ ...reportFormData, reporterName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={reportFormData.reporterPhone}
                onChange={(e) => setReportFormData({ ...reportFormData, reporterPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setQuickReportModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              Gửi Phiếu Báo Hỏng Ngay
            </button>
          </div>
        </form>
      </GlassModal>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
