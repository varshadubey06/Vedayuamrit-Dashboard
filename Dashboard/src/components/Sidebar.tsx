import React from 'react';
import { useDashboard, type TabType } from '../context/DashboardContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Tag,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, products, orders, customers, media } = useDashboard();

  const lowStockCount = products.filter((p) => p.stockCount > 0 && p.stockCount <= 20).length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed').length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Overview & Sales',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'products',
      label: 'Products Catalog',
      icon: <Package className="w-5 h-5" />,
      badge: products.length,
      badgeColor: 'bg-emerald-800 text-emerald-200',
    },
    {
      id: 'add-product',
      label: 'Add New Product',
      icon: <PlusCircle className="w-5 h-5" />,
      badge: 'New',
      badgeColor: 'bg-amber-600 text-amber-100',
    },
    {
      id: 'orders',
      label: 'Orders & Logistics',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : orders.length,
      badgeColor: pendingOrdersCount > 0 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-700 text-slate-300',
    },
    {
      id: 'customers',
      label: 'Customers & Logins',
      icon: <Users className="w-5 h-5" />,
      badge: customers.length,
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'media',
      label: 'Media & Images',
      icon: <ImageIcon className="w-5 h-5" />,
      badge: media.length,
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'coupons',
      label: 'Coupons & Promos',
      icon: <Tag className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings & Backup',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-gradient-to-b from-[#062013] via-[#092b1b] to-[#04160d] text-slate-200 border-r border-emerald-900/40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header with Clean Transparent Logo Cutout */}
        <div className="p-5 border-b border-emerald-900/50 flex flex-col space-y-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            title="Click to visit live website"
            className="flex items-center justify-center py-2 px-3 rounded-2xl bg-white/[0.04] border border-amber-400/20 hover:border-amber-400/40 hover:bg-white/[0.08] transition-all group shadow-inner"
          >
            <img
              src="/images/vedayu-logo-transparent.png"
              alt="VEDAYU AMRIT"
              className="h-12 w-auto max-w-[210px] object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Connected Storefront Live Status Pill */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#082d1c] hover:from-emerald-900/90 hover:to-[#0b3823] text-amber-300 hover:text-white border border-amber-400/25 text-xs font-semibold transition-all group shadow-sm"
            title="Open Live Website (Storefront)"
          >
            <span className="flex items-center gap-2 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">Storefront Live</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
              <span>Port 3000</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        </div>

        {/* Quick Inventory Alert Widget in Sidebar */}
        {lowStockCount > 0 && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{lowStockCount} items</strong> running low on stock
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsMobileOpen(false);
              }}
              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded text-[10px] transition-colors"
            >
              View
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-500/70">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                  ? 'bg-gradient-to-r from-emerald-700/80 to-emerald-800/60 text-white shadow-md shadow-emerald-950/40 border border-emerald-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`transition-colors ${isActive ? 'text-amber-300' : 'text-emerald-400/80 group-hover:text-amber-300'
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Link & Store Info Footer */}
        <div className="p-4 border-t border-emerald-900/50 bg-[#04160d]/60">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all mb-3 group"
          >
            <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Open Live Website (Store)</span>
          </a>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 mb-3">
            <div className="flex items-center justify-between text-xs text-emerald-300/80 mb-1">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Ayurvedic Store
              </span>
              <span className="text-[10px] text-emerald-400">Port 3000</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              46 Botanical formulas &amp; Rasayanas active
            </p>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                VA
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Super Admin</p>
                <p className="text-[10px] text-emerald-400">Master Console</p>
              </div>
            </div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Open Vedayuamrit Storefront (localhost:3000)"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
