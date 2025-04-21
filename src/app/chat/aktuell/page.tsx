'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (isLoggedIn === null) return <p className={styles.loading}>Lade...</p>;
  if (!isLoggedIn) return null;

  return (
    <div className={styles.chatContainer}>
      <h1 className={styles.chatTitle}>🗨️ Aktueller Chat</h1>
      <ChatBox />
    </div>
  );
}
