import React, { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error, isLoading }) => {
  const [email, setEmail] = useState('admin@vedayuamrit.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    try {
      await onLogin(email, password);
    } catch (loginFailure) {
      setLoginError(
        loginFailure instanceof Error ? loginFailure.message : 'Sign in failed. Please try again.',
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#04160d] via-[#092b1b] to-[#0d3d28] flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 sm:p-10 shadow-2xl shadow-black/30">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Vedayu Amrit</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to the management dashboard.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                autoComplete="off"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                placeholder="admin@example.com"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                placeholder="Enter your password"
              />
            </span>
          </label>

          {(loginError || error) && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loginError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by server-validated authentication
        </p>
      </section>
    </main>
  );
};
