'use client';

import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooter = pathname === '/';

  return (
    <html lang="de">
      <body className="site-wrapper">
        <Header />
        <main>{children}</main>
        {showFooter && <Footer />}
      </body>
    </html>
  );
}
