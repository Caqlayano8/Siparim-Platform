// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';
import { useState } from 'react';
import CookieConsent from './CookieConsent';
import PrivacySettingsModal from './PrivacySettingsModal';
import CourierBanner from './CourierBanner';
import LiveSupport from './LiveSupport';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  
  return (
    <>
      <CourierBanner />
      {children}
      <CookieConsent onOpenPrivacySettings={() => setPrivacyOpen(true)} />
      <PrivacySettingsModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <LiveSupport />
    </>
  );
}
