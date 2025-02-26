import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Die Bergziegen" width={50} height={50} priority />
                </Link>
            </div>
            <div className={styles.center}>
                <h1 className={styles.title}>Die Bergziegen</h1>
            </div>
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/touren" className={styles.navLink}>Touren</Link>
                <Link href="/ueber-uns" className={styles.navLink}>Über Uns</Link>
                <Link href="/login" className={styles.navLink}>Login</Link>
                <Link href="/register" className={styles.navLink}>Registrieren</Link>
            </nav>
        </header>
    );
}