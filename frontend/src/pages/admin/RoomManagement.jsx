import React, { useState, useEffect } from 'react';
import { roomApi } from '../../api/roomApi';
import {
  Plus,
  Search,
  Building,
  Edit2,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'labrepair_rooms_v2';

const DEFAULT_ROOMS = [
  {
    id: 1,
    roomCode: 'A101',
    roomName: 'Phòng máy thực hành A101 (Lập trình Cơ sở)',
    location: 'Khu A Tầng 1 - HITC',
    capacity: 40,
    activeComputers: 38,
    brokenComputers: 2,
    managerName: 'ThS. Nguyễn Minh Tuấn',
    contactPhone: '0908.123.456',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 3,
    roomCode: 'A204',
    roomName: 'Phòng máy thực hành A204 (Lập trình Java & Spring Boot)',
    location: 'Khu A Tầng 2 - HITC',
    capacity: 40,
    activeComputers: 39,
    brokenComputers: 1,
    managerName: 'ThS. Nguyễn Minh Tuấn',
    contactPhone: '0908.123.456',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 4,
    roomCode: 'A302',
    roomName: 'Phòng máy thực hành A302 (Web & Mobile App)',
    location: 'Khu A Tầng 3 - HITC',
    capacity: 35,
    activeComputers: 35,
    brokenComputers: 0,
    managerName: 'Cô Lê Thị Kim Yến',
    contactPhone: '0912.888.999',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 5,
    roomCode: 'A404',
    roomName: 'Phòng máy thực hành A404 (Trí tuệ nhân tạo & Data Science)',
    location: 'Khu A Tầng 4 - HITC',
    capacity: 30,
    activeComputers: 30,
    brokenComputers: 0,
    managerName: 'ThS. Trần Quang Minh',
    contactPhone: '0933.555.777',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 6,
    roomCode: 'B102',
    roomName: 'Phòng máy thực hành B102 (Mạng máy tính Cisco Lab)',
    location: 'Khu B Tầng 1 - HITC',
    capacity: 35,
    activeComputers: 34,
    brokenComputers: 1,
    managerName: 'Thầy Nguyễn Văn Hoàng',
    contactPhone: '0912.333.444',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 7,
    roomCode: 'B201',
    roomName: 'Phòng máy thực hành B201 (An toàn thông tin & Quản trị Linux)',
    location: 'Khu B Tầng 2 - HITC',
    capacity: 30,
    activeComputers: 30,
    brokenComputers: 0,
    managerName: 'Thầy Nguyễn Văn Hoàng',
    contactPhone: '0912.333.444',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 8,
    roomCode: 'D-06',
    roomName: 'Phòng máy thực hành D-06 (Đồ họa & Thiết kế 3D)',
    location: 'Khu D Tầng Trệt - HITC',
    capacity: 35,
    activeComputers: 34,
    brokenComputers: 1,
    managerName: 'KTV Nguyễn Văn Trực',
    contactPhone: '0912.345.678',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 9,
    roomCode: 'D5-12',
    roomName: 'Phòng máy thực hành D5-12 (IoT & Lập trình vi điều khiển)',
    location: 'Khu D Tầng 5 - HITC',
    capacity: 30,
    activeComputers: 30,
    brokenComputers: 0,
    managerName: 'KTV Nguyễn Văn Trực',
    contactPhone: '0912.345.678',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 10,
    roomCode: 'D5-36',
    roomName: 'Phòng máy thực hành D5-36 (Cloud Computing & DevOps)',
    location: 'Khu D Tầng 5 - HITC',
    capacity: 30,
    activeComputers: 30,
    brokenComputers: 0,
    managerName: 'KTV Nguyễn Văn Trực',
    contactPhone: '0912.345.678',
    status: 'HOAT_DONG',
    createdAt: '2026-11-06 08:00:00'
  }
];

export const RoomManagement = () => {
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMojibake = parsed.some(r => (r.roomName || '').includes('?') || (r.roomName || '').includes('Ã'));
          if (!hasMojibake) {
            return parsed.map((item, idx) => ({
              ...item,
              id: Number(item.id) || idx + 1
            }));
          }
        }
      }
    } catch (e) {}
    return DEFAULT_ROOMS;
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomCode: '',
    roomName: '',
    location: '',
    capacity: 40,
    managerName: '',
    contactPhone: '',
    status: 'HOAT_DONG'
  });

  const saveRooms = (newList) => {
    setRooms(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {}
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await roomApi.getAll();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(r => ({
            id: r.id,
            roomCode: r.roomCode,
            roomName: r.roomName,
            location: r.location,
            capacity: r.capacity || 40,
            activeComputers: Math.max(0, (r.capacity || 40) - 1),
            brokenComputers: 1,
            managerName: r.manager?.fullName || 'ThS. Nguyễn Minh Tuấn',
            contactPhone: '0908.123.456',
            status: r.isActive !== false ? 'HOAT_DONG' : 'TAM_DUNG',
            createdAt: (r.createdAt || '').slice(0, 19).replace('T', ' ') || '2026-11-06'
          }));
          saveRooms(mapped);
        }
      } catch (err) {}
    };
    fetchApi();
  }, []);

  const getNextCleanId = () => {
    if (!rooms || rooms.length === 0) return 1;
    const maxId = Math.max(...rooms.map(r => Number(r.id) || 0));
    return maxId + 1;
  };

  const filtered = rooms.filter(
    (r) =>
      (r.roomCode || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (r.roomName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (r.location || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (r.managerName || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomCode: '',
      roomName: '',
      location: 'Khu A Tầng 1 - HITC',
      capacity: 35,
      managerName: 'ThS. Nguyễn Minh Tuấn',
      contactPhone: '0908.123.456',
      status: 'HOAT_DONG'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomCode: room.roomCode,
      roomName: room.roomName,
      location: room.location,
      capacity: room.capacity,
      managerName: room.managerName,
      contactPhone: room.contactPhone,
      status: room.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRoom) {
      const updated = rooms.map((r) =>
        r.id === editingRoom.id ? { ...r, ...formData } : r
      );
      saveRooms(updated);

      try {
        await roomApi.update(editingRoom.id, formData);
      } catch (err) {}
    } else {
      const cleanId = getNextCleanId();
      const newRoom = {
        id: cleanId,
        ...formData,
        activeComputers: formData.capacity,
        brokenComputers: 0,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      const updated = [...rooms, newRoom];
      saveRooms(updated);

      try {
        await roomApi.create(newRoom);
      } catch (err) {}
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Xóa phòng máy này sẽ ảnh hưởng đến các thiết bị bên trong, bạn có chắc chắn?')) {
      const updated = rooms.filter((r) => r.id !== id);
      saveRooms(updated);

      try {
        await roomApi.delete(id);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Computer Rooms</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" /> Add New
          </button>
        </div>
        <div className="text-xs text-slate-400">
          Management / <span className="text-slate-200 font-medium">Computer Rooms</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#181d26] p-3.5 rounded-xl border border-[#272e3d] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Search:</span>
          <input
            type="text"
            placeholder="Tìm theo mã phòng, tên, vị trí..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-72"
          />
        </div>
        <div className="text-xs text-slate-400">
          Đang hiển thị <strong className="text-white">{filtered.length}</strong> phòng máy thực hành
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181d26] rounded-xl border border-[#272e3d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151922] border-b border-[#272e3d] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">ID</th>
                <th className="py-3 px-3">ROOM CODE</th>
                <th className="py-3 px-3">ROOM NAME</th>
                <th className="py-3 px-3">LOCATION</th>
                <th className="py-3 px-3 text-center">CAPACITY</th>
                <th className="py-3 px-3 text-center">HEALTH RATIO</th>
                <th className="py-3 px-3">MANAGER</th>
                <th className="py-3 px-3">CREATED AT</th>
                <th className="py-3 px-4 text-center w-24">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b38]">
              {filtered.map((room) => (
                <tr key={room.id} className="hover:bg-[#1f2633] transition-colors">
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono font-bold">
                    {room.id}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-sky-400">
                    {room.roomCode}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white">
                    {room.roomName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-sky-500" />
                    {room.location}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-200">
                    {room.capacity} máy
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-emerald-400 font-bold">{room.activeComputers || room.capacity}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-rose-400 font-bold">{room.brokenComputers || 0}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {room.managerName}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {room.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        title="Xóa phòng"
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
          <div>{filtered.length} of {rooms.length} phòng máy</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Room */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              {editingRoom ? `Chỉnh Sửa Phòng Máy [${editingRoom.roomCode}]` : 'Thêm Phòng Máy Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã phòng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: A101, B102, D-06..."
                    value={formData.roomCode}
                    onChange={(e) => setFormData({ ...formData, roomCode: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sức chứa (Số máy)</label>
                  <input
                    type="number"
                    min="10"
                    max="80"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên phòng máy *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng máy thực hành A101 (Lập trình Cơ sở)"
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vị trí phòng (Tòa nhà / Tầng) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khu A Tầng 1 - HITC"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Giảng viên / KTV quản lý</label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                  {editingRoom ? 'Lưu Thay Đổi' : 'Tạo Phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
