'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { Message } from '@/types/message';
import styles from './ChatBox.module.css';



export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Benutzer-Session laden
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
    };

    getSession();
  }, []);

  // Nachrichten laden + Live-Update
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
        (payload: RealtimePostgresInsertPayload<Message>) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Nachricht senden
  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const { error } = await supabase.from('messages').insert({
      text: message,
      user_email: userEmail,
    });
  
    if (error) {
      console.error('Fehler beim Senden der Nachricht:', error.message);
      alert('Nachricht konnte nicht gesendet werden: ' + error.message);
    } else {
      setMessage('');
    }
  };
  // Datum & Uhrzeit schön formatieren
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('de-DE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <div>
              <strong>{msg.user_email || 'Unbekannt'}</strong>
              <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', color: '#888' }}>
                {formatDate(msg.created_at)}
              </span>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht eingeben..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.button}>
          Senden
        </button>
      </div>
    </div>
  );
}
