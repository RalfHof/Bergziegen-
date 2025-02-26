import Link from 'next/link';
import styles from './page.module.css';

const tours = [
    { id: 1, name: 'Tour 1', image: '/tour1.jpg', info: 'Info Tour 1', komootLink: 'https://www.komoot.de/...' },
    { id: 2, name: 'Tour 2', image: '/tour2.jpg', info: 'Info Tour 2', komootLink: 'https://www.komoot.de/...' },
    { id: 3, name: 'Tour 2', image: '/tour2.jpg', info: 'Info Tour 3', komootLink: 'https://www.komoot.de/...' },
    { id: 4, name: 'Tour 2', image: '/tour2.jpg', info: 'Info Tour 4', komootLink: 'https://www.komoot.de/...' },
    { id: 5, name: 'Tour 2', image: '/tour2.jpg', info: 'Info Tour 5', komootLink: 'https://www.komoot.de/...' },
    { id: 6, name: 'Tour 2', image: '/tour2.jpg', info: 'Info Tour 6', komootLink: 'https://www.komoot.de/...' },
    
    // ... füge weitere Touren hinzu ...
];

export default function Touren() {
    return (
        <div className={styles.container}>
            <h1>Unsere Touren</h1>
            {tours.map(tour => (
                <div key={tour.id} className={styles.tourContainer}>
                    <img src={tour.image} alt={tour.name} className={styles.tourImage} />
                    <div className={styles.tourInfo}>
                        <h2>{tour.name}</h2>
                        <p>{tour.info}</p>
                        <Link href={`/touren/${tour.id}`} className={styles.detailsLink}>Details</Link>
                        <a href={tour.komootLink} target="_blank" rel="noopener noreferrer" className={styles.komootLink}>Komoot</a>
                    </div>
                </div>
            ))}
        </div>
    );
}