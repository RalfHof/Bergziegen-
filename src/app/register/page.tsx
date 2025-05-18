'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import styles from './page.module.css'; // Oder der korrekte Pfad zu deinem CSS (Annahme: page.module.css)

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // F\u00FCr Ladezustand
  // NEU: States f\u00FCr Passwort-Sichtbarkeit (zwei Felder = zwei States)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = async (e: FormEvent) => { // async machen, da supabase Funktionen Promise zur\u00FCckgeben
    e.preventDefault();
    setError(''); // Vorherige Fehler zur\u00FCcksetzen

    if (password !== confirmPassword) {
      setError('Passw\u00F6rter stimmen nicht \u00FCberein');
      return; // Abbruch, wenn Passw\u00F6rter nicht \u00FCbereinstimmen
    }

    setLoading(true); // Ladezustand aktivieren

    // *** SUPABASE REGISTRIERUNG VERWENDEN ***
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // Optional: F\u00FCge hier 'options' hinzu, wenn du z.B. den Benutzer sofort best\u00E4tigen willst
      // options: { emailRedirectTo: `${location.origin}/auth/confirm` }
    });

    setLoading(false); // Ladezustand deaktivieren

    if (error) {
      console.error('Supabase Registrierungsfehler:', error.message);
      setError(`Registrierung fehlgeschlagen: ${error.message}`);
    } else if (data.user) {
        // Erfolgreich registriert, der Benutzer ist sofort angemeldet (oder muss Email best\u00E4tigen, je nach Supabase Einstellung)
        alert('Registrierung erfolgreich! Sie sind jetzt angemeldet.'); // Oder: 'Best\u00E4tigungs-E-Mail gesendet!'
      router.push('/touren'); // Oder zur Chat-Seite oder einer Best\u00E4tigungsseite leiten
    } else {
        // Dies passiert, wenn email confirmation ben\u00F6tigt wird, aber kein error auftritt
        alert('Registrierung erfolgreich! Bitte \u00FCberpr\u00FCfen Sie Ihre E-Mails zur Best\u00E4tigung.');
        router.push('/login'); // Zur Login-Seite leiten, um auf Best\u00E4tigung zu warten oder sich anzumelden
    }
  };

  // NEU: Funktion zum Umschalten der Passwort-Sichtbarkeit f\u00FCr das erste Passwortfeld
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // NEU: Funktion zum Umschalten der Passwort-Sichtbarkeit f\u00FCr das Best\u00E4tigungsfeld
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrieren</h2>
      <form onSubmit={handleRegister} className={styles.form}>
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

        {/* NEU: Wrapper um Passwort-Input und Toggle */}
        <div className={styles.passwordContainer}>
          <input
             // NEU: Typ dynamisch wechseln
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input} // Behalte Klasse bei
            disabled={loading}
          />
          {/* NEU: Toggle Button/Icon */}
           <span
            className={styles.passwordToggle} // Neue CSS-Klasse
            onClick={togglePasswordVisibility} // NEU: Klick-Handler
          >
            {showPassword ? '👁️' : '🔒'} {/* NEU */}
          </span>
        </div>
        {/* Ende NEU */}


        {/* NEU: Wrapper um Passwort best\u00E4tigen-Input und Toggle */}
        <div className={styles.passwordContainer}> {/* Kann die gleiche Klasse sein */}
          <input
            // NEU: Typ dynamisch wechseln
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Passwort best\u00E4tigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input} // Behalte Klasse bei
            disabled={loading}
          />
          {/* NEU: Toggle Button/Icon */}
           <span
            className={styles.passwordToggle} // Neue CSS-Klasse
            onClick={toggleConfirmPasswordVisibility} // NEU: Klick-Handler
          >
            {showConfirmPassword ? '👁️' : '🔒'} {/* NEU */}
          </span>
        </div>
        {/* Ende NEU */}


        <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Registriere...' : 'Registrieren'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}