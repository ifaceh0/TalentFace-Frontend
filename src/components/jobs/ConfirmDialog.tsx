import { useEffect } from 'react';
import { Loader, Trash2, Lock } from 'lucide-react'

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title, message, confirmLabel = 'Delete', variant = 'danger', loading = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const isWarning = variant === 'warning';
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, loading]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={loading ? undefined : onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-5"
      >
        <div className="flex items-start gap-3">
           <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isWarning ? 'bg-amber-50' : 'bg-red-50'}`}>
            {isWarning
              ? <Lock size={16} className="text-amber-600" />
              : <Trash2 size={16} className="text-red-600" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
             className={`flex-1 text-sm text-white px-3 py-2 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2 ${
              isWarning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading && <Loader size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}