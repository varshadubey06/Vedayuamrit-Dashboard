import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 min-w-[320px] max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-50 border-emerald-700/60 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-rose-50 border-rose-700/60 shadow-rose-950/20'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 text-amber-50 border-amber-700/60 shadow-amber-950/20'
              : 'bg-slate-900/90 text-slate-50 border-slate-700/60 shadow-slate-950/20'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
