import React, { useState, useEffect } from 'react';
import { incidentApi } from '../api/incidentApi';
import { roomApi } from '../api/roomApi';
import { equipmentApi } from '../api/equipmentApi';
import { sparePartApi } from '../api/sparePartApi';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { GlassModal } from '../components/GlassModal';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Wrench,
  Package,
  Layers,
  ArrowRight,
  ShieldAlert,
  Calendar,
  DollarSign,
  Trash2,
  Check
} from 'lucide-react';

export const IncidentReportsPage = ({ initialOpenCreate = false, prefillData = null, onClearPrefill }) => {
  const { user, isTechnician, isAdmin } = useAuth();

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      ticketCode: 'SC-202610-001',
      roomName: 'Phòng Máy 01 (Thực hành Web)',
      equipmentCode: 'PC-PM01-08',
      equipmentName: 'Máy trạm PC-PM01-08 (Dell OptiPlex 7080)',
      description: 'Máy bị dump xanh (BSOD WHEA_UNCORRECTABLE_ERROR), màn hình chớp tắt liên tục, nghi ngờ lỏng RAM hoặc khe RAM bị oxy hóa.',
      priority: 'KHAN_CAP',
      status: 'DANG_SUA',
      reportedAt: '2026-10-22 08:30',
      reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
      reporterPhone: '0987.654.321',
      technicianName: 'Nguyễn Văn Kỹ Thuật (KTV Trưởng)',
      totalCost: 450000,
      histories: [
        {
          id: 101,
          actionType: 'KHAO_SAT',
          note: 'Đã kiểm tra lúc 09:00: Khe RAM 1 bị lỏng chân tiếp xúc, test Memtest86 phát hiện lỗi trên thanh RAM 8GB DDR4.',
          durationMinutes: 20,
          technicianName: 'Nguyễn Văn Kỹ Thuật',
          createdAt: '2026-10-22 09:10',
          partsUsed: []
        }
      ]
    },
    {
      id: 2,
      ticketCode: 'SC-202610-002',
      roomName: 'Phòng Máy 02 (Mạng Máy Tính)',
      equipmentCode: 'PC-PM02-03',
      equipmentName: 'Máy trạm PC-PM02-03 (HP ProDesk 400)',
      description: 'Bấm nút nguồn không có tín hiệu điện, quạt nguồn không quay, mùi khét nhẹ ở bộ nguồn PSU.',
      priority: 'CAO',
      status: 'DA_TIEP_NHAN',
      reportedAt: '2026-10-22 09:15',
      reporterName: 'Thầy Nguyễn Văn Hoàng (Giảng viên Mạng)',
      reporterPhone: '0912.333.444',
      technicianName: 'Lê Kỹ Thuật Viên',
      totalCost: 0,
      histories: []
    },
    {
      id: 3,
      ticketCode: 'SC-202610-003',
      roomName: 'Phòng Máy 01 (Thực hành Web)',
      equipmentCode: 'PC-PM01-12',
      equipmentName: 'Máy trạm PC-PM01-12',
      description: 'Bàn phím bị kẹt phím cách (Space) và liệt phím Enter, chuột quang bị giật con trỏ không di chuyển mượt mà.',
      priority: 'TRUNG_BINH',
      status: 'MOI_TAO',
      reportedAt: '2026-10-22 10:45',
      reporterName: 'Trần Văn Bảo (Sinh viên)',
      reporterPhone: '0901.222.111',
      technicianName: null,
      totalCost: 0,
      histories: []
    },
    {
      id: 4,
      ticketCode: 'SC-202610-004',
      roomName: 'Phòng Máy 01 (Thực hành Web)',
      equipmentCode: 'PC-PM01-15',
      equipmentName: 'Máy trạm PC-PM01-15',
      description: 'Ổ cứng SSD khởi động chậm, vào Windows báo lỗi Disk Read Error.',
      priority: 'CAO',
      status: 'HOAN_THANH',
      reportedAt: '2026-10-21 14:00',
      reporterName: 'Cô Lê Thị Kim Yến',
      reporterPhone: '0912.888.999',
      technicianName: 'Nguyễn Văn Kỹ Thuật',
      totalCost: 850000,
      histories: [
        {
          id: 99,
          actionType: 'THAY_THE',
          note: 'Đã thay ổ cứng SSD Kingston NVMe 512GB mới, ghost lại bản Windows 11 Enterprise HITC chuẩn. Máy chạy cực mượt.',
          durationMinutes: 45,
          technicianName: 'Nguyễn Văn Kỹ Thuật',
          createdAt: '2026-10-21 15:30',
          partsUsed: [
            { sparePartName: 'SSD Kingston NVMe 512GB M.2', quantity: 1, unitPrice: 850000 }
          ]
        }
      ]
    }
  ]);

  const [spareParts, setSpareParts] = useState([
    { id: 1, partCode: 'RAM-DDR4-8G', partName: 'RAM Kingston 8GB DDR4 Bus 3200', unitPrice: 450000, stockQuantity: 12 },
    { id: 2, partCode: 'RAM-DDR4-16G', partName: 'RAM Kingston 16GB DDR4 Bus 3200', unitPrice: 850000, stockQuantity: 8 },
    { id: 3, partCode: 'SSD-512G-M2', partName: 'SSD Kingston NVMe 512GB M.2', unitPrice: 850000, stockQuantity: 2 },
    { id: 4, partCode: 'PSU-500W-AER', partName: 'Nguồn Cooler Master 500W Elite', unitPrice: 650000, stockQuantity: 1 },
    { id: 5, partCode: 'KB-LOGI-K120', partName: 'Bàn phím có dây Logitech K120 USB', unitPrice: 180000, stockQuantity: 25 },
    { id: 6, partCode: 'MS-LOGI-B100', partName: 'Chuột quang Logitech B100 USB', unitPrice: 110000, stockQuantity: 30 },
  ]);

  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Xem chi tiết & Lịch sử
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Modal Tạo phiếu mới
  const [createModalOpen, setCreateModalOpen] = useState(initialOpenCreate);
  const [createForm, setCreateForm] = useState({
    roomName: 'Phòng Máy 01 (Thực hành Web)',
    equipmentName: 'PC-PM01-08',
    description: '',
    priority: 'TRUNG_BINH',
    reporterPhone: '0987.654.321'
  });

  // Modal Xử lý sửa chữa & Thay linh kiện (KTV / Admin)
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [repairTargetIncident, setRepairTargetIncident] = useState(null);
  const [repairForm, setRepairForm] = useState({
    actionType: 'THAY_THE',
    note: '',
    durationMinutes: 30,
    selectedPartId: '',
    quantityUsed: 1,
    markCompleted: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await incidentApi.getAll();
      if (res.data) {
        const list = res.data.content || res.data;
        if (Array.isArray(list) && list.length > 0) {
          setIncidents(list);
        }
      }
    } catch (err) {
      console.warn('Incident load fallback to mock');
    }

    try {
      const partRes = await sparePartApi.getAll();
      if (partRes.data && partRes.data.length > 0) {
        setSpareParts(partRes.data);
      }
    } catch (err) {
      // Use mock
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (prefillData) {
      setCreateForm(prev => ({
        ...prev,
        roomName: prefillData.roomName || prev.roomName,
        equipmentName: prefillData.equipmentCode || prefillData.equipmentName || prev.equipmentName,
      }));
      setCreateModalOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillData]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // Lọc danh sách
  const filteredIncidents = incidents.filter(inc => {
    const matchStatus = filterStatus === 'ALL' || inc.status === filterStatus;
    const matchSearch = (inc.ticketCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (inc.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (inc.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (inc.reporterName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Xử lý tạo phiếu
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const newTicket = {
      id: Date.now(),
      ticketCode: `SC-202610-${Math.floor(100 + Math.random() * 900)}`,
      roomName: createForm.roomName,
      equipmentCode: createForm.equipmentName,
      equipmentName: `Máy trạm ${createForm.equipmentName}`,
      description: createForm.description,
      priority: createForm.priority,
      status: 'MOI_TAO',
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reporterName: user?.fullName || 'Lê Nguyễn Ngọc Duy Anh (Sinh viên)',
      reporterPhone: createForm.reporterPhone,
      technicianName: null,
      totalCost: 0,
      histories: []
    };

    try {
      await incidentApi.create(newTicket);
    } catch (err) {
      // Keep optimistic UI update
    }

    setIncidents([newTicket, ...incidents]);
    setCreateModalOpen(false);
    setCreateForm({
      roomName: 'Phòng Máy 01 (Thực hành Web)',
      equipmentName: '',
      description: '',
      priority: 'TRUNG_BINH',
      reporterPhone: '0987.654.321'
    });
  };

  // Tiếp nhận phiếu (Dành cho KTV)
  const handleAssignToMe = async (inc) => {
    const techName = user?.fullName || 'Nguyễn Văn Kỹ Thuật';
    try {
      await incidentApi.updateStatus(inc.id, 'DA_TIEP_NHAN');
    } catch (err) {}

    setIncidents(incidents.map(item => {
      if (item.id === inc.id) {
        return {
          ...item,
          status: 'DA_TIEP_NHAN',
          technicianName: techName,
        };
      }
      return item;
    }));
  };

  // Mở modal sửa chữa & thay vật tư
  const handleOpenRepairModal = (inc) => {
    setRepairTargetIncident(inc);
    setRepairForm({
      actionType: 'THAY_THE',
      note: '',
      durationMinutes: 30,
      selectedPartId: spareParts[0]?.id || '',
      quantityUsed: 1,
      markCompleted: true,
    });
    setRepairModalOpen(true);
  };

  // Xác nhận sửa chữa & trừ kho vật tư
  const handleConfirmRepair = async (e) => {
    e.preventDefault();
    if (!repairTargetIncident) return;

    const chosenPart = spareParts.find(p => p.id === Number(repairForm.selectedPartId));
    const partCost = chosenPart ? chosenPart.unitPrice * repairForm.quantityUsed : 0;

    const newHistory = {
      id: Date.now(),
      actionType: repairForm.actionType,
      note: repairForm.note || (chosenPart ? `Đã thay thế ${chosenPart.partName}` : 'Đã sửa chữa và kiểm tra thành công'),
      durationMinutes: Number(repairForm.durationMinutes),
      technicianName: user?.fullName || 'Kỹ thuật viên HITC',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      partsUsed: chosenPart ? [{
        sparePartName: chosenPart.partName,
        quantity: repairForm.quantityUsed,
        unitPrice: chosenPart.unitPrice
      }] : []
    };

    // Gửi request API record history
    try {
      await incidentApi.recordHistory({
        incidentId: repairTargetIncident.id,
        actionType: repairForm.actionType,
        note: newHistory.note,
        durationMinutes: newHistory.durationMinutes,
        partsUsed: chosenPart ? [{
          sparePartId: chosenPart.id,
          quantityUsed: repairForm.quantityUsed
        }] : []
      });
    } catch (err) {
      console.warn('Fallback local state update');
    }

    // Cập nhật trạng thái sự cố trong state
    setIncidents(incidents.map(inc => {
      if (inc.id === repairTargetIncident.id) {
        const nextStatus = repairForm.markCompleted ? 'HOAN_THANH' : 'DANG_SUA';
        return {
          ...inc,
          status: nextStatus,
          totalCost: (inc.totalCost || 0) + partCost,
          histories: [newHistory, ...(inc.histories || [])]
        };
      }
      return inc;
    }));

    // Cập nhật tồn kho cục bộ nếu có dùng vật tư
    if (chosenPart) {
      setSpareParts(spareParts.map(p => {
        if (p.id === chosenPart.id) {
          return { ...p, stockQuantity: Math.max(0, p.stockQuantity - repairForm.quantityUsed) };
        }
        return p;
      }));
    }

    setRepairModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <AlertCircle className="text-sky-600" size={28} />
            Phiếu Báo Hỏng & Quản Lý Sửa Chữa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình tiếp nhận báo hỏng từ người dùng, phân công kỹ thuật và xuất kho thay thế linh kiện
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 shrink-0"
        >
          <Plus size={18} className="stroke-[2.5]" />
          Tạo phiếu báo hỏng mới
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã SC, phòng, thiết bị..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'MOI_TAO', label: 'Mới tạo' },
            { id: 'DA_TIEP_NHAN', label: 'Đã nhận' },
            { id: 'DANG_SUA', label: 'Đang sửa' },
            { id: 'HOAN_THANH', label: 'Hoàn thành' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/60 text-slate-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Ticket List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIncidents.map((inc) => {
          const isCritical = inc.priority === 'KHAN_CAP';
          const isDone = inc.status === 'HOAN_THANH';

          return (
            <div
              key={inc.id}
              className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all duration-200 hover:shadow-lg ${
                isCritical && !isDone
                  ? 'border-rose-300/80 bg-rose-50/30'
                  : 'hover:border-sky-300/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left Ticket Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-extrabold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-lg border border-sky-200/60">
                      {inc.ticketCode}
                    </span>
                    <StatusBadge status={inc.priority} />
                    <StatusBadge status={inc.status} />
                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto lg:ml-0">
                      <Clock size={13} /> {inc.reportedAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                      {inc.equipmentName}
                      <span className="text-xs font-medium text-slate-400">({inc.roomName})</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed bg-white/60 p-3 rounded-2xl border border-white/80">
                      {inc.description}
                    </p>
                  </div>

                  {/* Reporter & Tech assigned */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-sky-500" />
                      Người báo: <strong className="text-slate-700">{inc.reporterName}</strong>
                    </span>
                    {inc.technicianName && (
                      <span className="flex items-center gap-1.5">
                        <Wrench size={14} className="text-purple-500" />
                        Kỹ thuật: <strong className="text-purple-700">{inc.technicianName}</strong>
                      </span>
                    )}
                    {inc.totalCost > 0 && (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <DollarSign size={14} />
                        Chi phí: {formatCurrency(inc.totalCost)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  {/* View Details Button */}
                  <button
                    onClick={() => {
                      setSelectedIncident(inc);
                      setDetailModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs transition-all"
                  >
                    Lịch sử xử lý ({inc.histories?.length || 0})
                  </button>

                  {/* Technician Actions */}
                  {(isTechnician || isAdmin) && (
                    <>
                      {inc.status === 'MOI_TAO' && (
                        <button
                          onClick={() => handleAssignToMe(inc)}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all"
                        >
                          Tiếp nhận xử lý
                        </button>
                      )}

                      {(inc.status === 'DA_TIEP_NHAN' || inc.status === 'DANG_SUA') && (
                        <button
                          onClick={() => handleOpenRepairModal(inc)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                          <Wrench size={14} />
                          Sửa chữa & Trừ kho
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredIncidents.length === 0 && (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
            <h3 className="font-bold text-slate-700">Không có sự cố nào phù hợp</h3>
            <p className="text-xs text-slate-400">Tất cả thiết bị trong phòng máy đang vận hành trơn tru!</p>
          </div>
        )}
      </div>

      {/* Modal 1: Tạo Phiếu Báo Hỏng */}
      <GlassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Gửi Yêu Cầu Báo Hỏng Máy Tính"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phòng máy gặp sự cố *</label>
            <select
              value={createForm.roomName}
              onChange={(e) => setCreateForm({ ...createForm, roomName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Phòng Máy 01 (Thực hành Web)">Phòng Máy 01 (Thực hành Web)</option>
              <option value="Phòng Máy 02 (Mạng Máy Tính)">Phòng Máy 02 (Mạng Máy Tính)</option>
              <option value="Phòng Máy 03 (Đồ Họa)">Phòng Máy 03 (Đồ Họa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mã máy tính bị hỏng *</label>
            <input
              type="text"
              required
              placeholder="VD: PC-PM01-08 hoặc Màn hình số 5"
              value={createForm.equipmentName}
              onChange={(e) => setCreateForm({ ...createForm, equipmentName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mức độ khẩn cấp *</label>
            <select
              value={createForm.priority}
              onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="THAP">Thấp (Chưa ảnh hưởng trực tiếp giờ học)</option>
              <option value="TRUNG_BINH">Trung bình (Bàn phím, chuột lỗi nhẹ)</option>
              <option value="CAO">Cao (Máy không khởi động được)</option>
              <option value="KHAN_CAP">Khẩn cấp (Hỏng nguồn, bốc khói, sập mạng)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả hiện tượng chi tiết *</label>
            <textarea
              required
              rows={4}
              placeholder="Mô tả cụ thể hiện tượng: Máy có tiếng bíp, màn hình xanh mã lỗi, không kết nối được mạng LAN..."
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              Gửi phiếu báo hỏng
            </button>
          </div>
        </form>
      </GlassModal>

      {/* Modal 2: Xử Lý Sửa Chữa & Trừ Kho Linh Kiện (Kỹ Thuật Viên) */}
      <GlassModal
        isOpen={repairModalOpen}
        onClose={() => setRepairModalOpen(false)}
        title={repairTargetIncident ? `Sửa chữa ${repairTargetIncident.ticketCode}` : 'Ghi nhận sửa chữa'}
        maxWidth="max-w-xl"
      >
        {repairTargetIncident && (
          <form onSubmit={handleConfirmRepair} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-800 space-y-1">
              <div><strong>Thiết bị:</strong> {repairTargetIncident.equipmentName}</div>
              <div><strong>Vấn đề:</strong> {repairTargetIncident.description}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loại hành động khắc phục *</label>
              <select
                value={repairForm.actionType}
                onChange={(e) => setRepairForm({ ...repairForm, actionType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="SUA_CHUA">Sửa chữa / Cài đặt phần mềm / Vệ sinh</option>
                <option value="THAY_THE">Thay thế linh kiện phần cứng (Trừ kho tự động)</option>
                <option value="KHAO_SAT">Khảo sát & Kiểm tra chuyên sâu</option>
              </select>
            </div>

            {repairForm.actionType === 'THAY_THE' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Package size={14} /> Xuất kho linh kiện thay thế
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold">Tự động trừ số lượng tồn</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Linh kiện lấy từ kho</label>
                    <select
                      value={repairForm.selectedPartId}
                      onChange={(e) => setRepairForm({ ...repairForm, selectedPartId: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {spareParts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.partName} (Còn: {part.stockQuantity} - {formatCurrency(part.unitPrice)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số lượng</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={repairForm.quantityUsed}
                      onChange={(e) => setRepairForm({ ...repairForm, quantityUsed: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú kỹ thuật / Kết quả sửa chữa</label>
              <textarea
                rows={3}
                placeholder="VD: Đã tháo thanh RAM cũ bị hỏng, lắp RAM mới và test Windows hoạt động ổn định 30 phút."
                value={repairForm.note}
                onChange={(e) => setRepairForm({ ...repairForm, note: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <input
                type="checkbox"
                id="markCompleted"
                checked={repairForm.markCompleted}
                onChange={(e) => setRepairForm({ ...repairForm, markCompleted: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="markCompleted" className="text-xs font-semibold text-emerald-800 cursor-pointer">
                Đánh dấu hoàn thành phiếu & Khôi phục máy tính về trạng thái "Hoạt Động"
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRepairModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Xác nhận lưu & Khôi phục máy
              </button>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Modal 3: Chi Tiết Phiếu & Nhật Ký Sửa Chữa */}
      <GlassModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedIncident ? `Nhật ký ${selectedIncident.ticketCode}` : 'Chi tiết'}
        maxWidth="max-w-2xl"
      >
        {selectedIncident && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">{selectedIncident.equipmentName}</span>
                <StatusBadge status={selectedIncident.status} />
              </div>
              <div className="text-slate-500 leading-relaxed">
                {selectedIncident.description}
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Người báo: {selectedIncident.reporterName}</span>
                <span>KTV: {selectedIncident.technicianName || 'Chưa phân công'}</span>
              </div>
            </div>

            {/* Timeline of repair histories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench size={14} /> Tiến trình sửa chữa & Vật tư thay thế
              </h4>

              {selectedIncident.histories && selectedIncident.histories.length > 0 ? (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedIncident.histories.map((hist, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm" />
                      <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                            {hist.actionType}
                          </span>
                          <span className="text-slate-400">{hist.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-700">{hist.note}</p>

                        {hist.partsUsed && hist.partsUsed.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                            <span className="text-[10px] font-bold text-amber-700 uppercase">Linh kiện đã dùng:</span>
                            {hist.partsUsed.map((part, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between text-xs text-slate-600 bg-amber-50/50 p-1.5 rounded-lg">
                                <span>{part.sparePartName} (x{part.quantity})</span>
                                <strong className="text-amber-800">{formatCurrency(part.unitPrice * part.quantity)}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-400">
                  Chưa có nhật ký sửa chữa nào được ghi nhận cho phiếu này.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};
