"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Neu
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      console.error('Supabase Login Fehler:', error.message);
      setError(`Login fehlgeschlagen: ${error.message}`);
    } else if (data.user) {
      alert('Login erfolgreich!');
      router.push('/touren');
    } else {
      setError('Login fehlgeschlagen: Benutzerdaten ungültig oder nicht bestätigt.');
    }
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
          className={styles.input}
          disabled={loading}
        />

        <input
          type={showPassword ? 'text' : 'password'} // 👈 Sichtbar oder verborgen
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />

        <div className={styles.togglePassword}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Passwort anzeigen</label>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logge ein...' : 'Einloggen'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
