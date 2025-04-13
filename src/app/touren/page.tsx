import Link from 'next/link';
import Image from 'next/image';
import { touren } from '@/data/touren';
import styles from './page.module.css';


export default function TourenPage() {
    return (
        <div className={styles.container}>
            <h1>Unsere Touren</h1>
            <div className={styles.list}>
                {touren.map((tour) => (
                    <div key={tour.id} className={styles.card}>
                        <Link href={`/touren/${tour.id}`}>
                            <Image
                                src={tour.images[0]}
                                alt={tour.title}
                                width={300}
                                height={200}
                                className={styles.image}
                            />
                        </Link>
                        <div className={styles.title}>{tour.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
