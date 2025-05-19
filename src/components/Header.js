import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
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

  return (
    <header className={styles.header}>
      <div className={styles.logo}>🐐 Bergziegen</div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/touren">Touren</Link>
        <Link href="/chat/aktuell">
          Chat
          {newMessagesCount > 0 && (
            <span className={styles.badge}>{newMessagesCount}</span>
          )}
        </Link>
        <Link href="/kalender">Kalender</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  );
}
