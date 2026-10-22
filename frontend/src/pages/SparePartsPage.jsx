import React, { useState, useEffect } from 'react';
import { sparePartApi } from '../api/sparePartApi';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { GlassModal } from '../components/GlassModal';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Boxes,
  TrendingDown,
  DollarSign,
  ArrowUpDown,
  CheckCircle2,
  Cpu,
  Layers,
  Edit,
  RefreshCw
} from 'lucide-react';

export const SparePartsPage = () => {
  const { isAdmin, isTechnician } = useAuth();

  const [parts, setParts] = useState([
    {
      id: 1,
      partCode: 'RAM-DDR4-8G',
      partName: 'RAM Kingston Fury 8GB DDR4 Bus 3200',
      category: 'Bộ nhớ RAM',
      specification: 'DDR4 3200MHz, CL16, Điện áp 1.35V',
      unitPrice: 450000,
      stockQuantity: 12,
      minStockLevel: 5,
      unit: 'Thanh',
    },
    {
      id: 2,
      partCode: 'RAM-DDR4-16G',
      partName: 'RAM Kingston Fury 16GB DDR4 Bus 3200',
      category: 'Bộ nhớ RAM',
      specification: 'DDR4 3200MHz, CL16, Tản nhiệt nhôm',
      unitPrice: 850000,
      stockQuantity: 8,
      minStockLevel: 3,
      unit: 'Thanh',
    },
    {
      id: 3,
      partCode: 'SSD-512G-M2',
      partName: 'SSD Kingston NV2 512GB M.2 NVMe PCIe 4.0',
      category: 'Ổ cứng SSD',
      specification: 'Đọc 3500MB/s, Ghi 2100MB/s, Chuẩn 2280',
      unitPrice: 850000,
      stockQuantity: 2,
      minStockLevel: 5,
      unit: 'Chiếc',
    },
    {
      id: 4,
      partCode: 'PSU-500W-AER',
      partName: 'Bộ Nguồn Cooler Master Elite V4 500W',
      category: 'Nguồn máy tính (PSU)',
      specification: 'Công suất thực 500W, Quạt làm mát 120mm siêu êm',
      unitPrice: 650000,
      stockQuantity: 1,
      minStockLevel: 4,
      unit: 'Bộ',
    },
    {
      id: 5,
      partCode: 'KB-LOGI-K120',
      partName: 'Bàn phím có dây Logitech K120 USB Chống nước',
      category: 'Phím & Chuột',
      specification: 'Cổng USB, Phím khắc laser chống mờ phím',
      unitPrice: 180000,
      stockQuantity: 25,
      minStockLevel: 10,
      unit: 'Chiếc',
    },
    {
      id: 6,
      partCode: 'MS-LOGI-B100',
      partName: 'Chuột quang có dây Logitech B100 USB 800DPI',
      category: 'Phím & Chuột',
      specification: 'Cảm biến quang học chính xác, dây dài 1.8m',
      unitPrice: 110000,
      stockQuantity: 30,
      minStockLevel: 10,
      unit: 'Chiếc',
    },
    {
      id: 7,
      partCode: 'FAN-CPU-INTEL',
      partName: 'Quạt tản nhiệt CPU Intel LGA 1200 / 1700',
      category: 'Tản nhiệt & Phụ kiện',
      specification: 'Lõi đồng tản nhiệt nhanh, 4 pin PWM tự điều tốc',
      unitPrice: 95000,
      stockQuantity: 15,
      minStockLevel: 5,
      unit: 'Cái',
    },
    {
      id: 8,
      partCode: 'CAB-CAT6-3M',
      partName: 'Dây cáp mạng đúc sẵn Dintek Cat6 UTP 3m',
      category: 'Cáp kết nối',
      specification: 'Đầu bấm RJ45 mạ vàng 50U, truyền tải 1Gbps',
      unitPrice: 45000,
      stockQuantity: 40,
      minStockLevel: 15,
      unit: 'Sợi',
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modal Thêm linh kiện mới
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPart, setNewPart] = useState({
    partCode: '',
    partName: '',
    category: 'Bộ nhớ RAM',
    specification: '',
    unitPrice: 200000,
    stockQuantity: 10,
    minStockLevel: 5,
    unit: 'Chiếc',
  });

  // Modal Nhập thêm hàng (Quick Restock)
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [targetPart, setTargetPart] = useState(null);
  const [restockAmount, setRestockAmount] = useState(5);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await sparePartApi.getAll();
      if (res.data && res.data.length > 0) {
        setParts(res.data);
      }
    } catch (err) {
      console.warn('Spare parts load fallback to mock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // Calculations
  const totalItems = parts.length;
  const lowStockCount = parts.filter(p => p.stockQuantity <= p.minStockLevel).length;
  const totalStockValue = parts.reduce((acc, p) => acc + ((p.stockQuantity || 0) * (p.unitPrice || 0)), 0);

  // Filter
  const filteredParts = parts.filter(p => {
    const matchSearch = p.partCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLow = onlyLowStock ? p.stockQuantity <= p.minStockLevel : true;
    return matchSearch && matchLow;
  });

  const handleCreatePart = async (e) => {
    e.preventDefault();
    try {
      await sparePartApi.create(newPart);
    } catch (err) {}

    const created = {
      ...newPart,
      id: Date.now(),
    };
    setParts([...parts, created]);
    setAddModalOpen(false);
    setNewPart({
      partCode: '',
      partName: '',
      category: 'Bộ nhớ RAM',
      specification: '',
      unitPrice: 200000,
      stockQuantity: 10,
      minStockLevel: 5,
      unit: 'Chiếc',
    });
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!targetPart) return;

    const newStock = targetPart.stockQuantity + Number(restockAmount);

    try {
      await sparePartApi.update(targetPart.id, {
        ...targetPart,
        stockQuantity: newStock
      });
    } catch (err) {}

    setParts(parts.map(p => {
      if (p.id === targetPart.id) {
        return { ...p, stockQuantity: newStock };
      }
      return p;
    }));

    setRestockModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Package className="text-sky-600" size={28} />
            Quản Lý Kho Linh Kiện & Vật Tư Sửa Chữa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi số lượng tồn kho theo thời gian thực, tự động trừ khi kỹ thuật viên thay thế và cảnh báo khi sắp cạn
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 shrink-0"
          >
            <Plus size={18} className="stroke-[2.5]" />
            Thêm linh kiện mới
          </button>
        )}
      </div>

      {/* 3 Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-3xl ios-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Tổng mặt hàng</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Boxes size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {totalItems}
            <span className="text-sm font-normal text-slate-400 ml-1">loại vật tư</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Sẵn sàng cấp phát thay thế</div>
        </div>

        <div
          onClick={() => setOnlyLowStock(!onlyLowStock)}
          className={`glass-panel p-5 rounded-3xl ios-card-hover cursor-pointer border transition-all ${
            onlyLowStock ? 'ring-2 ring-rose-400 bg-rose-50/40' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-600">Cảnh báo sắp hết</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
            {lowStockCount}
            <span className="text-sm font-normal text-rose-400 ml-1">mặt hàng</span>
          </div>
          <div className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
            <span>{onlyLowStock ? 'Đang lọc xem riêng' : 'Bấm để lọc xem riêng'}</span>
            &rarr;
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl ios-card-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-600">Tổng giá trị tồn kho</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {formatCurrency(totalStockValue)}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Ngân sách dự phòng phòng máy</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên linh kiện, mã part, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {onlyLowStock && (
            <button
              onClick={() => setOnlyLowStock(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
            >
              Hủy lọc sắp hết
            </button>
          )}
          <span className="text-xs text-slate-400">Hiển thị {filteredParts.length} linh kiện</span>
        </div>
      </div>

      {/* Spare Parts Inventory Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Mã linh kiện</th>
                <th className="pb-3">Tên & Mô tả</th>
                <th className="pb-3">Phân loại</th>
                <th className="pb-3 text-right">Đơn giá</th>
                <th className="pb-3 text-center">Tồn kho</th>
                <th className="pb-3 text-center">Trạng thái</th>
                <th className="pb-3 text-right pr-2">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {filteredParts.map((part) => {
                const isLow = part.stockQuantity <= part.minStockLevel;

                return (
                  <tr key={part.id} className="hover:bg-sky-50/40 transition-colors group">
                    <td className="py-4 pl-2 font-mono text-xs font-bold text-sky-600">
                      {part.partCode}
                    </td>
                    <td className="py-4 max-w-xs">
                      <div className="font-semibold text-slate-800">{part.partName}</div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{part.specification}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium">
                        {part.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-700">
                      {formatCurrency(part.unitPrice)}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-xl font-bold text-xs ${
                        isLow
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {part.stockQuantity} {part.unit || 'cái'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Tối thiểu: {part.minStockLevel}</div>
                    </td>
                    <td className="py-4 text-center">
                      {isLow ? (
                        <StatusBadge status="SAP_HET" />
                      ) : (
                        <StatusBadge status="CON_HANG" />
                      )}
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => {
                          setTargetPart(part);
                          setRestockAmount(5);
                          setRestockModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200/50 transition-all active:scale-95"
                      >
                        + Nhập kho
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nhập Thêm Kho (Quick Restock) */}
      <GlassModal
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        title={targetPart ? `Nhập kho: ${targetPart.partName}` : 'Nhập kho'}
        maxWidth="max-w-md"
      >
        {targetPart && (
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div>Mã: <strong className="font-mono text-sky-600">{targetPart.partCode}</strong></div>
              <div>Hiện có trong kho: <strong>{targetPart.stockQuantity} {targetPart.unit || 'cái'}</strong></div>
              <div>Đơn giá nhập tham khảo: <strong>{formatCurrency(targetPart.unitPrice)}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Số lượng nhập thêm vào kho ({targetPart.unit || 'cái'}) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-bold text-center bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              >
                Xác nhận nhập kho
              </button>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Modal: Thêm Linh Kiện Mới (Admin) */}
      <GlassModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Thêm Mã Linh Kiện Mới Vào Hệ Thống"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePart} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mã linh kiện *</label>
              <input
                type="text"
                required
                placeholder="VD: RAM-DDR5-16G"
                value={newPart.partCode}
                onChange={(e) => setNewPart({ ...newPart, partCode: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phân loại *</label>
              <select
                value={newPart.category}
                onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Bộ nhớ RAM">Bộ nhớ RAM</option>
                <option value="Ổ cứng SSD">Ổ cứng SSD</option>
                <option value="Nguồn máy tính (PSU)">Nguồn máy tính (PSU)</option>
                <option value="Phím & Chuột">Phím & Chuột</option>
                <option value="Màn hình">Màn hình</option>
                <option value="Tản nhiệt & Phụ kiện">Tản nhiệt & Phụ kiện</option>
                <option value="Cáp kết nối">Cáp kết nối</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên linh kiện đầy đủ *</label>
            <input
              type="text"
              required
              placeholder="VD: RAM Kingston Fury 16GB DDR5 Bus 5600"
              value={newPart.partName}
              onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Thông số kỹ thuật</label>
            <textarea
              rows={2}
              placeholder="VD: DDR5 Bus 5600MHz, CL36, tản nhiệt nhôm đen..."
              value={newPart.specification}
              onChange={(e) => setNewPart({ ...newPart, specification: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đơn giá (VNĐ)</label>
              <input
                type="number"
                value={newPart.unitPrice}
                onChange={(e) => setNewPart({ ...newPart, unitPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số lượng tồn</label>
              <input
                type="number"
                value={newPart.stockQuantity}
                onChange={(e) => setNewPart({ ...newPart, stockQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mức tối thiểu</label>
              <input
                type="number"
                value={newPart.minStockLevel}
                onChange={(e) => setNewPart({ ...newPart, minStockLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              Lưu linh kiện
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
