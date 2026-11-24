import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Product } from '../types';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const {
    products,
    categories,
    setActiveTab,
    setEditingProduct,
    setDeletingProduct,
    toggleProductStock,
    updateStockCount,
    searchQuery,
    setSearchQuery,
  } = useDashboard();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outofstock'>('all');
  const [doshaFilter, setDoshaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock' | 'rating'>('name');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesId = p.id.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesTagline = p.tagline?.toLowerCase().includes(q);
          if (!matchesName && !matchesId && !matchesCategory && !matchesTagline) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.categorySlug !== selectedCategory && p.category !== selectedCategory) return false;
        }

        // Stock filter
        if (stockFilter === 'instock' && (!p.inStock || p.stockCount === 0)) return false;
        if (stockFilter === 'lowstock' && (p.stockCount <= 0 || p.stockCount > 20)) return false;
        if (stockFilter === 'outofstock' && p.inStock && p.stockCount > 0) return false;

        // Dosha filter
        if (doshaFilter !== 'all') {
          if (!p.dosha || !p.dosha.includes(doshaFilter)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return a.stockCount - b.stockCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, selectedCategory, stockFilter, doshaFilter, sortBy]);

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price * p.stockCount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Product Inventory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {filteredProducts.length} of {products.length} Products
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your Ayurvedic catalog, pricing, stock levels, images, and formulations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Add Product Button */}
          <button
            onClick={() => setActiveTab('add-product')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, botanical herb, SKU..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none transition-all"
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter products by category"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              aria-label="Filter products by stock status"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Stock Statuses</option>
              <option value="instock">In Stock (&gt;0)</option>
              <option value="lowstock">Low Stock (1 - 20)</option>
              <option value="outofstock">Out of Stock (0)</option>
            </select>

            {/* Dosha Filter */}
            <select
              value={doshaFilter}
              onChange={(e) => setDoshaFilter(e.target.value)}
              aria-label="Filter products by Ayurvedic Dosha"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Doshas</option>
              <option value="Vata">Vata</option>
              <option value="Pitta">Pitta</option>
              <option value="Kapha">Kapha</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products by criteria"
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Stock Level</option>
              <option value="rating">Customer Rating</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-500'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Banner */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> items · Total Inventory Value:{' '}
            <strong className="text-emerald-800">₹{totalValue.toLocaleString('en-IN')}</strong>
          </div>
          {(selectedCategory !== 'all' || stockFilter !== 'all' || doshaFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setStockFilter('all');
                setDoshaFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* View 1: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price / MRP</th>
                  <th className="py-3.5 px-3">Profit Margin</th>
                  <th className="py-3.5 px-3">Dosha</th>
                  <th className="py-3.5 px-3">Stock Count</th>
                  <th className="py-3.5 px-3 text-center">In Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                  const estimatedCost = Math.round(p.mrp * 0.38);
                  const marginPct = Math.round(((p.price - estimatedCost) / p.price) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                                {p.name}
                              </span>
                              {p.isBestseller && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate max-w-[220px]">
                              {p.sizeWeight} · {p.dosageForm}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {p.category}
                        </span>
                      </td>

                      {/* Price / MRP */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-xs">
                          ₹{p.price}
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{p.mrp} ({discountPct}% off)
                        </div>
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ~{marginPct}% margin
                        </span>
                      </td>

                      {/* Dosha Tags */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.dosha?.map((d) => (
                            <span
                              key={d}
                              className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stock Count with quick changer */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => updateStockCount(p.id, p.stockCount - 5)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            title="Decrease 5"
                          >
                            -
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-xs min-w-[32px] text-center ${
                              p.stockCount === 0
                                ? 'bg-rose-100 text-rose-800'
                                : p.stockCount <= 20
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {p.stockCount}
                          </span>
                          <button
                            onClick={() => updateStockCount(p.id, p.stockCount + 5)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            title="Increase 5"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* In-Stock Toggle Switch */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleProductStock(p.id)}
                          className={`p-1.5 rounded-xl transition-all ${
                            p.inStock && p.stockCount > 0
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                          }`}
                          title={p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        >
                          {p.inStock && p.stockCount > 0 ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      </td>

                      {/* Action Buttons: Edit and Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View 2: Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => {
            const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {p.isBestseller && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                          Bestseller
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-800 text-white shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                          p.inStock && p.stockCount > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.inStock && p.stockCount > 0 ? `${p.stockCount} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {p.category}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.tagline || p.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">
                          ₹{p.price}
                        </div>
                        <div className="text-xs text-slate-400 line-through">
                          MRP ₹{p.mrp} ({discountPct}% off)
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                        {p.dosha?.map((d) => (
                          <span
                            key={d}
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    SKU: {p.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingProduct(p)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
