"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css"; // Korrigierter Importpfad
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setMessage(response.data.message);
      router.push("/");
    } catch (error) {
      setMessage(error.response.data.message || "Fehler beim Login");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Anmelden</button>
        <p>{message}</p>
        <a href="/forgot-password">Passwort vergessen?</a>
      </form>
    </div>
  );
}