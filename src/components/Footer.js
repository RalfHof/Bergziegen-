import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.column}>
                <h4>Information</h4>
                <Link href="/faq" className={styles.link}>FAQ</Link>
            </div>
            <div className={styles.column}>
                <h4>Kontakt</h4>
                <Link href="/legal/impressum" className={styles.link}>Impressum</Link>
                <Link href="/legal/datenschutz" className={styles.link}>Datenschutz</Link>
                
            </div>
        </footer>
    );
}