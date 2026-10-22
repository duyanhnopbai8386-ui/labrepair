import React, { useState, useEffect } from 'react';
import { equipmentApi } from '../../api/equipmentApi';
import { roomApi } from '../../api/roomApi';
import { GlassModal } from '../../components/GlassModal';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Cpu
} from 'lucide-react';

export const EquipmentManagement = ({ onReportIssue }) => {
  const [equipments, setEquipments] = useState([
    {
      id: 1,
      equipmentCode: 'PC-PM01-01',
      equipmentName: 'Máy trạm Dell OptiPlex 7080 SFF',
      categoryName: 'Máy tính để bàn',
      roomName: 'Phòng Máy 01',
      serialNumber: 'SN-DL-7080-01',
      specification: 'Core i7-10700 / 16GB DDR4 / SSD 512GB NVMe / Monitor 24"',
      status: 'HOAT_DONG',
      createdAt: '2024-07-23 12:19:32'
    },
    {
      id: 2,
      equipmentCode: 'PC-PM01-08',
      equipmentName: 'Máy trạm Dell OptiPlex 7080 SFF',
      categoryName: 'Máy tính để bàn',
      roomName: 'Phòng Máy 01',
      serialNumber: 'SN-DL-7080-08',
      specification: 'Core i7-10700 / 16GB DDR4 / SSD 512GB NVMe / Monitor 24"',
      status: 'CHO_SUA',
      createdAt: '2024-07-23 12:14:19'
    },
    {
      id: 3,
      equipmentCode: 'PC-PM01-12',
      equipmentName: 'Máy trạm Dell OptiPlex 7080 SFF',
      categoryName: 'Máy tính để bàn',
      roomName: 'Phòng Máy 01',
      serialNumber: 'SN-DL-7080-12',
      specification: 'Core i7-10700 / 16GB DDR4 / SSD 512GB NVMe / Monitor 24"',
      status: 'DANG_SUA',
      createdAt: '2024-07-22 09:53:57'
    },
    {
      id: 4,
      equipmentCode: 'PC-PM02-03',
      equipmentName: 'Máy trạm HP ProDesk 400 G7',
      categoryName: 'Máy tính để bàn',
      roomName: 'Phòng Máy 02',
      serialNumber: 'SN-HP-400-03',
      specification: 'Core i5-10500 / 16GB RAM / SSD 256GB / Monitor HP 22"',
      status: 'CHO_SUA',
      createdAt: '2024-07-11 16:51:29'
    },
    {
      id: 5,
      equipmentCode: 'SW-PM02-01',
      equipmentName: 'Switch Cisco Catalyst 2960 24-Port',
      categoryName: 'Thiết bị mạng',
      roomName: 'Phòng Máy 02',
      serialNumber: 'SN-CS-2960-01',
      specification: '24 x 10/100/1000 PoE+ Ports, 2 x SFP Uplink',
      status: 'HOAT_DONG',
      createdAt: '2024-07-10 14:20:11'
    },
    {
      id: 6,
      equipmentCode: 'PRJ-PM01-01',
      equipmentName: 'Máy chiếu Epson EB-E01 XGA 3300 Lumens',
      categoryName: 'Thiết bị hiển thị',
      roomName: 'Phòng Máy 01',
      serialNumber: 'SN-EP-E01-99',
      specification: 'Độ sáng 3300 Lumens, HDMI, Tuổi thọ bóng 12,000 giờ',
      status: 'HOAT_DONG',
      createdAt: '2024-06-30 08:30:00'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bulkAction, setBulkAction] = useState('none');

  // Modal Thêm / Sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    equipmentCode: '',
    equipmentName: '',
    roomName: 'Phòng Máy 01',
    categoryName: 'Máy tính để bàn',
    serialNumber: '',
    specification: '',
    status: 'HOAT_DONG'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await equipmentApi.getAll();
      if (res.data && res.data.length > 0) {
        setEquipments(res.data);
      }
    } catch (err) {
      console.warn('API fallback to current data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter
  const filtered = equipments.filter((item) => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchKeyword =
      (item.equipmentCode || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.equipmentName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.roomName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.serialNumber || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchKeyword;
  });

  // Select all checkboxes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk action
  const handleBulkPerform = () => {
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để thao tác!');
      return;
    }
    if (bulkAction === 'delete') {
      if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} thiết bị đã chọn?`)) {
        setEquipments(equipments.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      }
    } else if (bulkAction === 'repair') {
      setEquipments(
        equipments.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: 'CHO_SUA' } : item
        )
      );
      setSelectedIds([]);
    } else if (bulkAction === 'active') {
      setEquipments(
        equipments.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: 'HOAT_DONG' } : item
        )
      );
      setSelectedIds([]);
    }
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      equipmentCode: `PC-PM01-${equipments.length + 1 < 10 ? `0${equipments.length + 1}` : equipments.length + 1}`,
      equipmentName: 'Máy trạm Dell OptiPlex 7080',
      roomName: 'Phòng Máy 01',
      categoryName: 'Máy tính để bàn',
      serialNumber: `SN-DL-${Math.floor(1000 + Math.random() * 9000)}`,
      specification: 'Core i7-10700 / 16GB RAM / SSD 512GB NVMe / LCD 24"',
      status: 'HOAT_DONG'
    });
    setModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      equipmentCode: item.equipmentCode,
      equipmentName: item.equipmentName,
      roomName: item.roomName || 'Phòng Máy 01',
      categoryName: item.categoryName || 'Máy tính để bàn',
      serialNumber: item.serialNumber || '',
      specification: item.specification || '',
      status: item.status || 'HOAT_DONG'
    });
    setModalOpen(true);
  };

  // Save Add/Edit
  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setEquipments(
        equipments.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      setEquipments([newItem, ...equipments]);
    }
    setModalOpen(false);
  };

  // Delete single item
  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiết bị này khỏi cơ sở dữ liệu?')) {
      setEquipments(equipments.filter((item) => item.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HOAT_DONG':
        return <span className="text-emerald-400 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Hoạt động</span>;
      case 'CHO_SUA':
        return <span className="text-amber-400 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Chờ sửa</span>;
      case 'DANG_SUA':
        return <span className="text-sky-400 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Đang sửa</span>;
      default:
        return <span className="text-rose-400 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Bị hỏng</span>;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Title & Add New Button (Exact layout like reference image) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Equipments</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" /> Add New
          </button>
        </div>
        <div className="text-xs text-slate-400">
          E-Commerce / <span className="text-slate-200 font-medium">Equipments</span>
        </div>
      </div>

      {/* Action Bar (Bulk Action + Search + Status Filter) */}
      <div className="bg-[#181d26] p-3.5 rounded-xl border border-[#272e3d] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Bulk Action Left */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="none">Bulk Action</option>
            <option value="active">Đánh dấu: Hoạt động tốt</option>
            <option value="repair">Đánh dấu: Chờ sửa chữa</option>
            <option value="delete">Xóa các mục đã chọn</option>
          </select>
          <button
            onClick={handleBulkPerform}
            className="px-3.5 py-2 rounded-lg bg-[#272e3d] hover:bg-[#323b4e] text-slate-200 text-xs font-semibold border border-[#384256] transition-all"
          >
            Perform
          </button>
        </div>

        {/* Search & Status Filter Right */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">Search:</span>
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Keyword..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-full sm:w-auto"
            >
              <option value="ALL">All</option>
              <option value="HOAT_DONG">Hoạt động (Active)</option>
              <option value="CHO_SUA">Chờ sửa (Pending)</option>
              <option value="DANG_SUA">Đang sửa (Repairing)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table (Exact Columns & Dark styling like reference image) */}
      <div className="bg-[#181d26] rounded-xl border border-[#272e3d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151922] border-b border-[#272e3d] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                    className="rounded bg-[#272e3d] border-[#384256] text-sky-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">Id</th>
                <th className="py-3 px-3 w-14 text-center">Icon</th>
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Display Name</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Created At</th>
                <th className="py-3 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b38]">
              {filtered.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#1f2633] transition-colors ${
                      isSelected ? 'bg-[#1e2738]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded bg-[#272e3d] border-[#384256] text-sky-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-400 font-mono font-bold">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="w-8 h-8 rounded-lg bg-[#272e3d] flex items-center justify-center text-sky-400 mx-auto">
                        <Monitor size={16} />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-sky-400">
                      {item.equipmentCode}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-sky-300 hover:underline cursor-pointer">
                        {item.equipmentName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs mt-0.5">
                        {item.specification}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-300">
                      {item.roomName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {item.categoryName}
                    </td>
                    <td className="py-3.5 px-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Chỉnh sửa thiết bị"
                          className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Xóa thiết bị"
                          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Không tìm thấy thiết bị nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination (Exact like reference image) */}
        <div className="p-3.5 bg-[#151922] border-t border-[#272e3d] flex items-center justify-between text-xs text-slate-400">
          <div>
            {filtered.length} of {equipments.length} equipments
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#272e3d] hover:bg-[#323b4e] text-slate-300 font-semibold transition-all">
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#272e3d] hover:bg-[#323b4e] text-slate-300 font-semibold transition-all">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Equipment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              {editingItem ? `Chỉnh sửa Thiết bị [${editingItem.equipmentCode}]` : 'Thêm Thiết Bị Mới Vào CSDL'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã thiết bị (Code) *</label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentCode}
                    onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số Serial</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên thiết bị (Display Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.equipmentName}
                  onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phòng máy</label>
                  <select
                    value={formData.roomName}
                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Phòng Máy 01">Phòng Máy 01 (Web)</option>
                    <option value="Phòng Máy 02">Phòng Máy 02 (Mạng)</option>
                    <option value="Phòng Máy 03">Phòng Máy 03 (Đồ họa)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="HOAT_DONG">Hoạt động tốt</option>
                    <option value="CHO_SUA">Chờ sửa chữa</option>
                    <option value="DANG_SUA">Đang sửa chữa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cấu hình kỹ thuật / Chi tiết phần cứng</label>
                <textarea
                  rows={2}
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-[#272e3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#272e3d] hover:bg-[#323b4e] text-slate-300 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/30"
                >
                  Lưu Thiết Bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
