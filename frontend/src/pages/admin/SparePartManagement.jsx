import React, { useState, useEffect } from 'react';
import { sparePartApi } from '../../api/sparePartApi';
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const STORAGE_KEY = 'labrepair_spare_parts_v2';

const DEFAULT_PARTS = [
  {
    id: 1,
    partCode: 'RAM-DDR4-8G',
    partName: 'RAM Kingston Fury 8GB DDR4 Bus 3200',
    category: 'Bộ nhớ RAM',
    unitPrice: 450000,
    stockQuantity: 12,
    minStockLevel: 5,
    unit: 'Thanh',
    createdAt: '2024-07-23 12:19:32'
  },
  {
    id: 2,
    partCode: 'RAM-DDR4-16G',
    partName: 'RAM Kingston Fury 16GB DDR4 Bus 3200',
    category: 'Bộ nhớ RAM',
    unitPrice: 850000,
    stockQuantity: 8,
    minStockLevel: 3,
    unit: 'Thanh',
    createdAt: '2024-07-23 12:14:19'
  },
  {
    id: 3,
    partCode: 'SSD-512G-M2',
    partName: 'SSD Kingston NV2 512GB M.2 NVMe PCIe',
    category: 'Ổ cứng SSD',
    unitPrice: 850000,
    stockQuantity: 2,
    minStockLevel: 5,
    unit: 'Chiếc',
    createdAt: '2024-07-22 09:53:57'
  },
  {
    id: 4,
    partCode: 'PSU-500W-AER',
    partName: 'Nguồn máy tính Cooler Master Elite V4 500W',
    category: 'Nguồn máy tính (PSU)',
    unitPrice: 650000,
    stockQuantity: 1,
    minStockLevel: 4,
    unit: 'Bộ',
    createdAt: '2024-07-11 16:51:29'
  },
  {
    id: 5,
    partCode: 'KB-LOGI-K120',
    partName: 'Bàn phím có dây Logitech K120 USB',
    category: 'Phím & Chuột',
    unitPrice: 180000,
    stockQuantity: 25,
    minStockLevel: 10,
    unit: 'Chiếc',
    createdAt: '2024-07-10 11:20:00'
  },
  {
    id: 6,
    partCode: 'MS-LOGI-B100',
    partName: 'Chuột quang Logitech B100 USB 800DPI',
    category: 'Phím & Chuột',
    unitPrice: 110000,
    stockQuantity: 30,
    minStockLevel: 10,
    unit: 'Chiếc',
    createdAt: '2024-07-10 11:25:00'
  }
];

