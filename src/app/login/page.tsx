"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data?.session) {
      // ✅ WICHTIG: replace, nicht push
      router.replace('/touren');
      return;
    }

    setError('Login fehlgeschlagen.');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className={styles.input}
        />

        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          <span
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '🔒'}
          </span>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Logge ein...' : 'Einloggen'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
