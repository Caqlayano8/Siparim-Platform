// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  customer: { label: '👤 Müşteri', color: 'bg-blue-100 text-blue-700' },
  restaurant_owner: { label: '🏪 Restoran Sahibi', color: 'bg-orange-100 text-orange-700' },
  courier: { label: '🛵 Kurye', color: 'bg-green-100 text-green-700' },
  admin: { label: '⚙️ Admin', color: 'bg-purple-100 text-purple-700' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchUsers = () => {
    setLoading(true);
    setError(false);
    adminApi.getAllUsers()
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setError(true); toast.error('Kullanıcılar yüklenemedi.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      if (!name.includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Kullanıcılar</h2>
        <div className="flex gap-2">
          <input
            className="input-field text-sm py-2.5 w-48"
            placeholder="Ad veya e-posta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field text-sm py-2.5 w-44" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tüm Roller</option>
            <option value="customer">Müşteri</option>
            <option value="restaurant_owner">Restoran Sahibi</option>
            <option value="courier">Kurye</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="p-12 text-center">
            <span className="text-5xl">⚠️</span>
            <p className="text-lg font-semibold text-gray-600 mt-3">Bağlantı hatası</p>
            <p className="text-sm text-gray-400 mt-1">Sunucu yanıt vermiyor.</p>
            <button onClick={fetchUsers} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">🔄 Tekrar Dene</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Kullanıcı</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">E-posta</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Telefon</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Rol</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const roleInfo = ROLE_LABELS[user.role] ?? { label: user.role, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {(user.firstName ?? user.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3.5 text-gray-500">{user.phone ?? '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`badge text-xs ${roleInfo.color}`}>{roleInfo.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl">👥</span>
                <p className="mt-2">Kullanıcı bulunamadı.</p>
              </div>
            )}
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-500">{filtered.length} kullanıcı</div>
      </div>
    </div>
  );
}
