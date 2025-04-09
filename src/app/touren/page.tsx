import { tourenData } from '@/data/touren';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function TourenPage() {
  return (
    <div className={styles.tourenContainer}>
      {tourenData.map((tour) => (
        <div key={tour.id} className={styles.tourItem}>
          <Link href={`/touren/${tour.id}`}>
            <Image
              src={tour.bilder[0]}
              alt={tour.name}
              width={300}
              height={200}
              className={styles.tourImage}
            />
          </Link>
          <h2>{tour.name}</h2>
        </div>
      ))}
    </div>
  );
}