export const SparePartManagement = () => {
  const [parts, setParts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize IDs if any was Date.now()
          return parsed.map((item, idx) => ({
            ...item,
            id: Number(item.id) > 100000 ? idx + 1 : Number(item.id) || idx + 1
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return DEFAULT_PARTS;
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restock Modal
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [targetPart, setTargetPart] = useState(null);
  const [restockAmount, setRestockAmount] = useState(5);

  // Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    partCode: '',
    partName: '',
    category: 'Bộ nhớ RAM',
    unitPrice: 300000,
    stockQuantity: 10,
    minStockLevel: 5,
    unit: 'Chiếc'
  });

  // Save to localStorage whenever parts state changes
  const saveParts = (newParts) => {
    setParts(newParts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newParts));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  // Sync with Backend API if available
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await sparePartApi.getAll();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          saveParts(res.data);
        }
      } catch (err) {
        // Fallback to local storage
      }
    };
    fetchApi();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const filtered = parts.filter((p) => {
    const matchSearch =
      (p.partCode || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (p.partName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchKeyword.toLowerCase());
    const matchLow = filterLowStockOnly ? p.stockQuantity <= p.minStockLevel : true;
    return matchSearch && matchLow;
  });

  // Calculate clean, neat incremental ID (1, 2, 3, 4, 5, 6, 7...)
  const getNextCleanId = () => {
    if (!parts || parts.length === 0) return 1;
    const maxId = Math.max(...parts.map(p => Number(p.id) || 0));
    return maxId + 1;
  };

  const handleOpenAdd = () => {
    setEditingPart(null);
    const nextNum = getNextCleanId();
    setFormData({
      partCode: `PART-NEW-0${nextNum}`,
      partName: '',
      category: 'Bộ nhớ RAM',
      unitPrice: 250000,
      stockQuantity: 10,
      minStockLevel: 5,
      unit: 'Chiếc'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPart(p);
    setFormData({
      partCode: p.partCode,
      partName: p.partName,
      category: p.category,
      unitPrice: p.unitPrice,
      stockQuantity: p.stockQuantity,
      minStockLevel: p.minStockLevel,
      unit: p.unit || 'Chiếc'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingPart) {
      // SỬA LINH KIỆN
      const updated = parts.map((p) =>
        p.id === editingPart.id ? { ...p, ...formData } : p
      );
      saveParts(updated);

      try {
        await sparePartApi.update(editingPart.id, formData);
      } catch (err) {}
    } else {
      // THÊM LINH KIỆN MỚI
      const cleanId = getNextCleanId();
      const newItem = {
        id: cleanId, // ID chuẩn: 7, 8, 9... KHÔNG dùng Date.now()
        ...formData,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      const updated = [...parts, newItem];
      saveParts(updated);

      try {
        await sparePartApi.create(newItem);
      } catch (err) {}
    }
    setModalOpen(false);
  };

  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    if (!targetPart) return;
    const newStock = targetPart.stockQuantity + Number(restockAmount);
    const updated = parts.map((p) =>
      p.id === targetPart.id ? { ...p, stockQuantity: newStock } : p
    );
    saveParts(updated);

    try {
      await sparePartApi.update(targetPart.id, { ...targetPart, stockQuantity: newStock });
    } catch (err) {}

    setRestockModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa linh kiện này khỏi cơ sở dữ liệu?')) {
      const updated = parts.filter((p) => p.id !== id);
      saveParts(updated);

      try {
        await sparePartApi.delete(id);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Spare Parts</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" /> Add New
          </button>
        </div>
        <div className="text-xs text-slate-400">
          Inventory / <span className="text-slate-200 font-medium">Spare Parts</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#181d26] p-3.5 rounded-xl border border-[#272e3d] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Search:</span>
          <input
            type="text"
            placeholder="Tìm theo tên linh kiện, mã part..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterLowStockOnly
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-[#272e3d] text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle size={14} /> Xem vật tư sắp hết kho
          </button>
          <span className="text-xs text-slate-400">
            Tổng cộng: <strong className="text-white">{filtered.length}</strong> mặt hàng
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181d26] rounded-xl border border-[#272e3d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151922] border-b border-[#272e3d] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">ID</th>
                <th className="py-3 px-3">PART CODE</th>
                <th className="py-3 px-3">PART NAME</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-right">PRICE</th>
                <th className="py-3 px-3 text-center">REMAIN / STOCK</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">CREATED AT</th>
                <th className="py-3 px-4 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b38]">
              {filtered.map((item) => {
                const isLow = item.stockQuantity <= item.minStockLevel;
                return (
                  <tr key={item.id} className="hover:bg-[#1f2633] transition-colors">
                    <td className="py-3.5 px-3 text-center text-slate-400 font-mono font-bold">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-sky-400">
                      {item.partCode}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white max-w-xs">
                      {item.partName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded font-bold ${
                        isLow ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-200'
                      }`}>
                        {item.stockQuantity} {item.unit}
                      </span>
                      <div className="text-[10px] text-slate-500">Min: {item.minStockLevel}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {isLow ? (
                        <span className="text-rose-400 font-bold flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Sắp hết
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Còn hàng
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setTargetPart(item);
                            setRestockAmount(5);
                            setRestockModalOpen(true);
                          }}
                          title="Nhập thêm kho"
                          className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[11px] font-bold"
                        >
                          + Nhập
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Chỉnh sửa linh kiện"
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Xóa linh kiện"
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-[#151922] border-t border-[#272e3d] flex items-center justify-between text-xs text-slate-400">
          <div>{filtered.length} of {parts.length} spare parts</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Quick Restock */}
      {restockModalOpen && targetPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 text-slate-200 text-xs">
            <h3 className="text-base font-bold text-white border-b border-[#272e3d] pb-2">
              Nhập Kho Linh Kiện [{targetPart.partCode}]
            </h3>
            <div className="text-slate-300">{targetPart.partName}</div>
            <div className="text-slate-400">Tồn kho hiện tại: <strong className="text-white">{targetPart.stockQuantity} {targetPart.unit}</strong></div>

            <form onSubmit={handleConfirmRestock} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Số lượng nhập thêm ({targetPart.unit})</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-bold text-center text-sm"
                />
              </div>

              <div className="pt-2 border-t border-[#272e3d] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Xác Nhận Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              {editingPart ? `Sửa Linh Kiện [${editingPart.partCode}]` : 'Thêm Linh Kiện Mới Vào Kho'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã linh kiện (Code) *</label>
                  <input
                    type="text"
                    required
                    value={formData.partCode}
                    onChange={(e) => setFormData({ ...formData, partCode: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Bộ nhớ RAM">Bộ nhớ RAM</option>
                    <option value="Ổ cứng SSD">Ổ cứng SSD</option>
                    <option value="Nguồn máy tính (PSU)">Nguồn máy tính (PSU)</option>
                    <option value="Phím & Chuột">Phím & Chuột</option>
                    <option value="Màn hình">Màn hình</option>
                    <option value="Tản nhiệt & Phụ kiện">Tản nhiệt & Phụ kiện</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên linh kiện *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: RAM Kingston Fury 16GB DDR4..."
                  value={formData.partName}
                  onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Đơn giá (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mức tồn tối thiểu</label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#272e3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#272e3d] text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Lưu Linh Kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
