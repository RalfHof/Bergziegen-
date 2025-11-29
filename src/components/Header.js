"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Schließt Menü beim Navigieren
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          🐐 Bergziegen
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className={styles.navDesktop}>
          <Link href="/">Start</Link>
          <Link href="/touren">Touren</Link>
          <Link href="/geplant">Geplante Touren</Link>
          <Link href="/kalender">Kalender</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/about">Über uns</Link>

          {user ? (
            <button onClick={logout} className={styles.logoutBtn}>
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>

        {/* BURGER BUTTON */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`} />
        </button>
      </div>

      {/* MOBILE-MENÜ */}
      <nav className={`${styles.navMobile} ${menuOpen ? styles.navMobileOpen : ""}`}>
        <Link href="/" onClick={closeMenu}>Start</Link>
        <Link href="/touren" onClick={closeMenu}>Touren</Link>
        <Link href="/geplant" onClick={closeMenu}>Geplante Touren</Link>
        <Link href="/kalender" onClick={closeMenu}>Kalender</Link>
        <Link href="/chat" onClick={closeMenu}>Chat</Link>
        <Link href="/about" onClick={closeMenu}>Über uns</Link>

        {user ? (
          <button
            className={styles.logoutBtn}
            onClick={() => {
              closeMenu();
              logout();
            }}
          >
            Logout
          </button>
        ) : (
          <Link href="/login" onClick={closeMenu}>Login</Link>
        )}
      </nav>
    </header>
  );
}
