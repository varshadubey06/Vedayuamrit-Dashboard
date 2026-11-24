import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Customer } from '../types';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  Eye,
  X,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const CustomersTab: React.FC = () => {
  const { customers, viewingCustomer, setViewingCustomer, addCustomer, orders } = useDashboard();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'VIP' | 'Active' | 'New'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [doshaQuizResult, setDoshaQuizResult] = useState('Pitta-Vata');

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.fullName.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = c.phone.toLowerCase().includes(q);
      const matchCity = c.addresses.some((a) => a.city.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchPhone && !matchCity) return false;
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    addCustomer({
      fullName,
      email,
      phone: phone || '+91 90000 00000',
      registeredDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'New',
      doshaQuizResult,
      totalOrders: 0,
      totalSpent: 0,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Primary',
          fullName,
          phone: phone || '+91 90000 00000',
          addressLine: addressLine || 'Not provided',
          city: city || 'Bengaluru',
          state: state || 'Karnataka',
          pincode: pincode || '560001',
          isDefault: true,
        },
      ],
    });

    setIsAddModalOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setAddressLine('');
    setCity('');
    setState('');
    setPincode('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Customer Profiles & Logins</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {filteredCustomers.length} Registered
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View customer details, logged-in user accounts, Ayurvedic Dosha assessments, and order histories.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email, phone, city..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {(['all', 'VIP', 'Active', 'New'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'All Customers' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-3">Contact</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Dosha Quiz Result</th>
                <th className="py-3.5 px-3">Orders Placed</th>
                <th className="py-3.5 px-3">Lifetime Spend</th>
                <th className="py-3.5 px-3">Tier</th>
                <th className="py-3.5 px-4 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => {
                const defaultAddr = c.addresses.find((a) => a.isDefault) || c.addresses[0];

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer Avatar & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            c.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              c.fullName
                            )}&background=062417&color=e6c364`
                          }
                          alt={c.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{c.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center text-slate-700 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span className="truncate max-w-[150px]">{c.email}</span>
                      </div>
                      <div className="flex items-center text-slate-500 text-[10px] mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-800 font-medium">
                        {defaultAddr ? `${defaultAddr.city}, ${defaultAddr.state}` : 'India'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {defaultAddr ? defaultAddr.pincode : ''}
                      </div>
                    </td>

                    {/* Ayurvedic Dosha */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1 w-fit">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{c.doshaQuizResult || 'Pitta'}</span>
                      </span>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {c.totalOrders} order{c.totalOrders !== 1 ? 's' : ''}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-3 font-bold text-emerald-800">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>

                    {/* Tier / Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'VIP'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingCustomer(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Slide-over / Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    viewingCustomer.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      viewingCustomer.fullName
                    )}&background=062417&color=e6c364`
                  }
                  alt={viewingCustomer.fullName}
                  className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{viewingCustomer.fullName}</h3>
                  <p className="text-xs text-emerald-300">
                    Customer since {viewingCustomer.registeredDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Top Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Lifetime Spend</p>
                  <p className="text-base font-bold text-emerald-800">
                    ₹{viewingCustomer.totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Orders Placed</p>
                  <p className="text-base font-bold text-slate-900">
                    {viewingCustomer.totalOrders}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-medium">Dosha Quiz</p>
                  <p className="text-xs font-bold text-amber-700">
                    {viewingCustomer.doshaQuizResult || 'Pitta'}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                  Contact Information
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-800">{viewingCustomer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-semibold text-slate-800">{viewingCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Saved Shipping Addresses */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                  Saved Delivery Addresses ({viewingCustomer.addresses.length})
                </h4>
                <div className="space-y-2">
                  {viewingCustomer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {addr.label} {addr.isDefault && '· Default'}
                        </span>
                        <span className="text-[10px] text-slate-500">{addr.phone}</span>
                      </div>
                      <p className="text-slate-600 text-xs">{addr.addressLine}</p>
                      <p className="text-slate-500 text-[11px]">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Register New Customer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Radhika Krishnan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Dosha Quiz Profile</label>
                <select
                  value={doshaQuizResult}
                  onChange={(e) => setDoshaQuizResult(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Vata">Vata (Air & Space)</option>
                  <option value="Pitta">Pitta (Fire & Water)</option>
                  <option value="Kapha">Kapha (Earth & Water)</option>
                  <option value="Pitta-Vata">Pitta-Vata Dual</option>
                  <option value="Tridoshic (Balanced)">Tridoshic (Balanced)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Delivery Address</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Flat 101, Green Woods"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
