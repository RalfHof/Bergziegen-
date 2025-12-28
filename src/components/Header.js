'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => setNewMessagesCount((prev) => prev + 1)
      )
      .subscribe();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      supabase.removeChannel(channel);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>🐐 Bergziegen</div>

        {/* Burger Button */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menü öffnen"
        >
          ☰
        </button>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <Link href="/" onClick={closeMenu}>Home</Link>

        {user && (
          <>
            <Link href="/touren" onClick={closeMenu}>Touren</Link>
            <Link href="/geplant" onClick={closeMenu}>Geplante Touren</Link>
            <Link href="/chat/aktuell" onClick={closeMenu}>
              Chat
              {newMessagesCount > 0 && (
                <span className={styles.badge}>{newMessagesCount}</span>
              )}
            </Link>
            <Link href="/kalender" onClick={closeMenu}>Kalender</Link>
          </>
        )}

        {!loading && user ? (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" onClick={closeMenu}>Login</Link>
            <Link href="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
