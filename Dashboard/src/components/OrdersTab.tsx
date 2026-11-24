import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Order } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  X,
  Printer,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const {
    orders,
    viewingOrder,
    setViewingOrder,
    updateOrderStatus,
    showToast,
  } = useDashboard();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Tracking edit state inside modal
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierInput, setCourierInput] = useState('');

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchCity = o.city.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchEmail && !matchCity) return false;
    }
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) return false;
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalProfit = filteredOrders.reduce((sum, o) => sum + o.profitEstimate, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Orders & Shipment Logistics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {filteredOrders.length} Orders
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track Ayurvedic product dispatches, payment verification, and logistics partners.
          </p>
        </div>

        {/* Quick totals badge */}
        <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Filtered Revenue</span>
            <span className="font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px]">Gross Profit</span>
            <span className="font-bold text-emerald-700">₹{totalProfit.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID (VA-...), Customer Name, Email, City..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI (Instant)</option>
              <option value="Razorpay">Razorpay / NetBanking</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Items Summary</th>
                <th className="py-3.5 px-3">Total Amount</th>
                <th className="py-3.5 px-3">Profit</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Invoice & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Order Number & Date */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{order.date}</div>
                    {order.trackingNumber && (
                      <div className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded w-fit mt-1">
                        {order.trackingNumber}
                      </div>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{order.customerName}</div>
                    <div className="text-[10px] text-slate-500">
                      {order.city}, {order.state}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1.5">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.productImage}
                          alt={item.productName}
                          className="w-7 h-7 object-cover rounded-md border border-slate-200"
                          title={`${item.productName} (x${item.quantity})`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
                          }}
                        />
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          +{order.items.length - 2}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-600 ml-1">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 text-xs">
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-[10px] text-emerald-700">
                        -₹{order.discount} ({order.couponCode || 'Promo'})
                      </div>
                    )}
                  </td>

                  {/* Profit */}
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">
                    ₹{order.profitEstimate}
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 block w-fit">
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`text-[9px] mt-0.5 block ${
                        order.paymentStatus === 'Paid'
                          ? 'text-emerald-700 font-semibold'
                          : 'text-amber-700 font-semibold'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as Order['orderStatus'])
                      }
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : order.orderStatus === 'Packed'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Tax Invoice Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Order Invoice: {viewingOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-emerald-300">{viewingOrder.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Status and Logistics Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 text-xs">
                      {viewingOrder.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>
                      Payment: <strong>{viewingOrder.paymentMethod}</strong> (
                      {viewingOrder.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Logistics Partner & Tracking Input */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      defaultValue={viewingOrder.courierPartner || 'BlueDart Air Express'}
                      onChange={(e) => setCourierInput(e.target.value)}
                      placeholder="e.g. Delhivery, BlueDart"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Tracking AWB Number
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={viewingOrder.trackingNumber || 'BLUEDART-882194'}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        placeholder="e.g. BD-994821"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none font-mono text-xs"
                      />
                      <button
                        onClick={() => {
                          updateOrderStatus(
                            viewingOrder.id,
                            viewingOrder.orderStatus,
                            trackingNumberInput || viewingOrder.trackingNumber,
                            courierInput || viewingOrder.courierPartner
                          );
                        }}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-700 shrink-0 text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-xs">Customer Shipping Address:</p>
                <p className="font-semibold text-slate-800">{viewingOrder.customerName}</p>
                <p className="text-slate-600">{viewingOrder.shippingAddress}</p>
                <p className="text-slate-500">
                  {viewingOrder.city}, {viewingOrder.state} - {viewingOrder.pincode}
                </p>
                <p className="text-slate-500">
                  Phone: {viewingOrder.customerPhone} · Email: {viewingOrder.customerEmail}
                </p>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <p className="font-bold text-slate-900 text-xs">Ordered Formulations:</p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3">Price</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 flex items-center space-x-2">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-8 object-cover rounded-md border border-slate-200 shrink-0"
                            />
                            <span className="font-semibold text-slate-800">{item.productName}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">₹{item.price}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            ₹{item.subtotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{viewingOrder.subtotal}</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({viewingOrder.couponCode || 'Promo'}):</span>
                    <span>-₹{viewingOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Ayurvedic Safe Express Shipping:</span>
                  <span>{viewingOrder.shipping === 0 ? 'FREE' : `₹${viewingOrder.shipping}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-800">₹{viewingOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                GST Invoice · VEDAYU AMRIT HERBAL STORE
              </span>
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
