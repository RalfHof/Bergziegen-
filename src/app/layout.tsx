'use client';

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Footer nur auf der Startseite sichtbar
  const showFooter = pathname === '/';

  return (
    <html lang="de">
      <body className="site-wrapper">
        <SessionProvider>
          <Header />
          <main>{children}</main>
          {showFooter && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
}
