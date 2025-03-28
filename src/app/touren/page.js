import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { touren } from '@/data/touren';

export default function Touren() {
    return (
        <div className={styles.container}>
            <h1>Unsere Touren</h1>
            {touren.map((tour) => (
                <div key={tour.id} className={styles.tourContainer}>
                    <Image src={tour.images[0]} alt={tour.name} width={300} height={200} className={styles.tourImage} />
                    <div className={styles.tourInfo}>
                        <h2>{tour.name}</h2>
                        <p>{tour.description}</p>
                        <Link href={`/touren/${tour.id}`} className={styles.detailsLink}>Details</Link>
                        <a href={tour.komootLink} target="_blank" rel="noopener noreferrer" className={styles.komootLink}>Komoot</a>
                    </div>
                </div>
            ))}
        </div>
    );
}
