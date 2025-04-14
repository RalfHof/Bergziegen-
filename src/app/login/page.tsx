"use client"; // Füge diese Zeile am Anfang der Datei hinzu
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

interface User {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => { // Korrekte TypeScript-Syntax
    e.preventDefault();
    const usersString = localStorage.getItem('users') || '[]';
    const users: User[] = JSON.parse(usersString);
    const user = users.find((u): u is User => u.email === email && u.password === password);

    if (user) {
      sessionStorage.setItem('auth', 'true');
      router.push('/touren');
    } else {
      setError('Zugangsdaten sind ungültig');
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
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Einloggen</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}