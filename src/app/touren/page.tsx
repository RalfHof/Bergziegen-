'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { touren } from '@/data/touren';
import { supabase } from '@/lib/supabase';
import { getAverageRating } from '@/utils/feedbackUtils';

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

  // ⭐ Bewertungen laden
  useEffect(() => {
    const loadRatings = async () => {
      const results: Record<number, number> = {};
      for (const tour of touren) {
        const avg = await getAverageRating(tour.id);
        results[tour.id] = avg;
      }
      setRatings(results);
    };
    loadRatings();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Lade Touren...</p>;
  }

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
              <h2 className={styles.title}>
                {tour.name}{' '}
                {ratings[tour.id] ? (
                  <span style={{ fontSize: '0.9rem', color: 'gold' }}>
                    ⭐ {ratings[tour.id].toFixed(1)}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'lightgray' }}>
                    (Noch keine Bewertung)
                  </span>
                )}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
