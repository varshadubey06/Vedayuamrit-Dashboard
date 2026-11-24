import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Coupon } from '../types';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Percent, Sparkles, X } from 'lucide-react';

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon, showToast } = useDashboard();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(799);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: discountType === 'percent' ? discountValue : undefined,
      discountFlat: discountType === 'flat' ? discountValue : undefined,
      minOrderValue,
      description:
        description ||
        `${discountType === 'percent' ? `${discountValue}% OFF` : `₹${discountValue} OFF`} on orders above ₹${minOrderValue}`,
      isActive: true,
      usageCount: 0,
    });

    setIsAddOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Promotions & Discount Coupons</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {coupons.length} Active Codes
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Create promotional codes and festive Ayurvedic savings campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              coupon.isActive
                ? 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl font-mono font-black text-sm bg-emerald-50 text-emerald-900 border border-emerald-200 tracking-wider">
                  {coupon.code}
                </span>
                <button
                  onClick={() => toggleCoupon(coupon.code)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    coupon.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div>
                <div className="text-lg font-black text-slate-900">
                  {coupon.discountPercent
                    ? `${coupon.discountPercent}% OFF`
                    : `₹${coupon.discountFlat} FLAT OFF`}
                </div>
                <p className="text-xs text-slate-500 mt-1">{coupon.description}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Min Order Value:</span>
                <span className="font-bold text-slate-800">₹{coupon.minOrderValue}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Usage: {coupon.usageCount || 42} times applied
              </span>
              <button
                onClick={() => deleteCoupon(coupon.code)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Create New Promo Code</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AYURVEDA25"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Discount Value ({discountType === 'percent' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 25% OFF for Ayurvedic Wellness"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
