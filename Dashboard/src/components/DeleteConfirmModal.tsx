import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingProduct, setDeletingProduct, deleteProduct } = useDashboard();

  if (!deletingProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-rose-800">
            <div className="p-2 rounded-xl bg-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-bold text-sm">Delete Product Formulation</h3>
          </div>
          <button
            onClick={() => setDeletingProduct(null)}
            className="p-1 rounded-lg hover:bg-rose-100 text-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete this formulation from the store catalog? This action will remove it from live customer listings.
          </p>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={deletingProduct.image}
              alt={deletingProduct.name}
              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
              }}
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {deletingProduct.name}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono">
                SKU: {deletingProduct.id} · ₹{deletingProduct.price}
              </p>
              <span className="text-[10px] font-semibold text-emerald-700">
                {deletingProduct.category}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setDeletingProduct(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => deleteProduct(deletingProduct.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm & Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
