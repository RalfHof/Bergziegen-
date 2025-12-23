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

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace('/login');
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Lade…</p>;

  return (
    <div className={styles.container}>
      {touren.map((tour) => (
        <Link key={tour.id} href={`/touren/${tour.id}`}>
          <Image
            src={tour.images?.[0] ?? '/placeholder.jpg'}
            alt={tour.name}
            width={150}
            height={150}
          />
          <h2>{tour.name}</h2>
        </Link>
      ))}
    </div>
  );
}
