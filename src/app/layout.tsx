import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

import '@/assets/reset.scss';
import '@/assets/global.scss';

import ToastContainer from '@/components/common/toast/ToastContainer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'LoaM',
  description: 'Lost Ark checklist and character memo app',
  applicationName: 'LoaM',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'LoaM',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/brand/loam-app-icon-source-centered.png',
    apple: '/brand/loam-app-icon-source-centered.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>
        <ServiceWorkerRegister />

        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
