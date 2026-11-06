import React, { useState, useEffect } from 'react';
import { incidentApi } from '../../api/incidentApi';
import { sparePartApi } from '../../api/sparePartApi';
import {
  Plus,
  Search,
  AlertCircle,
  Wrench,
  Trash2,
  UserCheck,
  Package,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEY = 'labrepair_incidents_v2';
const SPARE_PARTS_STORAGE_KEY = 'labrepair_spare_parts_v2';
const EQUIPMENTS_STORAGE_KEY = 'labrepair_equipments_v2';

const DEFAULT_INCIDENTS = [
  {
    id: 1,
    ticketCode: 'SC-2024-001',
    equipmentCode: 'PC-A101-01',
    equipmentName: 'Máy trạm PC-A101-01',
    roomName: 'Phòng A101 (Lập trình Cơ sở)',
    description: 'Máy tính không lên nguồn và màn hình đen',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh',
    technicianName: 'Kỹ thuật viên Nguyễn Văn Trực',
    priority: 'CAO',
    status: 'DA_TIEP_NHAN',
    totalCost: 0,
    createdAt: '2026-11-06 08:15:00'
  },
  {
    id: 2,
    ticketCode: 'SC-2024-002',
    equipmentCode: 'PC-A101-05',
    equipmentName: 'Máy trạm PC-A101-05',
    roomName: 'Phòng A101 (Lập trình Cơ sở)',
    description: 'Máy bật nguồn không lên, đèn nguồn nhấp nháy màu cam liên tục.',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    technicianName: null,
    priority: 'CAO',
    status: 'MOI_TAO',
    totalCost: 0,
    createdAt: '2026-11-06 08:30:15'
  },
  {
    id: 3,
    ticketCode: 'SC-2024-003',
    equipmentCode: 'PC-A101-12',
    equipmentName: 'Máy trạm PC-A101-12',
    roomName: 'Phòng A101 (Lập trình Cơ sở)',
    description: 'Bàn phím bị kẹt cứng phím Enter và liệt hàng phím số F1-F12.',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    technicianName: 'Kỹ thuật viên Nguyễn Văn Trực',
    priority: 'TRUNG_BINH',
    status: 'DA_TIEP_NHAN',
    totalCost: 0,
    createdAt: '2026-11-06 09:15:20'
  },
  {
    id: 4,
    ticketCode: 'SC-2024-004',
    equipmentCode: 'PC-A101-18',
    equipmentName: 'Máy trạm PC-A101-18',
    roomName: 'Phòng A101 (Lập trình Cơ sở)',
    description: 'Máy đang sử dụng thì xuất hiện màn hình xanh chết chóc (BSOD) tự khởi động lại.',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    technicianName: null,
    priority: 'CAO',
    status: 'MOI_TAO',
    totalCost: 0,
    createdAt: '2026-11-06 10:45:00'
  },
  {
    id: 5,
    ticketCode: 'SC-2024-005',
    equipmentCode: 'PC-A204-03',
    equipmentName: 'Máy trạm PC-A204-03',
    roomName: 'Phòng A204 (Java & Spring Boot)',
    description: 'Chuột máy tính chập chờn, cổng USB phía trước thùng máy bị lỏng.',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    technicianName: null,
    priority: 'TRUNG_BINH',
    status: 'MOI_TAO',
    totalCost: 0,
    createdAt: '2026-11-06 11:30:00'
  },
  {
    id: 6,
    ticketCode: 'SC-2024-006',
    equipmentCode: 'PC-B102-05',
    equipmentName: 'Máy trạm PC-B102-05',
    roomName: 'Phòng B102 (Mạng Cisco Lab)',
    description: 'Mất kết nối mạng Internet, kiểm tra dây cáp mạng LAN thấy gãy lẫy tiếp xúc.',
    reporterName: 'Thầy Nguyễn Văn Hoàng',
    technicianName: 'Kỹ thuật viên Nguyễn Văn Trực',
    priority: 'TRUNG_BINH',
    status: 'HOAN_THANH',
    totalCost: 120000,
    createdAt: '2026-11-05 14:00:00'
  },
  {
    id: 7,
    ticketCode: 'SC-2024-007',
    equipmentCode: 'PC-D06-05',
    equipmentName: 'Máy trạm PC-D06-05',
    roomName: 'Phòng D-06 (Đồ họa 3D)',
    description: 'Màn hình bị sọc ngang mờ và chớp tắt khi mở các phần mềm đồ họa nặng.',
    reporterName: 'KTV Nguyễn Văn Trực',
    technicianName: 'Kỹ thuật viên Nguyễn Văn Trực',
    priority: 'CAO',
    status: 'DA_TIEP_NHAN',
    totalCost: 0,
    createdAt: '2026-11-05 15:30:00'
  }
];

const DEFAULT_PARTS_LIST = [
  { id: 1, partCode: 'RAM-DDR4-8G', partName: 'RAM Kingston Fury 8GB DDR4 3200MHz', unitPrice: 450000, stockQuantity: 15, unit: 'Thanh' },
  { id: 2, partCode: 'SSD-256G', partName: 'SSD Kingston A400 256GB SATA3', unitPrice: 550000, stockQuantity: 12, unit: 'Ổ' },
  { id: 3, partCode: 'PSU-500W', partName: 'Nguồn máy tính Cooler Master 500W', unitPrice: 680000, stockQuantity: 8, unit: 'Cái' },
  { id: 4, partCode: 'MOUSE-LOGI', partName: 'Chuột có dây Logitech B100', unitPrice: 95000, stockQuantity: 25, unit: 'Con' },
  { id: 5, partCode: 'KB-DAREU', partName: 'Bàn phím DareU LK145 USB', unitPrice: 180000, stockQuantity: 2, unit: 'Cái' },
  { id: 7, partCode: 'RAM-DDR4-16G', partName: 'RAM Corsair Vengeance 16GB DDR4 3200MHz', unitPrice: 850000, stockQuantity: 8, unit: 'Thanh' },
  { id: 9, partCode: 'SSD-NVME-512G', partName: 'SSD Samsung 980 512GB NVMe M.2', unitPrice: 980000, stockQuantity: 10, unit: 'Ổ' },
];

export const IncidentManagement = () => {
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMojibake = parsed.some(i => (i.description || '').includes('?') || (i.description || '').includes('Ã'));
          if (!hasMojibake) {
            return parsed.map((item, idx) => ({
              ...item,
              id: Number(item.id) || idx + 1
            }));
          }
        }
      }
    } catch (e) {}
    return DEFAULT_INCIDENTS;
  });

  const [availableParts, setAvailableParts] = useState(() => {
    try {
      const saved = localStorage.getItem(SPARE_PARTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PARTS_LIST;
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  // Repair Modal
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [targetIncident, setTargetIncident] = useState(null);
  const [repairForm, setRepairForm] = useState({
    actionType: 'THAY_THE',
    selectedPartId: '1',
    quantity: 1,
    note: '',
    markCompleted: true
  });

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    equipmentCode: 'PC-A101-05',
    equipmentName: 'Máy trạm PC-A101-05',
    roomName: 'Phòng A101 (Lập trình Cơ sở)',
    description: '',
    priority: 'TRUNG_BINH',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh'
  });

  const saveIncidents = (newList) => {
    setIncidents(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {}
  };

  // Tải danh sách linh kiện từ API hoặc LocalStorage
  const loadParts = async () => {
    try {
      const res = await sparePartApi.getAll();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setAvailableParts(res.data);
        return;
      }
    } catch (err) {}

    try {
      const saved = localStorage.getItem(SPARE_PARTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableParts(parsed);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadParts();

    const handlePartsUpdated = () => {
      loadParts();
    };

    window.addEventListener('spare-parts-updated', handlePartsUpdated);
    return () => window.removeEventListener('spare-parts-updated', handlePartsUpdated);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await incidentApi.getAll();
        if (res.data) {
          const list = res.data.content || res.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped = list.map(item => ({
              id: item.id,
              ticketCode: item.ticketCode || `SC-2024-${item.id < 10 ? '00' + item.id : '0' + item.id}`,
              equipmentCode: item.equipmentCode || item.equipment?.equipmentCode || 'PC-A101-01',
              equipmentName: item.equipmentName || item.equipment?.name || 'Máy trạm',
              roomName: item.roomName || item.equipment?.roomName || 'Phòng A101',
              description: item.description,
              reporterName: item.reporterName || item.reportedByUser?.fullName || 'Lê Nguyễn Ngọc Duy Anh',
              technicianName: item.technicianName || item.assignedTechnician?.fullName || null,
              priority: item.priority || 'CAO',
              status: item.status || 'MOI_TAO',
              totalCost: item.actualCost || item.costEstimate || 0,
              createdAt: (item.createdAt || '').slice(0, 19).replace('T', ' ')
            }));
            saveIncidents(mapped);
          }
        }
      } catch (err) {}
    };
    fetchApi();
  }, []);

  const getNextCleanId = () => {
    if (!incidents || incidents.length === 0) return 1;
    const maxId = Math.max(...incidents.map(i => Number(i.id) || 0));
    return maxId + 1;
  };

  const filtered = incidents.filter((item) => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchSearch =
      (item.ticketCode || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.equipmentCode || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.reporterName || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'KHAN_CAP': return <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Khẩn cấp</span>;
      case 'CAO': return <span className="text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Cao</span>;
      case 'TRUNG_BINH': return <span className="text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">Trung bình</span>;
      default: return <span className="text-slate-400">Thấp</span>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'MOI_TAO': return <span className="text-blue-400 font-bold">Mới tạo</span>;
      case 'DA_TIEP_NHAN': return <span className="text-purple-400 font-bold">Đã nhận</span>;
      case 'DANG_SUA': return <span className="text-amber-400 font-bold">Đang sửa</span>;
      case 'HOAN_THANH': return <span className="text-emerald-400 font-bold">Hoàn thành</span>;
      default: return <span className="text-slate-400">Đã hủy</span>;
    }
  };

  const handleAssignMe = async (inc) => {
    const updated = incidents.map((i) =>
      i.id === inc.id
        ? { ...i, status: 'DA_TIEP_NHAN', technicianName: 'Kỹ thuật viên Nguyễn Văn Trực' }
        : i
    );
    saveIncidents(updated);

    try {
      await incidentApi.updateStatus(inc.id, 'DA_TIEP_NHAN');
    } catch (err) {}
  };

  const handleOpenRepair = (inc) => {
    setTargetIncident(inc);
    const defaultPartId = availableParts[0]?.id ? String(availableParts[0].id) : '1';
    setRepairForm({
      actionType: 'THAY_THE',
      selectedPartId: defaultPartId,
      quantity: 1,
      note: 'Đã thay thế linh kiện lỗi và kiểm tra thiết bị hoạt động ổn định',
      markCompleted: true
    });
    setRepairModalOpen(true);
  };

  // XỬ LÝ SỬA CHỮA VÀ TRỪ LINH KIỆN TRONG KHO (CẢ LOCALSTORAGE VÀ DATABASE)
  const handleSaveRepair = async (e) => {
    e.preventDefault();
    if (!targetIncident) return;

    const chosenPart = availableParts.find(p => p.id === Number(repairForm.selectedPartId)) || availableParts[0];
    const qtyUsed = Math.max(1, Number(repairForm.quantity) || 1);
    const addedCost = chosenPart ? (Number(chosenPart.unitPrice) || 0) * qtyUsed : 0;
    const isCompleted = repairForm.markCompleted;
    const nextStatus = isCompleted ? 'HOAN_THANH' : 'DANG_SUA';

    // 1. TRỪ SỐ LƯỢNG LINH KIỆN TRONG LOCALSTORAGE
    if (repairForm.actionType === 'THAY_THE' && chosenPart) {
      try {
        const savedParts = localStorage.getItem(SPARE_PARTS_STORAGE_KEY);
        let partList = savedParts ? JSON.parse(savedParts) : availableParts;
        const updatedParts = partList.map(p => {
          if (p.id === chosenPart.id || p.partCode === chosenPart.partCode) {
            const currentStock = Number(p.stockQuantity) || 0;
            const newStock = Math.max(0, currentStock - qtyUsed);
            return { ...p, stockQuantity: newStock };
          }
          return p;
        });
        localStorage.setItem(SPARE_PARTS_STORAGE_KEY, JSON.stringify(updatedParts));
        setAvailableParts(updatedParts);

        // Phát event thông báo để trang Kho linh kiện tự động reload
        window.dispatchEvent(new Event('spare-parts-updated'));
      } catch (err) {
        console.error('Lỗi khi trừ kho trong localStorage:', err);
      }

      // 2. TRỪ SỐ LƯỢNG QUA API BACKEND NẾU CÓ
      try {
        await sparePartApi.deduct(chosenPart.id, qtyUsed);
      } catch (err) {
        console.warn('API deductStock failed, fallback to local deduction');
      }
    }

    // 3. GHI NHẬN LỊCH SỬ SỬA CHỮA & CẬP NHẬT TRẠNG THÁI PHIẾU
    try {
      await incidentApi.recordHistory({
        incidentId: targetIncident.id,
        actionType: isCompleted ? 'HOAN_THANH' : repairForm.actionType,
        note: repairForm.note || (chosenPart ? `Đã thay thế ${chosenPart.partName} và kiểm tra hoàn tất.` : 'Đã sửa chữa thiết bị.'),
        durationMinutes: 30,
        markCompleted: isCompleted,
        partsUsed: (repairForm.actionType === 'THAY_THE' && chosenPart) ? [{
          sparePartId: chosenPart.id,
          quantityUsed: qtyUsed
        }] : []
      });

      if (isCompleted) {
        await incidentApi.updateStatus(targetIncident.id, 'HOAN_THANH');
      }
    } catch (err) {
      console.warn('API recordHistory failed, optimistic state used');
    }

    // 4. CẬP NHẬT TRẠNG THÁI PHIẾU TRONG DANH SÁCH STATE & LOCALSTORAGE
    const updatedIncidents = incidents.map((i) =>
      i.id === targetIncident.id
        ? {
            ...i,
            status: nextStatus,
            totalCost: (Number(i.totalCost) || 0) + addedCost,
            technicianName: i.technicianName || 'Kỹ thuật viên Nguyễn Văn Trực'
          }
        : i
    );
    saveIncidents(updatedIncidents);

    // 5. NẾU HOÀN THÀNH, PHỤC HỒI MÁY TÍNH VỀ TRẠNG THÁI 'HOAT_DONG' TRONG LOCALSTORAGE
    if (isCompleted && targetIncident.equipmentCode) {
      try {
        const savedEq = localStorage.getItem(EQUIPMENTS_STORAGE_KEY);
        if (savedEq) {
          const eqList = JSON.parse(savedEq);
          const updatedEq = eqList.map(eq =>
            eq.equipmentCode === targetIncident.equipmentCode ? { ...eq, status: 'HOAT_DONG' } : eq
          );
          localStorage.setItem(EQUIPMENTS_STORAGE_KEY, JSON.stringify(updatedEq));
        }
      } catch (err) {}
    }

    setRepairModalOpen(false);
    setToastMessage(`Đã xuất kho thành công: Trừ ${qtyUsed}x ${chosenPart?.partName || 'Linh kiện'}! Phiếu ${targetIncident.ticketCode} đã chuyển sang ${isCompleted ? 'Hoàn thành' : 'Đang sửa'}.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await incidentApi.create({
        equipmentCode: createForm.equipmentCode,
        description: createForm.description,
        priority: createForm.priority,
        reporterName: createForm.reporterName,
      });

      if (res && res.data) {
        const item = res.data;
        const newTicket = {
          id: item.id,
          ticketCode: item.ticketCode || `SC-2024-${item.id < 10 ? '00' + item.id : '0' + item.id}`,
          equipmentCode: item.equipmentCode || createForm.equipmentCode,
          equipmentName: item.equipmentName || `Máy trạm ${createForm.equipmentCode}`,
          roomName: item.roomName || createForm.roomName || 'Phòng A101',
          description: item.description || createForm.description,
          reporterName: item.reporterName || createForm.reporterName || 'Lê Nguyễn Ngọc Duy Anh',
          technicianName: null,
          priority: item.priority || createForm.priority,
          status: item.status || 'MOI_TAO',
          totalCost: 0,
          createdAt: (item.createdAt || '').slice(0, 19).replace('T', ' ') || new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
        const updated = [newTicket, ...incidents.filter(i => i.id !== newTicket.id)];
        saveIncidents(updated);
      }
    } catch (err) {
      const cleanId = getNextCleanId();
      const newInc = {
        id: cleanId,
        ticketCode: `SC-2024-${cleanId < 10 ? '00' + cleanId : cleanId < 100 ? '0' + cleanId : cleanId}`,
        ...createForm,
        technicianName: null,
        status: 'MOI_TAO',
        totalCost: 0,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      const updated = [newInc, ...incidents];
      saveIncidents(updated);
    }

    setCreateModalOpen(false);
    setToastMessage(`Đã tạo phiếu sự cố mới thành công!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa phiếu sự cố này?')) {
      const updated = incidents.filter((i) => i.id !== id);
      saveIncidents(updated);

      try {
        await incidentApi.delete(id);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Incident Reports</h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" /> Add New
          </button>
        </div>
        <div className="text-xs text-slate-400">
          Management / <span className="text-slate-200 font-medium">Incident Reports</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#181d26] p-3.5 rounded-xl border border-[#272e3d] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Search:</span>
          <input
            type="text"
            placeholder="Tìm theo mã sự cố, thiết bị, người báo..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-72"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Status</option>
            <option value="MOI_TAO">Mới tạo (Open)</option>
            <option value="DA_TIEP_NHAN">Đã nhận (Assigned)</option>
            <option value="DANG_SUA">Đang sửa chữa (Repairing)</option>
            <option value="HOAN_THANH">Đã hoàn thành (Closed)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181d26] rounded-xl border border-[#272e3d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151922] border-b border-[#272e3d] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">ID</th>
                <th className="py-3 px-3">TICKET CODE</th>
                <th className="py-3 px-3">EQUIPMENT / ROOM</th>
                <th className="py-3 px-3">ISSUE DESCRIPTION</th>
                <th className="py-3 px-3">REPORTER</th>
                <th className="py-3 px-3">TECHNICIAN</th>
                <th className="py-3 px-3">PRIORITY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">COST</th>
                <th className="py-3 px-3">CREATED AT</th>
                <th className="py-3 px-4 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b38]">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#1f2633] transition-colors">
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono font-bold">{inc.id}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-sky-400">{inc.ticketCode}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{inc.equipmentCode}</div>
                    <div className="text-[11px] text-slate-400">{inc.roomName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate" title={inc.description}>
                    {inc.description}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{inc.reporterName}</td>
                  <td className="py-3.5 px-3">
                    {inc.technicianName ? (
                      <span className="text-purple-300 font-medium">{inc.technicianName}</span>
                    ) : (
                      <span className="text-slate-500 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">{getPriorityBadge(inc.priority)}</td>
                  <td className="py-3.5 px-3">{getStatusBadge(inc.status)}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                    {inc.totalCost > 0 ? formatCurrency(inc.totalCost) : '-'}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">{inc.createdAt}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {inc.status === 'MOI_TAO' && (
                        <button
                          onClick={() => handleAssignMe(inc)}
                          title="Tiếp nhận xử lý"
                          className="p-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                        >
                          <UserCheck size={14} />
                        </button>
                      )}
                      {(inc.status === 'DA_TIEP_NHAN' || inc.status === 'DANG_SUA') && (
                        <button
                          onClick={() => handleOpenRepair(inc)}
                          title="Sửa chữa & Xuất kho linh kiện"
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        >
                          <Wrench size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(inc.id)}
                        title="Xóa phiếu"
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-[#151922] border-t border-[#272e3d] flex items-center justify-between text-xs text-slate-400">
          <div>{filtered.length} of {incidents.length} incident tickets</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Repair & Deduct Stock */}
      {repairModalOpen && targetIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              Ghi Nhận Sửa Chữa & Xuất Kho [{targetIncident.ticketCode}]
            </h3>

            <div className="p-3 rounded-lg bg-[#272e3d]/60 border border-[#384256] space-y-1">
              <div>Thiết bị: <strong className="text-white">{targetIncident.equipmentCode} ({targetIncident.roomName})</strong></div>
              <div>Hiện tượng lỗi: <span className="text-slate-300">{targetIncident.description}</span></div>
            </div>

            <form onSubmit={handleSaveRepair} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Loại hành động</label>
                <select
                  value={repairForm.actionType}
                  onChange={(e) => setRepairForm({ ...repairForm, actionType: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                >
                  <option value="THAY_THE">Thay thế linh kiện phần cứng (Tự động trừ kho)</option>
                  <option value="SUA_CHUA">Sửa chữa / Cài đặt phần mềm / Vệ sinh</option>
                  <option value="KHAO_SAT">Khảo sát & Kiểm tra chuyên sâu</option>
                </select>
              </div>

              {repairForm.actionType === 'THAY_THE' && (
                <div className="p-3.5 rounded-xl bg-[#232a38] border border-[#384256] space-y-3">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Package size={14} /> Chọn linh kiện xuất kho thay thế:
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="col-span-2">
                      <select
                        value={repairForm.selectedPartId}
                        onChange={(e) => setRepairForm({ ...repairForm, selectedPartId: e.target.value })}
                        className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-2.5 py-2 text-white text-xs"
                      >
                        {availableParts.map((part) => (
                          <option key={part.id} value={part.id}>
                            {part.partName} (Còn: {part.stockQuantity} {part.unit} - {formatCurrency(part.unitPrice)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={repairForm.quantity}
                        onChange={(e) => setRepairForm({ ...repairForm, quantity: Number(e.target.value) })}
                        className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-2.5 py-2 text-white text-center font-bold"
                        title="Số lượng xuất"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ghi chú kết quả sửa chữa</label>
                <textarea
                  rows={2}
                  value={repairForm.note}
                  placeholder="VD: Đã thay thế linh kiện lỗi và test Windows hoạt động tốt"
                  onChange={(e) => setRepairForm({ ...repairForm, note: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <input
                  type="checkbox"
                  id="markCompleteCheck"
                  checked={repairForm.markCompleted}
                  onChange={(e) => setRepairForm({ ...repairForm, markCompleted: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <label htmlFor="markCompleteCheck" className="font-semibold cursor-pointer">
                  Đánh dấu hoàn thành phiếu và khôi phục máy tính về trạng thái "Hoạt Động"
                </label>
              </div>

              <div className="pt-3 border-t border-[#272e3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRepairModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#272e3d] text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Xác Nhận & Trừ Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add New Incident */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              Tạo Mới Phiếu Báo Hỏng Thiết Bị
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã máy tính *</label>
                  <input
                    type="text"
                    required
                    value={createForm.equipmentCode}
                    onChange={(e) => setCreateForm({ ...createForm, equipmentCode: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phòng máy *</label>
                  <select
                    value={createForm.roomName}
                    onChange={(e) => setCreateForm({ ...createForm, roomName: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Phòng A101 (Lập trình Cơ sở)">Phòng A101 (Lập trình Cơ sở)</option>
                    <option value="Phòng A204 (Java & Spring Boot)">Phòng A204 (Java & Spring Boot)</option>
                    <option value="Phòng A302 (Web & Mobile)">Phòng A302 (Web & Mobile)</option>
                    <option value="Phòng A404 (AI & Data Science)">Phòng A404 (AI & Data Science)</option>
                    <option value="Phòng B102 (Mạng Cisco Lab)">Phòng B102 (Mạng Cisco Lab)</option>
                    <option value="Phòng B201 (Quản trị Linux)">Phòng B201 (Quản trị Linux)</option>
                    <option value="Phòng D-06 (Đồ họa 3D)">Phòng D-06 (Đồ họa 3D)</option>
                    <option value="Phòng D5-12 (IoT & Vi điều khiển)">Phòng D5-12 (IoT & Vi điều khiển)</option>
                    <option value="Phòng D5-36 (Cloud DevOps)">Phòng D5-36 (Cloud DevOps)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mức độ ưu tiên</label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                >
                  <option value="THAP">Thấp</option>
                  <option value="TRUNG_BINH">Trung bình</option>
                  <option value="CAO">Cao</option>
                  <option value="KHAN_CAP">Khẩn cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mô tả sự cố chi tiết *</label>
                <textarea
                  required
                  rows={3}
                  value={createForm.description}
                  placeholder="Mô tả hiện tượng hỏng hóc..."
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Người báo *</label>
                <input
                  type="text"
                  required
                  value={createForm.reporterName}
                  onChange={(e) => setCreateForm({ ...createForm, reporterName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#272e3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#272e3d] text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Tạo Phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
