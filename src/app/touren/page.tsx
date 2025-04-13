import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { touren } from '@/data/touren';

export default function TourenPage() {
  return (
    <div className={styles.container}>
      {touren.map((tour) => (
        <Link key={tour.id} href={`/touren/${tour.id}`} className={styles.link}>
          <div className={styles.tourCard}>
            <Image
              src={tour.images[0]} // Korrigiert: von tour.bilder zu tour.images
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