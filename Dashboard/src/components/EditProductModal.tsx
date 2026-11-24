import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Product } from '../types';
import { X, Check, TrendingUp, Sparkles, AlertCircle, Save } from 'lucide-react';

export const EditProductModal: React.FC = () => {
  const { editingProduct, setEditingProduct, updateProduct, categories, media } = useDashboard();

  if (!editingProduct) return null;

  const [formData, setFormData] = useState<Product>({ ...editingProduct });

  useEffect(() => {
    if (editingProduct) {
      setFormData({ ...editingProduct });
    }
  }, [editingProduct]);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDosha = (d: string) => {
    setFormData((prev) => {
      const current = prev.dosha || [];
      const updated = current.includes(d) ? current.filter((item) => item !== d) : [...current, d];
      return { ...prev, dosha: updated };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(formData.id, formData);
    setEditingProduct(null);
  };

  const discountPct =
    formData.mrp > formData.price ? Math.round(((formData.mrp - formData.price) / formData.mrp) * 100) : 0;
  const estimatedCost = Math.round(formData.mrp * 0.38);
  const marginPct =
    formData.price > 0 ? Math.round(((formData.price - estimatedCost) / formData.price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Edit Ayurvedic Formulation
              </h3>
              <p className="text-xs text-emerald-300 font-mono">SKU: {formData.id}</p>
            </div>
          </div>
          <button
            onClick={() => setEditingProduct(null)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
          {/* Title & Tagline */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Product Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Tagline / Key Formulation Claim</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Pricing & Profit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Selling Price (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">MRP (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.mrp}
                onChange={(e) => handleChange('mrp', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-1.5 rounded-xl border border-emerald-300 text-center">
                {discountPct}% OFF · ~{marginPct}% Margin
              </div>
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Stock Count</label>
              <input
                type="number"
                min="0"
                value={formData.stockCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  handleChange('stockCount', count);
                  handleChange('inStock', count > 0);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Size / Weight</label>
              <input
                type="text"
                value={formData.sizeWeight}
                onChange={(e) => handleChange('sizeWeight', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Image Path / Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Primary Product Image URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
              />
              <img
                src={formData.image}
                alt="preview"
                className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
              />
            </div>
          </div>

          {/* Dosha Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Dosha Harmony</label>
            <div className="flex gap-2">
              {['Vata', 'Pitta', 'Kapha'].map((d) => {
                const isSelected = formData.dosha?.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDosha(d)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Ayurvedic Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4 pt-1 font-medium text-slate-700">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="rounded text-emerald-700"
              />
              <span>In Stock</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.isBestseller}
                onChange={(e) => handleChange('isBestseller', e.target.checked)}
                className="rounded text-emerald-700"
              />
              <span>Bestseller</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded text-emerald-700"
              />
              <span>Featured</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
