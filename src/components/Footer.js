'use client';

import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Navigation</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/touren">Touren</Link></li>
            <li><Link href="/geplant">Geplante Touren</Link></li>

            <li><Link href="/kalender">Kalender</Link></li>
            {!user ? (
              <>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Rechtliches</h3>
          <ul>
            <li><Link href="/legal/datenschutz">Datenschutz</Link></li>
            <li><Link href="/legal/impressum">Impressum</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Kontakt & Info</h3>
          <ul>
            <li><Link href="/ueber-uns">Über uns</Link></li>
            <li><Link href="/kontakt">Kontakt</Link></li>
          </ul>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Bergziegen - Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}


