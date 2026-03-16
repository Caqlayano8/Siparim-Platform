'use client';

import { useState } from 'react';

const PERIODS = [
  { id: 'today', label: 'Bugün' },
  { id: 'week', label: 'Bu Hafta' },
  { id: 'month', label: 'Bu Ay' },
  { id: 'year', label: 'Bu Yıl' },
];

const STATS_BY_PERIOD: Record<string, { revenue: number; orders: number; avgOrder: number; commission: number; net: number; dailyData: { date: string; revenue: number; orders: number }[] }> = {
  today: { revenue: 2847, orders: 23, avgOrder: 123.8, commission: 284.7, net: 2562.3, dailyData: [] },
  week: { revenue: 18430, orders: 156, avgOrder: 118.1, commission: 1843, net: 16587, dailyData: [
    { date: 'Pzt', revenue: 2100, orders: 18 },
    { date: 'Sal', revenue: 2800, orders: 23 },
    { date: 'Çar', revenue: 1950, orders: 16 },
    { date: 'Per', revenue: 3200, orders: 27 },
    { date: 'Cum', revenue: 2900, orders: 24 },
    { date: 'Cmt', revenue: 3480, orders: 29 },
    { date: 'Paz', revenue: 2000, orders: 19 },
  ]},
  month: { revenue: 72400, orders: 612, avgOrder: 118.3, commission: 7240, net: 65160, dailyData: [] },
  year: { revenue: 843200, orders: 7124, avgOrder: 118.4, commission: 84320, net: 758880, dailyData: [] },
};

export default function EarningsPage() {
  const [period, setPeriod] = useState('week');
  const stats = STATS_BY_PERIOD[period];

  const STAT_CARDS = [
    { label: 'Toplam Gelir', value: `₺${stats.revenue.toLocaleString('tr-TR')}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sipariş Sayısı', value: stats.orders.toString(), icon: '🛒', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ort. Sipariş', value: `₺${stats.avgOrder.toFixed(2)}`, icon: '📊', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Komisyon (%10)', value: `₺${stats.commission.toLocaleString('tr-TR')}`, icon: '🏦', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const maxRevenue = Math.max(...(stats.dailyData.map((d) => d.revenue) || [1]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Kazanç Raporu</h2>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                period === p.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} text-xl mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Net earnings highlight */}
      <div className="bg-gradient-to-r from-primary to-orange rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Net Kazanç ({PERIODS.find((p) => p.id === period)?.label})</p>
            <p className="text-4xl font-black mt-1">₺{stats.net.toLocaleString('tr-TR')}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Ödeme Günü</p>
            <p className="font-bold">Her Pazartesi</p>
            <p className="text-xs text-white/60 mt-0.5">Banka hesabınıza</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {stats.dailyData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-5">Günlük Gelir</h3>
          <div className="flex items-end gap-4 h-48">
            {stats.dailyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{day.revenue >= 1000 ? `${(day.revenue / 1000).toFixed(1)}k` : day.revenue}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-orange rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ height: `${(day.revenue / maxRevenue) * 140}px` }}
                    title={`${day.revenue} ₺ · ${day.orders} sipariş`}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Ödeme Özeti</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'Brüt Gelir', value: `₺${stats.revenue.toLocaleString('tr-TR')}`, positive: true },
            { label: 'Siparim Komisyonu (%10)', value: `-₺${stats.commission.toLocaleString('tr-TR')}`, positive: false },
            { label: 'Teslimat Ücretleri', value: '+₺0', positive: true, note: 'Teslimat ücretleri müşteriye aittir' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">{row.label}</p>
                {row.note && <p className="text-xs text-gray-400">{row.note}</p>}
              </div>
              <span className={`font-bold ${row.positive ? 'text-green-600' : 'text-red-500'}`}>{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
            <span className="font-black text-gray-800">Net Kazanç</span>
            <span className="font-black text-primary text-lg">₺{stats.net.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Payment history mock */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Ödeme Geçmişi</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { date: '15 Ocak 2025', amount: 16200, status: 'paid' },
            { date: '8 Ocak 2025', amount: 14800, status: 'paid' },
            { date: '1 Ocak 2025', amount: 12400, status: 'paid' },
          ].map((payment, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="font-medium text-sm text-gray-700">{payment.date}</p>
                <p className="text-xs text-gray-400">Haftalık ödeme</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">₺{payment.amount.toLocaleString('tr-TR')}</span>
                <span className="badge bg-green-100 text-green-700 text-xs">✅ Ödendi</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
