// src/components/Header.tsx
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>🐐 Bergziegen</div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/touren">Touren</Link>
        <Link href="/kalender">Kalender</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  );
}
