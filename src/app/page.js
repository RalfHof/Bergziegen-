import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <h1>Die Bergziegen</h1>
            <p>Willkommen bei unserer Wandergruppe, den Bergziegen. Wir lieben es, die Natur zu erkunden und neue Abenteuer zu erleben. Begleite uns auf unseren Touren und entdecke die Schönheit der Berge!</p>
            <Link href="/touren" className={styles.tourLink}>Unsere Touren ansehen</Link>
        </div>
    );
}