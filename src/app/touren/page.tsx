'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { touren } from '@/data/touren';

export default function TourenPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!isLoggedIn) return null;

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
