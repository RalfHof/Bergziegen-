'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function ChatAktuellPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Aktuelle Nachrichten</h1>

      <div className={styles.chatBox}>
        {messages.length === 0 && <p>Keine Nachrichten bisher.</p>}
        {messages.map((msg, i) => (
          <div key={i} className={styles.message}>
            {msg}
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Schreibe eine Nachricht..."
        />
        <button onClick={handleSend}>Senden</button>
      </div>
    </div>
  );
}
