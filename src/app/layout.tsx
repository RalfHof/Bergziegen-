'use client';

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="site-wrapper">
        <SessionProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
