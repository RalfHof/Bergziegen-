// src/app/chat/aktuell/page.tsx
// Dieser Code ist korrekt, importiert './page.module.css'

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox'; // Importiert deine ChatBox Komponente
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './page.module.css'; // <-- Importiert das CSS-Modul in diesem Ordner


export default function ChatPage() {
  const router = useRouter();
  // Wir brauchen nicht unbedingt isLoggedIn hier im State,
  // die ChatBox selbst pr\u00FCft den Anmeldestatus.
  // Wir k\u00F6nnen hier einfach pr\u00FCfen, ob eine Session existiert, um weiterzuleiten.
  const [loading, setLoading] = useState(true); // Ladezustand f\u00FCr die Session-Pr\u00FCfung

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

    // Optional: Auf Anmelde-\u00C4nderungen auf dieser Seite reagieren (Logout etc.)
     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       if (!session && event === 'SIGNED_OUT') {
         // Wenn Benutzer sich abmeldet, w\u00E4hrend er auf dieser Seite ist
         router.push('/login');
       }
     });

     return () => {
       authListener?.subscription.unsubscribe();
     };


  }, [router]); // Abh\u00E4ngigkeit von router, da es im Effect verwendet wird

  // Zeige "Lade..." oder leite um, bis die Session gepr\u00FCft ist
  if (loading) {
     return <p className={styles.loading}>Lade Chat...</p>;
  }

  // Wenn loading false ist und keine Umleitung stattfand, bedeutet das, eine Session wurde gefunden.
  // Jetzt die ChatBox rendern.

  return (
    <div className={styles.chatContainer}> {/* Verwendet Klasse aus page.module.css */}
      <h1 className={styles.chatTitle}>⛰️ Bergziegen Chat 🐐</h1> {/* Verwendet Klasse aus page.module.css */}
      <ChatBox /> {/* Rendert die ChatBox Komponente */}
    </div>
  );
}