'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './page.module.css'; // Oder der korrekte Pfad zu deinem CSS

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Für Ladezustand

  const handleRegister = async (e: FormEvent) => { // async machen, da supabase Funktionen Promise zurückgeben
    e.preventDefault();
    setError(''); // Vorherige Fehler zurücksetzen

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true); // Ladezustand aktivieren

    // *** SUPABASE REGISTRIERUNG VERWENDEN ***
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // Optional: Füge hier 'options' hinzu, wenn du z.B. den Benutzer sofort bestätigen willst
      // options: { emailRedirectTo: `${location.origin}/auth/confirm` }
    });

    setLoading(false); // Ladezustand deaktivieren

    if (error) {
      console.error('Supabase Registrierungsfehler:', error.message);
      setError(`Registrierung fehlgeschlagen: ${error.message}`);
    } else if (data.user) {
        // Erfolgreich registriert, der Benutzer ist sofort angemeldet (oder muss Email bestätigen, je nach Supabase Einstellung)
        alert('Registrierung erfolgreich! Sie sind jetzt angemeldet.'); // Oder: 'Bestätigungs-E-Mail gesendet!'
      router.push('/touren'); // Oder zur Chat-Seite oder einer Bestätigungsseite leiten
    } else {
        // Dies passiert, wenn email confirmation benötigt wird, aber kein error auftritt
        alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.');
        router.push('/login'); // Zur Login-Seite leiten, um auf Bestätigung zu warten oder sich anzumelden
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrieren</h2>
      <form onSubmit={handleRegister} className={styles.form}>
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
        <input
          type="password"
          placeholder="Passwort bestätigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading} // Deaktivieren während des Ladens
        />
        <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Registriere...' : 'Registrieren'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}