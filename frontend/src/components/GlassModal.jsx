import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const GlassModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,50,120,0.18)] p-6 sm:p-8 z-10 transform transition-all duration-300 scale-100 my-8`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/80 mb-5">
          <h3 className="text-xl font-semibold tracking-tight text-slate-800 flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100/70 hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};
