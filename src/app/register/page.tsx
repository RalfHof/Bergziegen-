'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface User {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    try {
      const usersString = localStorage.getItem('users') || '[]';
      const users: User[] = JSON.parse(usersString);

      const exists = users.find((u): u is User => u.email === email);
      if (exists) {
        setError('E-Mail ist bereits registriert');
        return;
      }

      const newUser: User = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      router.push('/login');
    } catch (err) {
      console.error('Registrierungsfehler:', err); // Loggen Sie den Fehler für Debugging
      setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es später.'); // Benutzerfreundliche Fehlermeldung
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
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Passwort bestätigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Registrieren</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}