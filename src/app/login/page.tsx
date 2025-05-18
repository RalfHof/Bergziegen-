// src/app/login/page.tsx
// Komplette Version mit Passwort-Anzeige-Button (Fehlender State hinzugef\u00FCgt)

"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './Login.module.css'; // Pfad zu deinem CSS-Modul

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // F\u00FCr Ladezustand
  // NEU: State f\u00FCr Passwort anzeigen/verbergen - DIESE ZEILE WAR FEHLEND
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e: FormEvent) => { // async machen
    e.preventDefault();
    setError(''); // Vorherige Fehler zur\u00FCcksetzen

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
         setError('Login fehlgeschlagen: Benutzerdaten ung\u00FCltig oder nicht best\u00E4tigt.');
    }
  };

  // Funktion zum Umschalten der Passwort-Sichtbarkeit
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        {/* E-Mail Feld bleibt unver\u00E4ndert */}
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />

        {/* Wrapper um Passwort-Input und Toggle */}
        <div className={styles.passwordContainer}>
          <input
            // Typ dynamisch zwischen 'password' und 'text' wechseln
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input} // Behalte die Input-Klasse f\u00FCr allgemeines Styling bei
            disabled={loading}
          />
          {/* Toggle Button/Icon */}
          {/* Klickt dieses Element, wird die Sichtbarkeit umgeschaltet */}
          {/* Verwende hier Text-Emojis als einfache Icons */}
          <span
            className={styles.passwordToggle} // Neue CSS-Klasse f\u00FCr Positionierung/Styling
            onClick={togglePasswordVisibility}
          >
            {/* Zeigt je nach Zustand unterschiedliche Icons/Texte */}
            {showPassword ? '👁️' : '🔒'}
          </span>
        </div>


        <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logge ein...' : 'Einloggen'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}