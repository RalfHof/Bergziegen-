'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from './ChatBox.module.css';

type Message = {
  id: number;
  text: string;
  created_at: string;
};

const supabase = createClient(
  'https://vxdxrojbgltjypxzehsg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4ZHhyb2piZ2x0anlweHplaHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDg2MTEsImV4cCI6MjA2MDI4NDYxMX0.x6RaoV5RgYt5BNcO-rP_VD2_qgR0p9vkvidzoJU0lwc'
);

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    loadMessages();

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const { error } = await supabase.from('messages').insert({ text: message });
      if (!error) setMessage('');
    }
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht eingeben..."
          className={styles.input} // ✅ lokale Klasse
        />
        <button onClick={sendMessage} className={styles.button}> {/* ✅ lokale Klasse */}
          Senden
        </button>
      </div>
    </div>
  );
}
