import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComputerRoomsPage } from './pages/ComputerRoomsPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { SparePartsPage } from './pages/SparePartsPage';
import { ShieldCheck } from 'lucide-react';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Navigation helpers with state pass-through (e.g. from Dashboard or Rooms to Report Issue)
  const [incidentPrefill, setIncidentPrefill] = useState(null);
  const [openCreateIncidentModal, setOpenCreateIncidentModal] = useState(false);

  const handleNavigate = (tab, extra = {}) => {
    if (extra.openCreateModal) {
      setOpenCreateIncidentModal(true);
    }
    setCurrentTab(tab);
  };

  const handleReportIssueFromRoom = (data) => {
    setIncidentPrefill(data);
    setOpenCreateIncidentModal(true);
    setCurrentTab('incidents');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Background Animated iOS Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Sky Blue Orb Top Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-sky-300/40 to-cyan-200/30 rounded-full blur-3xl animate-pulse" />
        {/* Soft Indigo Orb Center Right */}
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-gradient-to-bl from-blue-300/30 to-sky-100/40 rounded-full blur-3xl" />
        {/* Aqua Cyan Orb Bottom Left */}
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-cyan-200/40 to-sky-300/30 rounded-full blur-3xl" />
      </div>

      {/* iOS Frosted Glass Header */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'login' && !isAuthenticated ? (
          <LoginPage onLoginSuccess={() => setCurrentTab('dashboard')} />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardPage onNavigate={handleNavigate} />
            )}

            {currentTab === 'rooms' && (
              <ComputerRoomsPage onReportIssue={handleReportIssueFromRoom} />
            )}

            {currentTab === 'incidents' && (
              <IncidentReportsPage
                initialOpenCreate={openCreateIncidentModal}
                prefillData={incidentPrefill}
                onClearPrefill={() => {
                  setIncidentPrefill(null);
                  setOpenCreateIncidentModal(false);
                }}
              />
            )}

            {currentTab === 'spare-parts' && (
              <SparePartsPage />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-xl py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">LabRepair v2.0</span>
            <span>•</span>
            <span>Trường Cao đẳng Công Thương TP.HCM (HITC)</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <span>Sinh viên thực hiện:</span>
            <strong className="text-sky-700">Lê Nguyễn Ngọc Duy Anh</strong>
            <span>• MSSV: 2124110340</span>
            <span>• Lớp CCQ2411E</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Spring Boot 3.4 & React SPA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
