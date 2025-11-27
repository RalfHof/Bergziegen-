// app/touren/page.tsx
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

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const res = await fetch('/api/feedback/ratings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Record<string, number>;
        const map: Record<number, number> = {};
        Object.entries(data).forEach(([k, v]) => { map[Number(k)] = Number(v); });
        setRatings(map);
      } catch (err) {
        console.error(err);
      }
    };
    void loadRatings();
  }, []);

  if (loading) return <p className={styles.loading}>Lade Touren...</p>;

  return (
    <div className={styles.container}>
      {touren.map((tour) => {
        const preview = (tour.images && tour.images.length) ? tour.images[0] : '/placeholder.jpg';
        return (
          <Link key={tour.id} href={`/touren/${tour.id}`} className={styles.link}>
            <article className={styles.tourCard}>
              <div className={styles.imageWrap}>
                <Image src={preview} alt={tour.name} width={220} height={140} className={styles.image} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.title}>
                  {tour.name}
                  {ratings[tour.id] ? <span className={styles.avg}>⭐ {ratings[tour.id].toFixed(1)}</span> : <span className={styles.noRating}>(—)</span>}
                </h3>
                <p className={styles.short}>{tour.shortDescription ?? (tour.description.slice(0,140) + '...')}</p>
                <div className={styles.meta}>
                  {tour.distance && <span>{tour.distance}</span>}
                  {tour.duration && <span> • {tour.duration}</span>}
                  {tour.difficulty && <span> • {tour.difficulty}</span>}
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
