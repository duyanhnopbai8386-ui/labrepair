import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'labrepair_users_v2';

const DEFAULT_USERS = [
  {
    id: 101,
    fullName: 'Lê Nguyễn Ngọc Duy Anh (Quản trị viên)',
    email: 'admin@school.edu',
    phone: '0987.654.321',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 102,
    fullName: 'Kỹ thuật viên Nguyễn Văn Trực',
    email: 'tech@school.edu',
    phone: '0912.111.222',
    role: 'TECHNICIAN',
    status: 'ACTIVE',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 103,
    fullName: 'Lê Nguyễn Ngọc Duy Anh (SV CCQ2411E)',
    email: 'student@school.edu',
    phone: '0987.654.321',
    role: 'STUDENT',
    status: 'ACTIVE',
    createdAt: '2026-11-06 08:00:00'
  },
  {
    id: 104,
    fullName: 'ThS. Nguyễn Minh Tuấn (GV Hướng dẫn)',
    email: 'tuan.nm@hitc.edu.vn',
    phone: '0908.123.456',
    role: 'TEACHER',
    status: 'ACTIVE',
    createdAt: '2026-11-06 08:00:00'
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasMojibake = parsed.some(u => (u.fullName || '').includes('?') || (u.fullName || '').includes('Ã') || (u.fullName || '').includes('Û'));
          if (!hasMojibake) {
            return parsed.map((item, idx) => ({
              ...item,
              id: Number(item.id) || idx + 1
            }));
          }
        }
      }
    } catch (e) {}
    return DEFAULT_USERS;
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    status: 'ACTIVE'
  });

  const saveUsers = (newList) => {
    setUsers(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {}
  };

  const getNextCleanId = () => {
    if (!users || users.length === 0) return 105;
    const maxId = Math.max(...users.map(u => Number(u.id) || 0));
    return maxId + 1;
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch =
      (u.fullName || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (u.phone || '').includes(searchKeyword);
    return matchRole && matchSearch;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-bold text-[11px]">ADMIN</span>;
      case 'TECHNICIAN':
        return <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded font-bold text-[11px]">KỸ THUẬT VIÊN</span>;
      case 'TEACHER':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded font-bold text-[11px]">GIẢNG VIÊN</span>;
      default:
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold text-[11px]">SINH VIÊN</span>;
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'STUDENT',
      status: 'ACTIVE'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      const updated = users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u));
      saveUsers(updated);
    } else {
      const cleanId = getNextCleanId();
      const newUser = {
        id: cleanId,
        ...formData,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      const updated = [...users, newUser];
      saveUsers(updated);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      const updated = users.filter((u) => u.id !== id);
      saveUsers(updated);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" /> Add New
          </button>
        </div>
        <div className="text-xs text-slate-400">
          Management / <span className="text-slate-200 font-medium">User Management</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#181d26] p-3.5 rounded-xl border border-[#272e3d] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Search:</span>
          <input
            type="text"
            placeholder="Tìm theo tên, email, sđt..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500 w-72"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#272e3d] text-slate-200 text-xs px-3 py-2 rounded-lg border border-[#384256] focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
            <option value="TECHNICIAN">Kỹ thuật viên (Technician)</option>
            <option value="TEACHER">Giảng viên (Teacher)</option>
            <option value="STUDENT">Sinh viên (Student)</option>
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
                <th className="py-3 px-3">FULL NAME</th>
                <th className="py-3 px-3">EMAIL</th>
                <th className="py-3 px-3">PHONE</th>
                <th className="py-3 px-3 text-center">ROLE</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">CREATED AT</th>
                <th className="py-3 px-4 text-center w-24">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b38]">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#1f2633] transition-colors">
                  <td className="py-3.5 px-3 text-center text-slate-400 font-mono font-bold">{user.id}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{user.fullName}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{user.email}</td>
                  <td className="py-3.5 px-3 text-slate-300">{user.phone || '0987.654.321'}</td>
                  <td className="py-3.5 px-3 text-center">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Hoạt động
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">{user.createdAt}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        title="Xóa tài khoản"
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-[#151922] border-t border-[#272e3d] flex items-center justify-between text-xs text-slate-400">
          <div>{filtered.length} of {users.length} tài khoản</div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1"><ChevronLeft size={14} /> Prev</button>
            <button className="px-3 py-1.5 rounded bg-[#272e3d] text-slate-300 flex items-center gap-1">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181d26] border border-[#2e3748] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200 text-xs">
            <h3 className="text-lg font-bold text-white border-b border-[#272e3d] pb-3">
              {editingUser ? `Chỉnh Sửa Người Dùng [${editingUser.fullName}]` : 'Thêm Người Dùng Mới'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lê Nguyễn Ngọc Duy Anh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@school.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vai trò hệ thống *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#272e3d] border border-[#384256] rounded-lg px-3 py-2 text-white"
                >
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  <option value="TECHNICIAN">Kỹ thuật viên (TECHNICIAN)</option>
                  <option value="TEACHER">Giảng viên (TEACHER)</option>
                  <option value="STUDENT">Sinh viên (STUDENT)</option>
                </select>
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
                  {editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
