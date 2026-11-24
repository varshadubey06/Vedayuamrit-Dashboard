import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    products,
    orders,
    customers,
    categories,
    setActiveTab,
    setViewingOrder,
    updateOrderStatus,
  } = useDashboard();

  const [timeRange, setTimeRange] = useState<'30days' | '90days' | 'year'>('30days');

  // Compute live financial totals
  const currentOrdersTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const currentOrdersProfit = orders.reduce((sum, o) => sum + o.profitEstimate, 0);

  // Scaled for full store lifecycle (past baseline + live)
  const multiplier = timeRange === 'year' ? 8.5 : timeRange === '90days' ? 3.2 : 1;
  const baseSales = 284650 * multiplier;
  const totalSales = baseSales + currentOrdersTotal;
  const grossProfit = Math.round(totalSales * 0.591);
  const totalOrdersCount = Math.round(342 * multiplier + orders.length);
  const averageOrderValue = Math.round(totalSales / totalOrdersCount);
  const totalRegisteredCustomers = Math.round(186 * (timeRange === 'year' ? 4 : 1) + customers.length);

  // Inventory value calculation
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stockCount * p.price, 0);
  const lowStockItems = products.filter((p) => p.stockCount > 0 && p.stockCount <= 20);

  // Monthly Trend Data for Chart
  const monthlyTrends = [
    { month: 'Jun', sales: 182000, profit: 107380, orders: 218 },
    { month: 'Jul', sales: 215000, profit: 126850, orders: 254 },
    { month: 'Aug', sales: 238000, profit: 140420, orders: 289 },
    { month: 'Sep', sales: 252000, profit: 148680, orders: 305 },
    { month: 'Oct', sales: 271000, profit: 160160, orders: 326 },
    { month: 'Nov', sales: Math.round(totalSales / multiplier), profit: Math.round(grossProfit / multiplier), orders: 342 },
  ];

  const maxSales = Math.max(...monthlyTrends.map((t) => t.sales));

  // Category breakdown
  const categoryStats = [
    { name: 'Ayurvedic Health Products', share: 34, revenue: '₹96,780', margin: '62%' },
    { name: 'Herbal Juices & Immunity', share: 20, revenue: '₹56,930', margin: '58%' },
    { name: 'Skin Care Products', share: 18, revenue: '₹51,240', margin: '65%' },
    { name: 'Hair Care Products', share: 15, revenue: '₹42,700', margin: '61%' },
    { name: 'Herbal Superfoods & Seeds', share: 9, revenue: '₹25,620', margin: '48%' },
    { name: 'Herbal Teas & Infusions', share: 4, revenue: '₹11,380', margin: '54%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Time Filter */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-[#041a10] via-[#08301e] to-[#052115] text-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-emerald-950/25 border border-emerald-700/40">
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex p-1 rounded-2xl bg-white/[0.06] border border-amber-400/20 backdrop-blur-md shrink-0">
            <img
              src="/images/vedayu-logo-transparent.png"
              alt="Vedayu Logo"
              className="h-12 w-auto max-w-[170px] object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400" /> Executive Analytics
              </span>
              <span className="text-xs text-emerald-300/80">FY 2026-27</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
              Vedayu Amrit Business Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80">
              Real-time tracking of website revenue, profit margins, active customers, orders &amp; warehouse inventory.
            </p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 backdrop-blur-md">
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${timeRange === '30days'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90days')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${timeRange === '90days'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${timeRange === 'year'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* 6 Core Financial & Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Sales Revenue */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/30 p-5 rounded-3xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Website Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+18.4%</span>
            <span className="text-slate-400 font-normal ml-1.5">vs last period</span>
          </div>
        </div>

        {/* Metric 2: Net Gross Profit */}
        <div className="bg-gradient-to-br from-white via-white to-amber-50/40 p-5 rounded-3xl border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-lg hover:shadow-amber-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Estimated Profit</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
            ₹{grossProfit.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-xs font-semibold text-amber-700">
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold mr-1.5 shadow-2xs">
              59.1%
            </span>
            <span className="text-slate-500 font-normal">Profit Margin</span>
          </div>
        </div>

        {/* Metric 3: Total Orders */}
        <div className="bg-gradient-to-br from-white via-white to-sky-50/30 p-5 rounded-3xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-lg hover:shadow-sky-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Total Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-sky-100/80 text-sky-800 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {totalOrdersCount.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+12.8%</span>
            <span className="text-slate-400 font-normal ml-1.5">dispatch rate</span>
          </div>
        </div>

        {/* Metric 4: Average Order Value */}
        <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 p-5 rounded-3xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-lg hover:shadow-indigo-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Avg Order Value (AOV)</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-100/80 text-indigo-800 flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+₹64</span>
            <span className="text-slate-400 font-normal ml-1.5">cart upsell</span>
          </div>
        </div>

        {/* Metric 5: Customers & Logins */}
        <div className="bg-gradient-to-br from-white via-white to-purple-50/30 p-5 rounded-3xl border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-lg hover:shadow-purple-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Customer Accounts</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100/80 text-purple-800 flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {totalRegisteredCustomers.toLocaleString('en-IN')}
          </div>
          <div className="mt-2.5 flex items-center text-xs font-semibold text-purple-700">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 font-bold mr-1.5 shadow-2xs">
              64%
            </span>
            <span className="text-slate-500 font-normal">Repeat rate</span>
          </div>
        </div>

        {/* Metric 6: Inventory Value */}
        <div className="bg-gradient-to-br from-white via-white to-teal-50/30 p-5 rounded-3xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-lg hover:shadow-teal-950/5 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2.5">
            <span>Catalog Stock</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center shadow-xs">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {products.length} SKUs
          </div>
          <div className="mt-2.5 flex items-center text-xs font-medium text-slate-600">
            <span className="font-bold text-teal-800">{totalInventoryUnits} units</span>
            <span className="text-slate-400 font-normal ml-1.5">in warehouse</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sales vs Profit Chart + Ayurvedic Category Revenue Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Monthly Sales and Profit Comparison */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Revenue & Profit Progression
              </h3>
              <p className="text-xs text-slate-500">
                Gross sales compared to net calculated profit after herb sourcing & packaging
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-emerald-700"></span>
                <span className="text-slate-600 font-medium">Gross Revenue</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-amber-500"></span>
                <span className="text-slate-600 font-medium">Net Profit (59%)</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-100">
            {monthlyTrends.map((item, idx) => {
              const salesHeightPct = Math.round((item.sales / maxSales) * 100);
              const profitHeightPct = Math.round((item.profit / maxSales) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${salesHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-emerald-800 hover:bg-emerald-700 rounded-t-md transition-all relative group"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                        <span>Revenue: ₹{(item.sales / 1000).toFixed(1)}k</span>
                        <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5"></div>
                      </div>
                    </div>

                    {/* Profit Bar */}
                    <div
                      style={{ height: `${profitHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-amber-500 hover:bg-amber-400 rounded-t-md transition-all relative group"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                        <span>Profit: ₹{(item.profit / 1000).toFixed(1)}k</span>
                        <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5"></div>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-600 mt-3">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Historical baseline synced with store orders.</span>
            <span className="font-semibold text-emerald-800">
              Total Recorded Revenue: ₹{totalSales.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Category Share & Profit Margin Table */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Revenue by Category
              </h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                View Catalog
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Sales contribution and estimated gross profit margin per category
            </p>

            <div className="space-y-3.5">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[160px]">
                      {cat.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{cat.revenue}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
                        {cat.margin}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.share * 2.5}%` }}
                      className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ayurvedic Dosha Metric Box */}
          <div className="mt-6 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <p className="font-bold">Ayurvedic Dosha Distribution</p>
              <p className="text-[11px] text-emerald-700">
                42% Pitta balancing · 36% Vata soothing · 22% Kapha
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders Table & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Stream (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-slate-500">
                Live order fulfillment and payment status
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <span>All Orders ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 border-b border-slate-100 font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Profit</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{order.customerName}</div>
                      <div className="text-[10px] text-slate-500">{order.city}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{order.total}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      ₹{order.profitEstimate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Shipped'
                              ? 'bg-sky-100 text-sky-800'
                              : order.orderStatus === 'Packed'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setViewingOrder(order);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-800"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Inventory Alerts (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Low Stock Alerts
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {lowStockItems.length} SKUs
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Herbal inventory running under threshold of 20 units
            </p>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All warehouse items are well-stocked.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-900 truncate max-w-[130px]">
                          {prod.name}
                        </p>
                        <p className="text-[10px] text-slate-500">₹{prod.price} · {prod.sizeWeight}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {prod.stockCount} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('products')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span>Manage Entire Inventory ({products.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
