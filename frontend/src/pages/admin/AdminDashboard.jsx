import React from 'react';
import {
  Monitor,
  AlertTriangle,
  Banknote,
  Boxes,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const roomCosts = [
    { name: 'Phòng Máy 01 (Thực hành Web)', cost: 2450000, percent: 50 },
    { name: 'Phòng Máy 02 (Mạng Máy Tính)', cost: 1600000, percent: 33 },
    { name: 'Phòng Server Trung Tâm', cost: 800000, percent: 17 }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Trung tâm điều phối & Giám sát dữ liệu phòng máy thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Backend REST API (Port 8080) Online
          </span>
        </div>
      </div>

      {/* 4 Dark KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('equipment')}
          className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] hover:border-sky-500/50 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">TỔNG THIẾT BỊ</span>
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Monitor size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            79 <span className="text-xs font-normal text-slate-400">/ 85 máy</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 size={13} /> 93% Đang hoạt động tốt
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigate('incidents')}
          className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] hover:border-rose-500/50 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">SỰ CỐ CẦN XỬ LÝ</span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            4 <span className="text-xs font-normal text-slate-400">phiếu</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> 1 sự cố khẩn cấp
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">CHI PHÍ VẬT TƯ LŨY KẾ</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Banknote size={18} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-400">
            {formatCurrency(4850000)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp size={13} className="text-emerald-400" /> Ngân sách tháng 10/2026
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onNavigate('spare-parts')}
          className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] hover:border-amber-500/50 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold">KHO LINH KIỆN</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Boxes size={18} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            2 <span className="text-xs font-normal text-slate-400">vật tư sắp hết</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <AlertTriangle size={13} /> SSD 512GB & Nguồn 500W
          </div>
        </div>
      </div>

      {/* Grid: Room Costs & Quick System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Repair Cost Breakdown */}
        <div className="lg:col-span-2 bg-[#181d26] p-5 rounded-xl border border-[#272e3d] shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#272e3d] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Phân Bổ Chi Phí Sửa Chữa Theo Phòng Máy
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Dữ liệu tổng hợp từ bảng repair_parts & repair_histories</p>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
              API /dashboard/room-costs
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {roomCosts.map((room, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{room.name}</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(room.cost)}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#272e3d] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                    style={{ width: `${room.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Backend Tech Stack & Security */}
        <div className="bg-[#181d26] p-5 rounded-xl border border-[#272e3d] shadow-lg space-y-3">
          <div className="border-b border-[#272e3d] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Kiến Trúc Backend Hệ Thống
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Spring Boot 3.4 & MySQL JPA</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-[#212734] border border-[#2e3748] flex items-center justify-between">
              <span className="text-slate-400">Framework:</span>
              <strong className="text-white">Spring Boot 3.4.x</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#212734] border border-[#2e3748] flex items-center justify-between">
              <span className="text-slate-400">Security:</span>
              <strong className="text-emerald-400">Spring Security 6 + JJWT</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#212734] border border-[#2e3748] flex items-center justify-between">
              <span className="text-slate-400">Database:</span>
              <strong className="text-sky-400">MySQL 8.0 (8 Entities)</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#212734] border border-[#2e3748] flex items-center justify-between">
              <span className="text-slate-400">Kỹ sư thực hiện:</span>
              <strong className="text-amber-400">Duy Anh (2124110340)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
