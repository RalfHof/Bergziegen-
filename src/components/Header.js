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

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          🐐 Bergziegen
        </Link>

        {/* Desktop Navigation */}
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

        {/* Burger Button mobile */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`}></div>
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`}></div>
          <div className={`${styles.bar} ${menuOpen ? styles.open : ""}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className={styles.navMobile}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
          <Link href="/touren" onClick={() => setMenuOpen(false)}>Touren</Link>
          <Link href="/geplant" onClick={() => setMenuOpen(false)}>Geplante Touren</Link>
          <Link href="/kalender" onClick={() => setMenuOpen(false)}>Kalender</Link>
          <Link href="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>Über uns</Link>

          {user ? (
            <button
              className={styles.logoutBtn}
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </nav>
      )}
    </header>
  );
}
