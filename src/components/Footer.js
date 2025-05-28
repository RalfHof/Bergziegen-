// components/Footer.js
// Komplette Version OHNE Ziegenbild

import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Ziegenbild wurde HIER entfernt und in page.tsx verschoben */}

      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Navigation</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/touren">Touren</Link></li>
            <li><Link href="/kalender">Kalender</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Rechtliches</h3>
          <ul>
            <li><Link href="/legal/datenschutz">Datenschutz</Link></li>
            <li><Link href="/legal/impressum">Impressum</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Kontakt & Info</h3>
          <ul>
            <li><Link href="/ueber-uns">Über uns</Link></li>
            <li><Link href="/kontakt">Kontakt</Link></li>
          </ul>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Bergziegen - Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}