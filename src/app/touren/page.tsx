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
  const [averages, setAverages] = useState<Record<number, number>>({});

  useEffect(() => {
    const initPage = async () => {
      // 1. Session prüfen (für Handy-Login Sicherheit)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }

      // 2. Alle Bewertungen laden, um Durchschnitt zu berechnen
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('tour_id, rating');

      if (feedbackData) {
        const counts: Record<number, { sum: number; count: number }> = {};
        feedbackData.forEach((f) => {
          if (!counts[f.tour_id]) counts[f.tour_id] = { sum: 0, count: 0 };
          counts[f.tour_id].sum += f.rating;
          counts[f.tour_id].count += 1;
        });

        const calculatedAvgs: Record<number, number> = {};
        Object.keys(counts).forEach((id) => {
          const tourId = Number(id);
          calculatedAvgs[tourId] = counts[tourId].sum / counts[tourId].count;
        });
        setAverages(calculatedAvgs);
      }

      setLoading(false);
    };

    initPage();
  }, [router]);

  if (loading) return <p className={styles.loading}>Lade Touren und Bewertungen…</p>;

  return (
    <div className={styles.container}>
      {touren.map((tour) => {
        const previewImage = tour.images?.[0] ?? '/placeholder.jpg';
        const avg = averages[tour.id];

        return (
          <Link key={tour.id} href={`/touren/${tour.id}`} className={styles.link}>
            <article className={styles.tourCard}>
              <Image
                src={previewImage}
                alt={tour.name}
                width={150}
                height={100}
                className={styles.image}
              />
              <div className={styles.info}>
                <h3 className={styles.title}>
                  {tour.name}
                  {avg ? (
                    <span className={styles.avgRating}> ★ {avg.toFixed(1)}</span>
                  ) : (
                    <span className={styles.noRating}> (—)</span>
                  )}
                </h3>
                <p className={styles.short}>
                  {tour.shortDescription || (tour.description.substring(0, 80) + "...")}
                </p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}