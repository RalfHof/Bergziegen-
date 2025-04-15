// src/components/Header.js
import Link from 'next/link';
import styles from './Header.module.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Bergziegen Logo" width={50} height={50} />
        <span>Bergziegen</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/touren">Touren</Link>
        <Link href="/Chat/Aktuell">Chat/Aktuell</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  );
}
