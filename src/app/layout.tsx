// src/app/layout.tsx

import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bergziegen',
    description: 'Wandergruppe Bergziegen',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
