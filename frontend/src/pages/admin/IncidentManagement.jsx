import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Wrench,
  Trash2,
  UserCheck,
  CheckCircle2,
  Package,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      ticketCode: 'SC-2024-001',
      equipmentCode: 'PC-PM01-08',
      equipmentName: 'Máy trạm Dell OptiPlex 7080',
      roomName: 'Phòng Máy 01',
      description: 'Lỗi dump xanh (BSOD WHEA_UNCORRECTABLE), nghi hỏng RAM',
      reporterName: 'Lê Nguyễn Ngọc Duy Anh (SV)',
      technicianName: 'Nguyễn Văn Kỹ Thuật (KTV Trưởng)',
      priority: 'KHAN_CAP',
      status: 'DANG_SUA',
      totalCost: 450000,
      createdAt: '2024-07-23 08:30:15'
    },
    {
      id: 2,
      ticketCode: 'SC-2024-002',
      equipmentCode: 'PC-PM02-03',
      equipmentName: 'Máy trạm HP ProDesk 400',
      roomName: 'Phòng Máy 02',
      description: 'Bật nguồn không lên đèn, quạt nguồn CPU không quay',
      reporterName: 'Thầy Nguyễn Văn Hoàng (GV)',
      technicianName: 'Lê Kỹ Thuật Viên',
      priority: 'CAO',
      status: 'DA_TIEP_NHAN',
      totalCost: 0,
      createdAt: '2024-07-22 14:15:20'
    },
    {
      id: 3,
      ticketCode: 'SC-2024-003',
      equipmentCode: 'PC-PM01-12',
      equipmentName: 'Máy trạm Dell OptiPlex 7080',
      roomName: 'Phòng Máy 01',
      description: 'Liệt phím Enter và Space, chuột quang bị giật con trỏ',
      reporterName: 'Sinh viên CCQ2411E',
      technicianName: null,
      priority: 'TRUNG_BINH',
      status: 'MOI_TAO',
      totalCost: 0,
      createdAt: '2024-07-22 10:45:00'
    },
    {
      id: 4,
      ticketCode: 'SC-2024-004',
      equipmentCode: 'PC-PM01-15',
      equipmentName: 'Máy trạm Dell OptiPlex 7080',
      roomName: 'Phòng Máy 01',
      description: 'Ổ cứng SSD báo lỗi Disk Read Error, đã thay thế SSD mới',
      reporterName: 'Cô Lê Thị Kim Yến',
      technicianName: 'Nguyễn Văn Kỹ Thuật',
      priority: 'CAO',
      status: 'HOAN_THANH',
      totalCost: 850000,
      createdAt: '2024-07-20 09:00:00'
    }
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  // Repair Modal
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [targetIncident, setTargetIncident] = useState(null);
  const [repairForm, setRepairForm] = useState({
    actionType: 'THAY_THE',
    sparePartName: 'RAM Kingston 8GB DDR4 Bus 3200',
    quantity: 1,
    unitPrice: 450000,
    note: '',
    markCompleted: true
  });

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    equipmentCode: 'PC-PM01-05',
    equipmentName: 'Máy trạm Dell OptiPlex 7080',
    roomName: 'Phòng Máy 01',
    description: '',
    priority: 'TRUNG_BINH',
    reporterName: 'Lê Nguyễn Ngọc Duy Anh'
  });

  const filtered = incidents.filter((item) => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchSearch =
      item.ticketCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.equipmentCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchKeyword.toLowerCase());
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

  const handleAssignMe = (inc) => {
    setIncidents(
      incidents.map((i) =>
        i.id === inc.id
          ? { ...i, status: 'DA_TIEP_NHAN', technicianName: 'Nguyễn Văn Kỹ Thuật (KTV Trưởng)' }
          : i
      )
    );
  };

  const handleOpenRepair = (inc) => {
    setTargetIncident(inc);
    setRepairForm({
      actionType: 'THAY_THE',
      sparePartName: 'RAM Kingston 8GB DDR4 Bus 3200',
      quantity: 1,
      unitPrice: 450000,
      note: 'Đã thay thế linh kiện lỗi và kiểm tra thiết bị hoạt động ổn định',
      markCompleted: true
    });
    setRepairModalOpen(true);
  };

  const handleSaveRepair = (e) => {
    e.preventDefault();
    if (!targetIncident) return;
    const addedCost = repairForm.unitPrice * repairForm.quantity;
    setIncidents(
      incidents.map((i) =>
        i.id === targetIncident.id
          ? {
              ...i,
              status: repairForm.markCompleted ? 'HOAN_THANH' : 'DANG_SUA',
              totalCost: (i.totalCost || 0) + addedCost
            }
          : i
      )
    );
    setRepairModalOpen(false);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newInc = {
      id: Date.now(),
      ticketCode: `SC-2024-00${incidents.length + 1}`,
      ...createForm,
      technicianName: null,
      status: 'MOI_TAO',
      totalCost: 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setIncidents([newInc, ...incidents]);
    setCreateModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Xóa phiếu sự cố này?')) {
      setIncidents(incidents.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
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
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-64"
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
            <option value="DA_TIEP_NHAN">Đã tiếp nhận (Assigned)</option>
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
                <th className="py-3 px-3 w-12 text-center">Id</th>
                <th className="py-3 px-3">Ticket Code</th>
                <th className="py-3 px-3">Equipment / Room</th>
                <th className="py-3 px-3">Issue Description</th>
                <th className="py-3 px-3">Reporter</th>
                <th className="py-3 px-3">Technician</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Cost</th>
                <th className="py-3 px-3">Created At</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
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
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Repair & Parts Deduction */}
      {repairModalOpen && targetIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              Ghi Nhận Sửa Chữa & Xuất Kho [{targetIncident.ticketCode}]
            </h3>

            <div className="p-3 rounded-lg bg-[#272e3d]/60 border border-[#384256] space-y-1">
              <div>Thiết bị: <strong className="text-white">{targetIncident.equipmentName} ({targetIncident.roomName})</strong></div>
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
                        value={repairForm.sparePartName}
                        onChange={(e) => setRepairForm({ ...repairForm, sparePartName: e.target.value })}
                        className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="RAM Kingston 8GB DDR4 Bus 3200">RAM Kingston 8GB DDR4 (450.000 đ)</option>
                        <option value="SSD Kingston NVMe 512GB M.2">SSD Kingston NVMe 512GB (850.000 đ)</option>
                        <option value="Nguồn Cooler Master 500W">Nguồn Cooler Master 500W (650.000 đ)</option>
                        <option value="Bàn phím Logitech K120 USB">Bàn phím Logitech K120 (180.000 đ)</option>
                        <option value="Chuột quang Logitech B100">Chuột quang Logitech B100 (110.000 đ)</option>
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
                  className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
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
                    <option value="Phòng Máy 01">Phòng Máy 01 (Web)</option>
                    <option value="Phòng Máy 02">Phòng Máy 02 (Mạng)</option>
                    <option value="Phòng Máy 03">Phòng Máy 03 (Đồ họa)</option>
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
                  <option value="KHAN_CAP">Khẩn cấp (Sập nguồn, khói, cháy)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mô tả hiện tượng sự cố *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả cụ thể hiện tượng: màn hình xanh, máy tính kêu bíp, liệt phím..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
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
                  Gửi Báo Hỏng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
