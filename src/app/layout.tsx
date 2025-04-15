// src/app/layout.tsx
import '../styles/globals.css';
import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Bergziegen',
  description: 'Wandergruppe Bergziegen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="site-wrapper">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
