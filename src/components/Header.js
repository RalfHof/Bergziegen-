'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>🐐 Bergziegen</div>
            <nav className={styles.nav}>
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/touren" className={styles.link}>Touren</Link>
                <Link href="/login" className={styles.link}>Login</Link>
                <Link href="/register" className={styles.link}>Register</Link>
            </nav>
        </header>
    );
}
