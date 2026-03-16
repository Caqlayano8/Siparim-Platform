'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type Role = 'customer' | 'restaurant_owner' | 'courier';

const ROLES: { value: Role; label: string; icon: string; desc: string }[] = [
  { value: 'customer', label: 'Müşteri', icon: '🛍️', desc: 'Sipariş vermek istiyorum' },
  { value: 'restaurant_owner', label: 'Restoran', icon: '🏪', desc: 'Restoranımı eklemek istiyorum' },
  { value: 'courier', label: 'Kurye', icon: '🛵', desc: 'Teslimat yapmak istiyorum' },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [role, setRole] = useState<Role>((searchParams.get('role') as Role) || 'customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Şifreler eşleşmiyor.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (!agreed) {
      toast.error('Kullanım koşullarını kabul etmelisiniz.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({ ...form, role });
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success('Hesabınız oluşturuldu! 🎉');
      if (role === 'restaurant_owner') router.push('/restaurant-panel');
      else if (role === 'courier') router.push('/profile');
      else router.push('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Kayıt sırasında bir hata oluştu.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-[#c0110e] to-[#8b0000] text-white flex-col items-center justify-center p-12">
        <Link href="/" className="mb-8">
          <h1 className="text-5xl font-black">Sipari<span className="text-orange">m</span></h1>
        </Link>
        <div className="text-7xl mb-4">🍽️</div>
        <h2 className="text-3xl font-bold mb-3 text-center">Aramıza Katıl!</h2>
        <p className="text-white/70 text-center max-w-xs">
          Binlerce restoran, hızlı teslimat ve özel indirimlerle dolu bir deneyim seni bekliyor.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/"><h1 className="text-4xl font-black text-primary">Sipari<span className="text-orange">m</span></h1></Link>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-1">Kayıt Ol</h2>
            <p className="text-gray-400 text-sm mb-5">Hesabınızı oluşturun.</p>

            {/* Role selection */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center transition-all ${
                    role === r.value
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className={`text-xs font-semibold ${role === r.value ? 'text-primary' : 'text-gray-600'}`}>
                    {r.label}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                  <input
                    className="input-field"
                    placeholder="Ahmet Yılmaz"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">E-posta</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="ornek@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefon</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="05XX XXX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Şifre</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="Minimum 6 karakter"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input-field ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400' : ''}`}
                    placeholder="Şifrenizi tekrar girin"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Şifreler eşleşmiyor.</p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-xs text-gray-500">
                  <Link href="/terms" className="text-primary hover:underline">Kullanım Koşulları</Link> ve{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Gizlilik Politikası</Link>&apos;nı
                  okudum ve kabul ediyorum.
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Kayıt yapılıyor...
                  </span>
                ) : (
                  'Hesap Oluştur'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Giriş Yap</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
