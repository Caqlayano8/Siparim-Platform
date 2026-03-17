// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, Suspense } from 'react';
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
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [role, setRole] = useState<Role>((searchParams.get('role') as Role) || 'customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

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
    if (!kvkkAccepted) {
      toast.error('KVKK aydınlatma metnini onaylamanız gerekmektedir.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({ ...form, role });
      const { user, token, accessToken } = res.data;
      const authToken = token || accessToken;
      setAuth(user, authToken);
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

            {/* Social auth buttons */}
            <div className="space-y-3 mb-6">
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile Kayıt Ol
              </a>
              <a
                href="/api/auth/facebook"
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook ile Kayıt Ol
              </a>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">veya e-posta ile</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

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

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-primary"
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                />
                <span className="text-xs text-gray-500">
                  <Link href="/kvkk" className="text-primary hover:underline">KVKK Aydınlatma Metni</Link>&apos;ni okudum, kişisel verilerimin işlenmesine onay veriyorum.
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
