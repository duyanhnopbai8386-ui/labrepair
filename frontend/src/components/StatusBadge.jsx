import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const config = {
    // Trạng thái thiết bị
    HOAT_DONG: { label: 'Hoạt động', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
    CHO_SUA: { label: 'Chờ sửa chữa', bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', dot: 'bg-amber-500' },
    DANG_SUA: { label: 'Đang sửa chữa', bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/20', dot: 'bg-sky-500' },
    THANH_LY: { label: 'Đã thanh lý', bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', dot: 'bg-slate-400' },
    HONG: { label: 'Bị hỏng', bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-500/20', dot: 'bg-rose-500' },

    // Trạng thái phiếu sự cố
    MOI_TAO: { label: 'Mới tạo', bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', dot: 'bg-blue-500' },
    DA_TIEP_NHAN: { label: 'Đã tiếp nhận', bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20', dot: 'bg-purple-500' },
    HOAN_THANH: { label: 'Đã hoàn thành', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
    HUY: { label: 'Đã hủy', bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', dot: 'bg-slate-400' },

    // Mức ưu tiên
    KHAN_CAP: { label: 'Khẩn cấp', bg: 'bg-rose-600/15', text: 'text-rose-700 font-bold', border: 'border-rose-600/30', dot: 'bg-rose-600 animate-pulse' },
    CAO: { label: 'Cao', bg: 'bg-orange-500/10', text: 'text-orange-600 font-semibold', border: 'border-orange-500/20', dot: 'bg-orange-500' },
    TRUNG_BINH: { label: 'Trung bình', bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', dot: 'bg-blue-400' },
    THAP: { label: 'Thấp', bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', dot: 'bg-slate-400' },

    // Trạng thái kho linh kiện
    CON_HANG: { label: 'Còn hàng', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
    SAP_HET: { label: 'Sắp hết hàng', bg: 'bg-rose-500/10', text: 'text-rose-600 font-bold', border: 'border-rose-500/30', dot: 'bg-rose-500 animate-pulse' },
    HET_HANG: { label: 'Hết hàng', bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/20', dot: 'bg-slate-500' },
  };

  const style = config[status.toUpperCase()] || {
    label: status,
    bg: 'bg-slate-500/10',
    text: 'text-slate-600',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};
