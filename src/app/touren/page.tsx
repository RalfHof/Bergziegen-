'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { touren } from '@/data/touren';
import { supabase } from '@/lib/supabase';

export default function TourenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(false);
      if (!session) {
        router.push('/login');
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Lade alle Durchschnittsbewertungen in einem Request (viel schneller)
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const res = await fetch('/api/feedback/ratings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, number>;
        const map: Record<number, number> = {};
        Object.entries(data).forEach(([k, v]) => {
          map[Number(k)] = Number(v);
        });
        setRatings(map);
      } catch (err) {
        console.error('Fehler beim Laden der Bewertungen:', err);
      }
    };
    void loadRatings();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Lade Touren...</p>;
  }

  return (
    <div className={styles.container}>
      {touren.map((tour) => {
        const previewImage = (tour.images && tour.images.length > 0) ? tour.images[0] : '/placeholder.jpg';
        return (
          <Link key={tour.id} href={`/touren/${tour.id}`} className={styles.link}>
            <div className={styles.tourCard}>
              <Image src={previewImage} alt={tour.name} width={150} height={100} className={styles.image} />
              <div className={styles.info}>
                <h2 className={styles.title}>
                  {tour.name}{' '}
                  {ratings[tour.id] ? (
                    <span className={styles.avgRating}>⭐ {ratings[tour.id].toFixed(1)}</span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'lightgray' }}>(Noch keine Bewertung)</span>
                  )}
                </h2>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#eaf3e6' }}>{tour.shortDescription ?? ''}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
