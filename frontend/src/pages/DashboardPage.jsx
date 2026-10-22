import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { incidentApi } from '../api/incidentApi';
import { StatusBadge } from '../components/StatusBadge';
import {
  Monitor,
  AlertTriangle,
  Banknote,
  Boxes,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Plus
} from 'lucide-react';

export const DashboardPage = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRooms: 3,
    totalEquipments: 85,
    activeEquipments: 79,
    underRepairEquipments: 6,
    openIncidents: 4,
    criticalIncidents: 1,
    totalRepairCost: 4850000,
    lowStockPartsCount: 2,
  });

  const [roomCosts, setRoomCosts] = useState([
    { roomName: 'Phòng Máy 01 (Thực hành Web)', cost: 2450000, percentage: 50 },
    { roomName: 'Phòng Máy 02 (Mạng Máy Tính)', cost: 1600000, percentage: 33 },
    { roomName: 'Phòng Server Trung Tâm', cost: 800000, percentage: 17 },
  ]);

  const [topFailures, setTopFailures] = useState([
    { equipmentName: 'PC-PM01-08 (Dell OptiPlex 7080)', failureCount: 3, categoryName: 'Máy tính để bàn', lastIssue: 'Lỗi Ram & Dump xanh' },
    { equipmentName: 'PC-PM02-03 (HP ProDesk 400)', failureCount: 2, categoryName: 'Máy tính để bàn', lastIssue: 'Nguồn không lên' },
    { equipmentName: 'Switch Cisco 24-Port PM02', failureCount: 2, categoryName: 'Thiết bị mạng', lastIssue: 'Mất tín hiệu cổng 1-8' },
    { equipmentName: 'PC-PM01-15 (Dell OptiPlex 7080)', failureCount: 1, categoryName: 'Máy tính để bàn', lastIssue: 'Màn hình chớp giật' },
  ]);

  const [recentIncidents, setRecentIncidents] = useState([
    {
      id: 1,
      ticketCode: 'SC-202610-001',
      roomName: 'Phòng Máy 01',
      equipmentName: 'PC-PM01-08',
      description: 'Máy bị xanh màn hình (BSOD), RAM có dấu hiệu hư hỏng',
      priority: 'KHAN_CAP',
      status: 'DANG_SUA',
      reportedAt: '2026-10-22 08:30',
      reporterName: 'Lê Nguyễn Ngọc Duy Anh'
    },
    {
      id: 2,
      ticketCode: 'SC-202610-002',
      roomName: 'Phòng Máy 02',
      equipmentName: 'PC-PM02-03',
      description: 'Nguồn bật không lên đèn, quạt CPU không quay',
      priority: 'CAO',
      status: 'CHO_SUA',
      reportedAt: '2026-10-22 09:15',
      reporterName: 'Thầy Nguyễn Văn Hoàng'
    },
    {
      id: 3,
      ticketCode: 'SC-202610-003',
      roomName: 'Phòng Máy 01',
      equipmentName: 'PC-PM01-12',
      description: 'Bàn phím liệt phím Enter và Space, chuột kẹt con lăn',
      priority: 'TRUNG_BINH',
      status: 'MOI_TAO',
      reportedAt: '2026-10-22 10:45',
      reporterName: 'Sinh viên CCQ2411E'
    }
  ]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, costRes, failRes, incRes] = await Promise.allSettled([
        dashboardApi.getSummary(),
        dashboardApi.getRoomCosts(),
        dashboardApi.getTopFailures(5),
        incidentApi.getAll({ page: 0, size: 4 })
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.data) {
        setSummary(prev => ({ ...prev, ...sumRes.value.data }));
      }
      if (costRes.status === 'fulfilled' && costRes.value.data && costRes.value.data.length > 0) {
        const raw = costRes.value.data;
        const max = Math.max(...raw.map(r => r.cost || 0), 1);
        setRoomCosts(raw.map(r => ({
          ...r,
          percentage: Math.round(((r.cost || 0) / max) * 100)
        })));
      }
      if (failRes.status === 'fulfilled' && failRes.value.data && failRes.value.data.length > 0) {
        setTopFailures(failRes.value.data);
      }
      if (incRes.status === 'fulfilled' && incRes.value.data) {
        const items = incRes.value.data.content || incRes.value.data;
        if (Array.isArray(items) && items.length > 0) {
          setRecentIncidents(items.slice(0, 4));
        }
      }
    } catch (err) {
      console.warn('Backend API offline or failed, using robust mock preview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 p-8 text-white shadow-xl shadow-sky-500/20">
        {/* Glow ambient background elements */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Hệ thống vận hành ổn định • Cao đẳng Công Thương TP.HCM
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trung tâm Điều hành Phòng máy
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Theo dõi trực quan thời gian thực các phòng máy vi tính, tình trạng hỏng hóc, tiến độ xử lý của kỹ thuật viên và tiêu hao kho linh kiện.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('incidents', { openCreateModal: true })}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-700 font-semibold text-sm shadow-lg shadow-black/5 hover:bg-sky-50 transition-all active:scale-95"
            >
              <Plus size={18} className="stroke-[2.5]" />
              Báo hỏng máy ngay
            </button>
            <button
              onClick={loadDashboardData}
              title="Làm mới dữ liệu"
              className="p-3 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all active:scale-95 border border-white/30"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 iOS Glass Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Widget 1: Equipment Health */}
        <div
          onClick={() => onNavigate('rooms')}
          className="glass-panel p-6 rounded-3xl ios-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Monitor size={24} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {Math.round(((summary.activeEquipments || 79) / (summary.totalEquipments || 85)) * 100)}% Tốt
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {summary.activeEquipments || 79}
            <span className="text-sm font-normal text-slate-400 ml-1">/ {summary.totalEquipments || 85} máy</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Máy tính đang hoạt động ({summary.totalRooms || 3} phòng)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Chi tiết phòng máy</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Widget 2: Pending Incidents */}
        <div
          onClick={() => onNavigate('incidents')}
          className="glass-panel p-6 rounded-3xl ios-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
            {summary.criticalIncidents > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30 flex items-center gap-1 animate-pulse">
                <ShieldAlert size={12} />
                {summary.criticalIncidents} Khẩn cấp
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {summary.openIncidents || 4}
            <span className="text-sm font-normal text-slate-400 ml-1">sự cố</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Cần xử lý & đang bảo trì ({summary.underRepairEquipments || 2} máy đang sửa)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-600 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Tiến độ khắc phục</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Widget 3: Total Repair Cost */}
        <div className="glass-panel p-6 rounded-3xl ios-card-hover group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Banknote size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Tháng 10/2026
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {formatCurrency(summary.totalRepairCost || 4850000)}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Tổng kinh phí vật tư & sửa chữa
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp size={14} />
            <span>Tiết kiệm 25% nhờ tự bảo trì</span>
          </div>
        </div>

        {/* Widget 4: Spare Parts Stock Alert */}
        <div
          onClick={() => onNavigate('spare-parts')}
          className="glass-panel p-6 rounded-3xl ios-card-hover cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Boxes size={24} />
            </div>
            {summary.lowStockPartsCount > 0 ? (
              <span className="text-xs font-bold text-amber-600 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 animate-pulse">
                Cần nhập thêm
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Đủ linh kiện
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {summary.lowStockPartsCount || 2}
            <span className="text-sm font-normal text-slate-400 ml-1">loại vật tư</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Linh kiện có số lượng dưới mức tối thiểu
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Kiểm tra kho ngay</span>
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>

      {/* Main Grid: Room Cost Visualizer & Top Failures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Room Repair Cost Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Kinh phí Sửa chữa theo Phòng máy
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Thống kê chi phí thay thế linh kiện máy tính tích lũy
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
              Biểu đồ phân bổ
            </span>
          </div>

          <div className="space-y-5">
            {roomCosts.map((room, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500" />
                    {room.roomName}
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(room.cost)}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 transition-all duration-700"
                    style={{ width: `${Math.max(room.percentage || 15, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          <div className="mt-8 p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-800 leading-relaxed">
              <strong>Đánh giá định kỳ:</strong> Phòng Máy 01 có tỷ trọng sử dụng cao nhất do phục vụ các ca thực hành Lập trình & Đồ họa liên tục. Đề xuất bảo trì vệ sinh bụi và tra keo tản nhiệt định kỳ mỗi 6 tháng.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Top Breakdown Items */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Top Máy hay Hỏng
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cần đưa vào diện theo dõi đặc biệt
              </p>
            </div>
            <Cpu size={20} className="text-slate-400" />
          </div>

          <div className="space-y-4">
            {topFailures.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/60 hover:bg-white/90 border border-white/80 transition-all shadow-sm flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {item.equipmentName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.categoryName}
                  </div>
                  {item.lastIssue && (
                    <div className="text-[11px] text-amber-600 font-medium mt-1">
                      ⚠️ {item.lastIssue}
                    </div>
                  )}
                </div>
                <div className="text-center shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200/50">
                    {item.failureCount} lần
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table / Stream */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Sự cố Mới Báo cáo Gần đây
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Danh sách các yêu cầu sửa chữa phòng máy được gửi lên từ Giảng viên & Sinh viên
            </p>
          </div>
          <button
            onClick={() => onNavigate('incidents')}
            className="self-start sm:self-auto text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all"
          >
            Xem tất cả sự cố &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Mã sự cố</th>
                <th className="pb-3">Phòng & Thiết bị</th>
                <th className="pb-3">Mô tả hiện tượng</th>
                <th className="pb-3">Ưu tiên</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 text-right pr-2">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {recentIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onNavigate('incidents')}
                  className="hover:bg-sky-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pl-2 font-mono text-xs font-bold text-sky-600 group-hover:underline">
                    {inc.ticketCode || `SC-#${inc.id}`}
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-800">{inc.equipmentName || 'PC Phòng máy'}</div>
                    <div className="text-xs text-slate-400">{inc.roomName || 'PM01'}</div>
                  </td>
                  <td className="py-3.5 text-xs text-slate-600 max-w-xs truncate">
                    {inc.description}
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={inc.priority || 'TRUNG_BINH'} />
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={inc.status || 'MOI_TAO'} />
                  </td>
                  <td className="py-3.5 text-right pr-2 text-xs text-slate-400">
                    <div className="flex items-center justify-end gap-1">
                      <Clock size={12} />
                      {inc.reportedAt || 'Hôm nay'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
