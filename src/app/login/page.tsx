"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './Login.module.css'; // Oder der korrekte Pfad zu deinem CSS

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Für Ladezustand


  const handleLogin = async (e: FormEvent) => { // async machen
    e.preventDefault();
    setError(''); // Vorherige Fehler zurücksetzen

    setLoading(true); // Ladezustand aktivieren

    // *** SUPABASE LOGIN VERWENDEN ***
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false); // Ladezustand deaktivieren

    if (error) {
      console.error('Supabase Login Fehler:', error.message);
      setError(`Login fehlgeschlagen: ${error.message}`);
    } else if (data.user) {
        // Erfolgreich angemeldet, Supabase Session ist gesetzt
        alert('Login erfolgreich!');
      router.push('/touren'); // Oder zur Chat-Seite leiten
    } else {
        // Dieser Fall sollte selten sein, wenn kein Fehler auftritt, aber kein User da ist
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
          disabled={loading} // Deaktivieren während des Ladens
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading} // Deaktivieren während des Ladens
        />
        <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logge ein...' : 'Einloggen'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}