'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(false);

      if (!session) {
        router.push('/login');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <p className={styles.loading}>Lade Chat...</p>;
  }

  return (
    <main className={styles.heroBackground}>
      <div className={styles.chatWrapper}>
        <h1 className={styles.chatTitle}>⛰️ Bergziegen Chat 🐐</h1>
        <ChatBox />
      </div>
    </main>
  );
}
