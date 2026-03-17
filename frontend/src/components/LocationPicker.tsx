// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';
import { useState, useEffect } from 'react';
import { TURKEY_CITIES } from '@/data/turkey-cities';

interface LocationPickerProps {
  onLocationChange?: (city: string, district: string) => void;
  className?: string;
}

export default function LocationPicker({ onLocationChange, className = '' }: LocationPickerProps) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [locating, setLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const cityData = TURKEY_CITIES.find(c => c.name === selectedCity);

  useEffect(() => {
    const saved = localStorage.getItem('siparim_location');
    if (saved) {
      try {
        const { city, district } = JSON.parse(saved);
        setSelectedCity(city || '');
        setSelectedDistrict(district || '');
      } catch {}
    }
  }, []);

  const handleSave = () => {
    if (selectedCity) {
      localStorage.setItem('siparim_location', JSON.stringify({ city: selectedCity, district: selectedDistrict }));
      onLocationChange?.(selectedCity, selectedDistrict);
      setIsOpen(false);
    }
  };

  const handleGPS = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=tr`
          );
          const data = await res.json();
          const province = data.address?.province || data.address?.state || '';
          const district = data.address?.county || data.address?.suburb || '';

          const normalizedProvince = province.replace(' İl Özel İdaresi', '').replace(' İli', '').trim();
          const foundCity = TURKEY_CITIES.find(c =>
            c.name.toLowerCase() === normalizedProvince.toLowerCase() ||
            normalizedProvince.toLowerCase().includes(c.name.toLowerCase())
          );

          if (foundCity) {
            setSelectedCity(foundCity.name);
            const foundDistrict = foundCity.districts.find(d =>
              district.toLowerCase().includes(d.toLowerCase()) ||
              d.toLowerCase().includes(district.toLowerCase())
            );
            if (foundDistrict) setSelectedDistrict(foundDistrict);
          }
        } catch {
          // reverse geocoding başarısız
        } finally {
          setLocating(false);
        }
      },
      () => {
        alert('Konum alınamadı. Lütfen manuel seçin.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const displayText = selectedCity
    ? `${selectedCity}${selectedDistrict ? ', ' + selectedDistrict : ''}`
    : 'Konum Seç';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary transition-colors max-w-[160px]"
      >
        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate font-medium">{displayText}</span>
        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in">
          <p className="font-bold text-gray-800 mb-3 text-sm">📍 Konumunuzu Seçin</p>

          <button
            onClick={handleGPS}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary/10 text-primary font-semibold text-sm rounded-xl hover:bg-primary/20 transition-colors mb-3 disabled:opacity-60"
          >
            {locating ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            )}
            {locating ? 'Konum alınıyor...' : 'GPS ile Konumumu Bul'}
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 border-t border-gray-200"/>
            <span className="text-xs text-gray-400">veya manuel seç</span>
            <div className="flex-1 border-t border-gray-200"/>
          </div>

          <div className="mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">İl</label>
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(''); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-gray-50"
            >
              <option value="">İl seçin...</option>
              {TURKEY_CITIES.slice().sort((a, b) => a.name.localeCompare(b.name, 'tr')).map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {cityData && (
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">İlçe</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-gray-50"
              >
                <option value="">Tüm ilçeler</option>
                {cityData.districts.slice().sort((a, b) => a.localeCompare(b, 'tr')).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button onClick={() => setIsOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">İptal</button>
            <button onClick={handleSave} disabled={!selectedCity} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover disabled:opacity-50">Uygula</button>
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
