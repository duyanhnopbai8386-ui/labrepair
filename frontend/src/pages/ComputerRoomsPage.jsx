import React, { useState, useEffect } from 'react';
import { roomApi } from '../api/roomApi';
import { equipmentApi } from '../api/equipmentApi';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { GlassModal } from '../components/GlassModal';
import {
  Monitor,
  Cpu,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Calendar,
  Layers,
  MapPin,
  User,
  Info,
  RefreshCw,
  HardDrive,
  Activity
} from 'lucide-react';

export const ComputerRoomsPage = ({ onReportIssue }) => {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomCode: 'A101',
      roomName: 'Phòng máy thực hành A101 (Lập trình Cơ sở)',
      location: 'Khu A Tầng 1 - HITC',
      capacity: 40,
      description: 'Phục vụ các môn Nhập môn lập trình C/C++, Cấu trúc dữ liệu, OOP căn bản',
      status: 'HOAT_DONG',
      managerName: 'ThS. Nguyễn Minh Tuấn',
      contactPhone: '0908.123.456',
    },
    {
      id: 3,
      roomCode: 'A204',
      roomName: 'Phòng máy thực hành A204 (Lập trình Java & Spring Boot)',
      location: 'Khu A Tầng 2 - HITC',
      capacity: 40,
      description: 'Phục vụ các môn Lập trình Java, Kiến trúc phần mềm, Spring Boot, React nâng cao',
      status: 'HOAT_DONG',
      managerName: 'ThS. Nguyễn Minh Tuấn',
      contactPhone: '0908.123.456',
    },
    {
      id: 4,
      roomCode: 'A302',
      roomName: 'Phòng máy thực hành A302 (Web & Mobile App)',
      location: 'Khu A Tầng 3 - HITC',
      capacity: 35,
      description: 'Phục vụ các môn Công nghệ Web, Node.js, Lập trình ứng dụng di động Flutter/Android',
      status: 'HOAT_DONG',
      managerName: 'Cô Lê Thị Kim Yến',
      contactPhone: '0912.888.999',
    },
    {
      id: 5,
      roomCode: 'A404',
      roomName: 'Phòng máy thực hành A404 (Trí tuệ nhân tạo & Data Science)',
      location: 'Khu A Tầng 4 - HITC',
      capacity: 30,
      description: 'Phục vụ nghiên cứu Trí tuệ nhân tạo, Machine Learning, Python Data Analysis',
      status: 'HOAT_DONG',
      managerName: 'ThS. Trần Quang Minh',
      contactPhone: '0933.555.777',
    },
    {
      id: 6,
      roomCode: 'B102',
      roomName: 'Phòng máy thực hành B102 (Mạng máy tính Cisco Lab)',
      location: 'Khu B Tầng 1 - HITC',
      capacity: 35,
      description: 'Phục vụ môn Mạng máy tính căn bản, Quản trị hệ thống mạng Cisco CCNA',
      status: 'HOAT_DONG',
      managerName: 'Thầy Nguyễn Văn Hoàng',
      contactPhone: '0912.333.444',
    },
    {
      id: 7,
      roomCode: 'B201',
      roomName: 'Phòng máy thực hành B201 (An toàn thông tin & Quản trị Linux)',
      location: 'Khu B Tầng 2 - HITC',
      capacity: 30,
      description: 'Thực hành Bảo mật mạng, Quản trị máy chủ Linux RedHat/Ubuntu, An toàn hệ thống',
      status: 'HOAT_DONG',
      managerName: 'Thầy Nguyễn Văn Hoàng',
      contactPhone: '0912.333.444',
    },
    {
      id: 8,
      roomCode: 'D-06',
      roomName: 'Phòng máy thực hành D-06 (Đồ họa & Thiết kế 3D)',
      location: 'Khu D Tầng Trệt - HITC',
      capacity: 35,
      description: 'Trang bị GPU rời cấu hình mạnh phục vụ Photoshop, Illustrator, Blender 3D, Premiere Pro',
      status: 'HOAT_DONG',
      managerName: 'KTV Nguyễn Văn Trực',
      contactPhone: '0912.345.678',
    },
    {
      id: 9,
      roomCode: 'D5-12',
      roomName: 'Phòng máy thực hành D5-12 (IoT & Lập trình vi điều khiển)',
      location: 'Khu D Tầng 5 - HITC',
      capacity: 30,
      description: 'Phòng Lab vi điều khiển STM32, ESP32, Arduino, Raspberry Pi kết nối IoT',
      status: 'HOAT_DONG',
      managerName: 'KTV Nguyễn Văn Trực',
      contactPhone: '0912.345.678',
    },
    {
      id: 10,
      roomCode: 'D5-36',
      roomName: 'Phòng máy thực hành D5-36 (Cloud Computing & DevOps)',
      location: 'Khu D Tầng 5 - HITC',
      capacity: 30,
      description: 'Phòng thực hành Điện toán đám mây, Docker, Kubernetes, CI/CD Pipeline',
      status: 'HOAT_DONG',
      managerName: 'KTV Nguyễn Văn Trực',
      contactPhone: '0912.345.678',
    }
  ]);

  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal detail máy tính
  const [selectedPc, setSelectedPc] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Modal thêm máy tính mới
  const [addPcModalOpen, setAddPcModalOpen] = useState(false);
  const [newPcForm, setNewPcForm] = useState({
    equipmentCode: '',
    equipmentName: '',
    serialNumber: '',
    model: 'Dell OptiPlex 7090',
    specification: 'Intel Core i7-10700 / 16GB DDR4 / SSD NVMe 512GB / Dell IPS 24" FHD',
    status: 'HOAT_DONG',
    categoryId: 1,
  });

  // Mock generator cho máy phòng nếu API chưa có đủ
  const generateMockEquipmentsForRoom = (roomObj) => {
    const code = roomObj?.roomCode || 'A101';
    const cleanCode = code.replace('-', '');
    const isGraphic = code.startsWith('D');
    const total = 15;
    const items = [];

    for (let i = 1; i <= total; i++) {
      const numStr = i < 10 ? `0${i}` : `${i}`;
      let status = 'HOAT_DONG';
      if (i === 5) status = 'CHO_SUA';
      if (i === 9) status = 'DANG_SUA';

      items.push({
        id: (roomObj?.id || 1) * 100 + i,
        roomId: roomObj?.id || 1,
        roomCode: code,
        equipmentCode: `PC-${cleanCode}-${numStr}`,
        equipmentName: `Máy trạm PC-${cleanCode}-${numStr}`,
        serialNumber: `SN-HITC-${cleanCode}-${numStr}98`,
        model: isGraphic ? 'Dell Precision 3640 Tower' : 'Dell OptiPlex 7090 MFF',
        specification: isGraphic
          ? 'Core i9-10900K / 32GB RAM / SSD 1TB / RTX 3060 12GB'
          : 'Intel Core i7-10700 / 16GB DDR4 / SSD 512GB / Dell 24" FHD',
        status: status,
        installationDate: '2024-09-01',
        warrantyExpiryDate: '2027-09-01',
        categoryName: 'Máy tính để bàn',
      });
    }
    return items;
  };

  const loadData = async () => {
    setLoading(true);
    let loadedRooms = rooms;
    try {
      const roomRes = await roomApi.getAll();
      if (roomRes.data && roomRes.data.length > 0) {
        loadedRooms = roomRes.data;
        setRooms(roomRes.data);
        if (!roomRes.data.some(r => r.id === selectedRoomId)) {
          setSelectedRoomId(roomRes.data[0].id);
        }
      }
    } catch (err) {
      console.warn('Load rooms fallback to state default');
    }

    try {
      const eqRes = await equipmentApi.getAll();
      if (eqRes.data && eqRes.data.length > 0) {
        setEquipments(eqRes.data);
      } else {
        const cur = loadedRooms.find(r => r.id === selectedRoomId) || loadedRooms[0];
        setEquipments(generateMockEquipmentsForRoom(cur));
      }
    } catch (err) {
      const cur = loadedRooms.find(r => r.id === selectedRoomId) || loadedRooms[0];
      setEquipments(generateMockEquipmentsForRoom(cur));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const isRoomMatch = (e) => {
    if (!currentRoom) return false;
    if (e.roomId && e.roomId === currentRoom.id) return true;
    if (e.room && e.room.id === currentRoom.id) return true;
    if (e.roomCode && currentRoom.roomCode && e.roomCode.trim().toLowerCase() === currentRoom.roomCode.trim().toLowerCase()) return true;
    return false;
  };

  // Nếu trong danh sách chưa có máy nào khớp phòng hiện tại, tự động sinh máy cho phòng đó
  const currentEquipmentsList = equipments.some(e => isRoomMatch(e))
    ? equipments
    : [...equipments, ...generateMockEquipmentsForRoom(currentRoom)];

  const currentRoomEquipments = currentEquipmentsList.filter(e => {
    const matchRoom = isRoomMatch(e);
    const nameStr = e.equipmentName || e.name || '';
    const matchSearch = (e.equipmentCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (e.serialNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchRoom && matchSearch && matchStatus;
  });

  const activeCount = currentEquipmentsList.filter(e => isRoomMatch(e) && e.status === 'HOAT_DONG').length;
  const brokenCount = currentEquipmentsList.filter(e => isRoomMatch(e) && (e.status === 'CHO_SUA' || e.status === 'DANG_SUA' || e.status === 'HONG')).length;

  const handleOpenDetail = (pc) => {
    setSelectedPc(pc);
    setDetailModalOpen(true);
  };

  const handleCreateNewPc = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPcForm,
        roomId: selectedRoomId,
      };
      await equipmentApi.create(payload);
      setAddPcModalOpen(false);
      loadData();
    } catch (err) {
      // Mock local addition
      const mockCreated = {
        ...newPcForm,
        id: Date.now(),
        roomId: selectedRoomId,
        roomCode: currentRoom.roomCode,
        categoryName: 'Máy tính để bàn',
        installationDate: new Date().toISOString().split('T')[0],
      };
      setEquipments(prev => [...prev, mockCreated]);
      setAddPcModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Room Selection Pills (iOS Segmented Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {rooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-300/30'
                    : 'bg-white/70 hover:bg-white text-slate-600 border border-white/80 shadow-sm'
                }`}
              >
                <Monitor size={17} className={isSelected ? 'text-white' : 'text-sky-600'} />
                <span>{room.roomCode}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {room.capacity || 35} máy
                </span>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={() => setAddPcModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-sky-700 font-semibold text-xs border border-sky-200/60 shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
          >
            <Plus size={16} />
            Thêm máy tính vào phòng
          </button>
        )}
      </div>

      {/* Selected Room Info Header Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-600 text-xs font-bold border border-sky-500/20">
                {currentRoom?.roomCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {currentRoom?.roomName}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {currentRoom?.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-sky-500" />
                {currentRoom?.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-sky-500" />
                Quản lý: <strong className="text-slate-700">{currentRoom?.managerName || 'ThS. Nguyễn Minh Tuấn'}</strong>
              </span>
            </div>
          </div>

          {/* Room Health Mini Stats */}
          <div className="flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white/80 shrink-0 shadow-sm">
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 text-center border border-emerald-500/20">
              <div className="text-xl font-extrabold">{activeCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider">Hoạt động tốt</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-700 text-center border border-rose-500/20">
              <div className="text-xl font-extrabold">{brokenCount}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider">Cần sửa chữa</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã máy, số serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter size={13} /> Lọc:
            </span>
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'HOAT_DONG', label: 'Đang hoạt động' },
              { id: 'CHO_SUA', label: 'Chờ sửa' },
              { id: 'DANG_SUA', label: 'Đang sửa' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PC Interactive Grid (Sơ đồ phòng máy trực quan) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              Sơ đồ Máy trạm trong Phòng ({currentRoomEquipments.length} máy)
            </h3>
            <span className="text-xs text-slate-400">Click vào máy để xem cấu hình hoặc báo hỏng</span>
          </div>

          {/* Color legend */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tốt
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Chờ sửa
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Đang bảo trì
            </span>
          </div>
        </div>

        {/* Grid of Workstation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentRoomEquipments.map((pc) => {
            const isBroken = pc.status === 'CHO_SUA' || pc.status === 'HONG';
            const isRepairing = pc.status === 'DANG_SUA';

            return (
              <div
                key={pc.id}
                onClick={() => handleOpenDetail(pc)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left group active:scale-95 ${
                  isBroken
                    ? 'bg-rose-50/70 border-rose-200/80 hover:bg-rose-50 hover:shadow-md hover:shadow-rose-500/10'
                    : isRepairing
                    ? 'bg-sky-50/70 border-sky-200/80 hover:bg-sky-50 hover:shadow-md hover:shadow-sky-500/10'
                    : 'bg-white/80 border-white hover:bg-white hover:shadow-lg hover:shadow-sky-500/10 hover:border-sky-200'
                }`}
              >
                {/* Status Dot Top-Right */}
                <span
                  className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-sm ${
                    isBroken
                      ? 'bg-rose-500 animate-pulse'
                      : isRepairing
                      ? 'bg-sky-500 animate-bounce'
                      : 'bg-emerald-500'
                  }`}
                />

                {/* PC Icon with Glow */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                    isBroken
                      ? 'bg-rose-100 text-rose-600'
                      : isRepairing
                      ? 'bg-sky-100 text-sky-600'
                      : 'bg-gradient-to-tr from-sky-500/10 to-cyan-500/10 text-sky-600'
                  }`}
                >
                  <Monitor size={20} />
                </div>

                {/* Machine Code & Name */}
                <div className="font-bold text-sm text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">
                  {pc.equipmentCode}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                  {pc.model || 'Dell OptiPlex'}
                </div>

                {/* Bottom Status Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    {isBroken ? '⚠️ Sự cố' : isRepairing ? '🔧 Đang sửa' : '✓ Hoạt động'}
                  </span>
                  <span className="text-[10px] text-sky-600 font-bold group-hover:underline">
                    Chi tiết &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Chi tiết Máy tính */}
      <GlassModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedPc ? `Thông tin Máy trạm ${selectedPc.equipmentCode}` : 'Chi tiết máy'}
        maxWidth="max-w-2xl"
      >
        {selectedPc && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Monitor size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{selectedPc.equipmentName || selectedPc.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">Serial: {selectedPc.serialNumber || 'N/A'}</p>
                </div>
              </div>
              <StatusBadge status={selectedPc.status} />
            </div>

            {/* Hardware Specs Grid */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cấu hình Kỹ thuật & Phần cứng
              </h5>
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><Cpu size={14} /> Dòng máy (Model):</span>
                  <strong className="text-slate-800">{selectedPc.model || 'Dell OptiPlex'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><HardDrive size={14} /> Thông số chi tiết:</span>
                  <span className="text-slate-700 font-medium text-right max-w-xs">{selectedPc.specification || selectedPc.conditionNote || 'Intel Core i7-10700 / 16GB RAM / SSD 512GB'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> Ngày đưa vào sử dụng:</span>
                  <span className="text-slate-700">{selectedPc.installationDate || selectedPc.purchaseDate || '2024-09-01'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 flex items-center gap-1.5"><Activity size={14} /> Hạn bảo hành nhà sản xuất:</span>
                  <span className="text-emerald-600 font-semibold">{selectedPc.warrantyExpiryDate || selectedPc.warrantyExpiry || '2027-09-01'}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  onReportIssue({
                    roomId: selectedRoomId,
                    roomName: currentRoom?.roomName,
                    equipmentId: selectedPc.id,
                    equipmentCode: selectedPc.equipmentCode,
                    equipmentName: selectedPc.equipmentName || selectedPc.name
                  });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs shadow-md shadow-rose-500/20 hover:shadow-lg transition-all active:scale-95"
              >
                <AlertTriangle size={15} />
                Báo hỏng máy này ngay
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Modal Thêm Máy tính Mới (Admin) */}
      <GlassModal
        isOpen={addPcModalOpen}
        onClose={() => setAddPcModalOpen(false)}
        title={`Thêm máy tính vào ${currentRoom?.roomCode}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateNewPc} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mã định danh máy *</label>
            <input
              type="text"
              required
              placeholder="VD: PC-A101-16"
              value={newPcForm.equipmentCode}
              onChange={(e) => setNewPcForm({ ...newPcForm, equipmentCode: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tên thiết bị *</label>
            <input
              type="text"
              required
              placeholder="VD: Máy trạm PC-A101-16"
              value={newPcForm.equipmentName}
              onChange={(e) => setNewPcForm({ ...newPcForm, equipmentName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Số Serial máy</label>
            <input
              type="text"
              placeholder="VD: SN-HITC-A101-1698"
              value={newPcForm.serialNumber}
              onChange={(e) => setNewPcForm({ ...newPcForm, serialNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cấu hình chi tiết</label>
            <textarea
              rows={3}
              value={newPcForm.specification}
              onChange={(e) => setNewPcForm({ ...newPcForm, specification: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddPcModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-all"
            >
              Lưu máy mới
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
