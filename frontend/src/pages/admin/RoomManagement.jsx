import React, { useState, useEffect } from 'react';
import { roomApi } from '../../api/roomApi';
import {
  Plus,
  Search,
  Building,
  Edit2,
  Trash2,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';

export const RoomManagement = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomCode: 'PM01',
      roomName: 'Phòng Máy 01 (Thực hành Web & App)',
      location: 'Tầng 3 - Tòa Nhà A (HITC)',
      capacity: 40,
      activeComputers: 37,
      brokenComputers: 3,
      managerName: 'Thầy Trần Quang Minh',
      contactPhone: '0908.123.456',
      status: 'HOAT_DONG',
      createdAt: '2024-06-15 09:00:00'
    },
    {
      id: 2,
      roomCode: 'PM02',
      roomName: 'Phòng Máy 02 (Mạng Máy Tính & An Ninh)',
      location: 'Tầng 3 - Tòa Nhà B (HITC)',
      capacity: 35,
      activeComputers: 34,
      brokenComputers: 1,
      managerName: 'Cô Lê Thị Kim Yến',
      contactPhone: '0912.888.999',
      status: 'HOAT_DONG',
      createdAt: '2024-06-15 09:30:00'
    },
    {
      id: 3,
      roomCode: 'PM03',
      roomName: 'Phòng Máy 03 (Đồ Họa & Đa Phương Tiện)',
      location: 'Tầng 4 - Tòa Nhà A (HITC)',
      capacity: 30,
      activeComputers: 30,
      brokenComputers: 0,
      managerName: 'Thầy Nguyễn Văn Hoàng',
      contactPhone: '0933.555.777',
      status: 'HOAT_DONG',
      createdAt: '2024-06-20 14:15:00'
    }
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
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

  const filtered = rooms.filter(
    (r) =>
      r.roomCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.roomName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.managerName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomCode: `PM0${rooms.length + 1}`,
      roomName: `Phòng Máy 0${rooms.length + 1}`,
      location: 'Tầng 4 - Tòa Nhà B (HITC)',
      capacity: 35,
      managerName: 'Giảng viên Phụ trách',
      contactPhone: '0909.111.222',
      status: 'HOAT_DONG'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({ ...room });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...r, ...formData } : r)));
    } else {
      setRooms([
        ...rooms,
        {
          id: Date.now(),
          ...formData,
          activeComputers: formData.capacity,
          brokenComputers: 0,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        }
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Xóa phòng máy này sẽ ảnh hưởng đến các thiết bị bên trong, bạn có chắc chắn?')) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Title & Add New */}
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
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-64"
          />
        </div>
        <div className="text-xs text-slate-400">
          Đang hiển thị <strong>{filtered.length}</strong> phòng máy thực hành
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181d26] rounded-xl border border-[#272e3d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#151922] border-b border-[#272e3d] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">Id</th>
                <th className="py-3 px-3">Room Code</th>
                <th className="py-3 px-3">Room Name</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Capacity</th>
                <th className="py-3 px-3 text-center">Health Ratio</th>
                <th className="py-3 px-3">Manager</th>
                <th className="py-3 px-3">Created At</th>
                <th className="py-3 px-4 text-center w-24">Actions</th>
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
                    <span className="text-emerald-400 font-bold">{room.activeComputers || room.capacity} tốt</span>
                    {room.brokenComputers > 0 && (
                      <span className="text-rose-400 font-bold ml-1.5">({room.brokenComputers} hỏng)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    <div>{room.managerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{room.contactPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {room.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        title="Sửa phòng máy"
                        className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        title="Xóa phòng máy"
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
          <div>{filtered.length} of {rooms.length} rooms</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              {editingRoom ? `Cập nhật Phòng Máy [${editingRoom.roomCode}]` : 'Thêm Phòng Máy Mới Vào CSDL'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã phòng (Code) *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomCode}
                    onChange={(e) => setFormData({ ...formData, roomCode: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sức chứa (Máy tính) *</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tên phòng máy đầy đủ *</label>
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vị trí / Tòa nhà *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Người quản lý</label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#272e3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#272e3d] text-slate-300 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Lưu Phòng Máy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
