import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  RefreshCw,
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
  authError: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onLogout,
  isLoggingOut,
  authError,
}) => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    products,
    orders,
    resetToDefaults,
    showToast,
  } = useDashboard();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Compute live fast totals
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0) + 242000; // includes past month base
  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount <= 20).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-slate-900 capitalize tracking-tight flex items-center gap-2">
            {activeTab === 'overview' && 'Sales & Profit Analytics'}
            {activeTab === 'products' && 'Product Inventory & Catalog'}
            {activeTab === 'add-product' && 'Add New Product Formulation'}
            {activeTab === 'orders' && 'Customer Orders & Shipments'}
            {activeTab === 'customers' && 'Registered Customers & Logins'}
            {activeTab === 'media' && 'Media & Image Asset Gallery'}
            {activeTab === 'coupons' && 'Promotions & Discount Coupons'}
            {activeTab === 'settings' && 'Store Management & Data Backup'}
            <span className="text-xs px-2.5 py-0.5 font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Vedayu
            </span>
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers, SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-emerald-600 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Live Date / Time Badge */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 bg-slate-100/80 rounded-xl text-xs font-medium text-slate-600 border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>{currentTime || '16 Nov 2026'}</span>
        </div>

        {/* Quick Stock Warning Pill */}
        {lowStockCount > 0 && (
          <button
            onClick={() => setActiveTab('products')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200 transition-colors"
            title={`${lowStockCount} items low on stock`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="hidden sm:inline">{lowStockCount} Low Stock</span>
          </button>
        )}

        {/* Open Live Storefront */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200/80 transition-colors shadow-2xs"
          title="Visit Customer-Facing Storefront (http://localhost:3000)"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          <span>Live Store</span>
        </a>

        <button
          onClick={() => void onLogout()}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          title="Sign out of the admin dashboard"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isLoggingOut ? 'Signing out…' : 'Sign out'}</span>
        </button>
        {authError && (
          <span role="alert" className="max-w-48 text-xs text-red-700">
            {authError}
          </span>
        )}

        {/* "+ Add Product" Quick Action Button */}
        <button
          onClick={() => setActiveTab('add-product')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
};
