import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Siparim – Yemeğin Kapında',
  description:
    'Türkiye\'nin en hızlı yemek siparişi platformu. Yakınındaki restoranlardan sipariş ver, kapına gelsin.',
  keywords: 'yemek sipariş, yemek teslimat, online yemek, siparim',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Siparim – Yemeğin Kapında 🍔',
    description: 'Yakınındaki restoranlardan sipariş ver, kapına gelsin.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#1a1a1a',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#e8231a', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#e8231a', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
