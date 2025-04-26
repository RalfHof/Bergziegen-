'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  // Wir brauchen nicht unbedingt isLoggedIn hier im State,
  // die ChatBox selbst prüft den Anmeldestatus.
  // Wir können hier einfach prüfen, ob eine Session existiert, um weiterzuleiten.
  const [loading, setLoading] = useState(true); // Ladezustand für die Session-Prüfung

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setLoading(false); // Ladezustand beenden

      if (!session) {
        // Keine Supabase Session gefunden, weiterleiten zum Login
        router.push('/login');
      }
      // Wenn eine Session existiert, wird die Komponente einfach gerendert und die ChatBox holt sich die UserID
    };

    checkSession();

    // Optional: Auf Anmelde-Änderungen auf dieser Seite reagieren (Logout etc.)
     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       if (!session && event === 'SIGNED_OUT') {
         // Wenn Benutzer sich abmeldet, während er auf dieser Seite ist
         router.push('/login');
       }
     });

     return () => {
       authListener?.subscription.unsubscribe();
     };


  }, [router]); // Abhängigkeit von router, da es im Effect verwendet wird

  // Zeige "Lade..." oder leite um, bis die Session geprüft ist
  if (loading) {
     return <p className={styles.loading}>Lade Chat...</p>;
  }

  // Wenn loading false ist und keine Umleitung stattfand, bedeutet das, eine Session wurde gefunden.
  // Jetzt die ChatBox rendern.

  return (
    <div className={styles.chatContainer}>
      <h1 className={styles.chatTitle}>⛰️ Bergziegen Chat 🐐</h1>
      <ChatBox /> {/* Rendere die ChatBox */}
    </div>
  );
}