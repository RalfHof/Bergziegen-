'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { touren } from '@/data/touren'; // Pfad sicherstellen
import { supabase } from '@/lib/supabase'; // Supabase importieren

export default function TourenPage() {
  const router = useRouter();
  // Wir brauchen nicht unbedingt isLoggedIn im State,
  // wir können direkt auf Basis der Session prüfen.
  const [loading, setLoading] = useState(true); // Ladezustand für die Session-Prüfung

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setLoading(false); // Ladezustand beenden

      if (!session) {
        // Keine Supabase Session gefunden, weiterleiten zum Login
        router.push('/login');
      }
      // Wenn eine Session existiert, wird die Komponente einfach gerendert.
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
     return <p className={styles.loading}>Lade Touren...</p>;
  }

  // Wenn loading false ist und keine Umleitung stattfand, bedeutet das, eine Session wurde gefunden.
  // Jetzt die Touren-Liste rendern.

  return (
    <div className={styles.container}>
      {touren.map((tour) => (
        <Link key={tour.id} href={`/touren/${tour.id}`} className={styles.link}>
          <div className={styles.tourCard}>
            <Image
              src={tour.images[0]}
              alt={tour.name}
              width={150}
              height={100}
              className={styles.image}
            />
            <div className={styles.info}>
              <h2 className={styles.title}>{tour.name}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}