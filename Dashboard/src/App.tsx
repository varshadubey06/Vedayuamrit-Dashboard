import React, { useCallback, useEffect, useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { ProductsTab } from './components/ProductsTab';
import { AddProductTab } from './components/AddProductTab';
import { OrdersTab } from './components/OrdersTab';
import { CustomersTab } from './components/CustomersTab';
import { MediaLibraryTab } from './components/MediaLibraryTab';
import { CouponsTab } from './components/CouponsTab';
import { SettingsTab } from './components/SettingsTab';
import { EditProductModal } from './components/EditProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/Toast';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdminLogin } from './components/AdminLogin';
import { checkAdminSession, loginAdmin, logoutAdmin } from './lib/adminAuth';

const DashboardContent: React.FC<{
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
  authError: string | null;
}> = ({
  onLogout,
  isLoggingOut,
  authError,
}) => {
  const { activeTab } = useDashboard();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all">
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setIsMobileOpen(true)}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          authError={authError}
        />

        {/* Tab Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'add-product' && <AddProductTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'media' && <MediaLibraryTab />}
          {activeTab === 'coupons' && <CouponsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>

        {/* Global Dashboard Footer with Transparent Logo & Viksit Vyapar Agency Credit */}
        <footer className="mt-auto py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Company Logo and Copyright */}
            <div className="flex items-center space-x-3">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 group"
                title="Go to Vedayu Amrit Storefront"
              >
                <img
                  src="/images/vedayu-logo-transparent.png"
                  alt="VEDAYU AMRIT"
                  className="h-7 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </a>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-700">
                © {new Date().getFullYear()} VEDAYU AMRIT Management Portal
              </span>
            </div>

            {/* Middle: Clean & Small Agency Attribution (No 2021) */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <span>Designed &amp; Developed by</span>
              <a
                href="https://viksitvyapar.com"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors"
              >
                Viksit Vyapar
              </a>
            </div>

            {/* Right: Connect to Live Store Button */}
            <div>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors"
                title="Open Customer Storefront"
              >
                <span>Visit Storefront (Port 3000)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Toasts */}
      <EditProductModal />
      <DeleteConfirmModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const verifySession = useCallback(async () => {
    try {
      const authenticated = await checkAdminSession();
      setIsAuthenticated(authenticated);
      setAuthError(null);
    } catch (error) {
      setIsAuthenticated(false);
      setAuthError(error instanceof Error ? error.message : 'Unable to verify your session.');
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    void verifySession();

    const intervalId = window.setInterval(() => {
      void verifySession();
    }, 60_000);
    window.addEventListener('focus', verifySession);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', verifySession);
    };
  }, [verifySession]);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await loginAdmin(email, password);
      setIsAuthenticated(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not sign out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm font-medium text-slate-500">
        Checking admin session…
      </main>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={authError} isLoading={isSubmitting} />;
  }

  return (
    <DashboardProvider>
      <DashboardContent
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        authError={authError}
      />
    </DashboardProvider>
  );
}
