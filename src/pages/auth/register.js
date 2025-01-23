import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", { email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Fehler bei der Registrierung");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrieren</h1>
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
      <button type="submit">Registrieren</button>
      <p>{message}</p>
    </form>
  );
}
