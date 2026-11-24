import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    products,
    customers,
    orders,
    coupons,
    media,
    resetToDefaults,
    exportDatabase,
    importDatabase,
    showToast,
  } = useDashboard();

  const [importJsonText, setImportJsonText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importDatabase(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Store Settings & Database Backup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage brand credentials, license parameters, and export/import store databases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand & Regulatory Identity (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" /> Brand & Business Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Brand Name</label>
                <input
                  type="text"
                  readOnly
                  value="VEDAYU AMRIT"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Legal Entity</label>
                <input
                  type="text"
                  readOnly
                  value="Vedayu Amrit Wellness Private Limited"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">AYUSH Drug License No</label>
                <input
                  type="text"
                  readOnly
                  value="DL-AYUSH-KA-104928/2024"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-800 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">GSTIN Registration</label>
                <input
                  type="text"
                  readOnly
                  value="29AABCV9918K1Z5"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">GMP Quality Certification</label>
                <input
                  type="text"
                  readOnly
                  value="GMP/AY/IND/8849 (Charaka Grade)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Central Warehouse Address</label>
                <input
                  type="text"
                  readOnly
                  value="Ayush Park, Indiranagar, Bengaluru - 560038"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Primary currency: Indian Rupee (₹ INR) · Tax inclusive catalog</span>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                <span>Preview Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Database Backup & Export */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" /> Export & Backup Database
            </h3>
            <p className="text-xs text-slate-600">
              Download your complete store records including all {products.length} products, {customers.length} registered customers, {orders.length} orders, {coupons.length} coupons, and media assets in a standard JSON backup file.
            </p>

            <button
              onClick={exportDatabase}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Store Backup (.json)</span>
            </button>
          </div>
        </div>

        {/* Restore & Danger Zone (1 col) */}
        <div className="space-y-6">
          {/* Import / Restore JSON */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" /> Restore Database
            </h3>
            <p className="text-slate-600">
              Upload a previously exported Vedayu Amrit JSON backup file to restore catalog, customers, and orders.
            </p>

            <label className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-emerald-700 mb-1" />
              <span className="font-bold text-emerald-900">Choose JSON Backup File</span>
              <span className="text-[10px] text-emerald-700">.json files only</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-rose-800 font-bold">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Store Database</span>
            </div>
            <p className="text-slate-600">
              Clear your custom edits and restore the factory catalog of 46 authentic Ayurvedic products and sample demo orders.
            </p>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl transition-colors"
              >
                Reset to Default Catalog
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-rose-800 font-bold">Are you sure?</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
