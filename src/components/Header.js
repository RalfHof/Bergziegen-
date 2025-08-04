'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    getSession();

    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          setNewMessagesCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>🐐 Bergziegen</div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/touren">Touren</Link>
        <Link href="/geplant">Geplante Touren</Link>

        <Link href="/chat/aktuell">
          Chat
          {newMessagesCount > 0 && (
            <span className={styles.badge}>{newMessagesCount}</span>
          )}
        </Link>
        <Link href="/kalender">Kalender</Link>

        {!loading && user ? (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
