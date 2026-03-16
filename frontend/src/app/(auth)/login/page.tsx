'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success(`Hoş geldin, ${user.name}! 🎉`);
      if (user.role === 'restaurant_owner') router.push('/restaurant-panel');
      else if (user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'E-posta veya şifre hatalı.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-[#c0110e] to-[#8b0000] text-white flex-col items-center justify-center p-12">
        <Link href="/" className="mb-12">
          <h1 className="text-5xl font-black">
            Sipari<span className="text-orange">m</span>
          </h1>
        </Link>
        <div className="text-center">
          <div className="text-8xl mb-6">🍔</div>
          <h2 className="text-3xl font-bold mb-3">Yemeğin Kapında</h2>
          <p className="text-white/70 text-lg max-w-xs">
            Binlerce restorandan dilediğini seç, hızlıca kapına gelsin.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-xs text-center">
          {[['🏪', '1.200+', 'Restoran'], ['⚡', '30 dk', 'Teslimat'], ['⭐', '4.8', 'Puan']].map(([icon, val, lbl]) => (
            <div key={lbl} className="bg-white/10 rounded-2xl p-3">
              <div className="text-2xl">{icon}</div>
              <p className="font-bold mt-1">{val}</p>
              <p className="text-xs text-white/60">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-black text-primary">
                Sipari<span className="text-orange">m</span>
              </h1>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-1">Giriş Yap</h2>
            <p className="text-gray-400 text-sm mb-7">Hesabınıza giriş yapın.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  E-posta
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="ornek@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Şifre
                  </label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Giriş yapılıyor...
                  </span>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">veya</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
