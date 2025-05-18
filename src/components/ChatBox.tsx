'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { Message } from '@/types/message'; // Pfad sicherstellen
import styles from './ChatBox.module.css'; // Pfad sicherstellen

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Für Scroll

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      setUserId(session?.user?.id ?? null);
      console.log("Supabase Session geladen:", session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
        setUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      } else {
        console.error('Fehler beim Laden der Nachrichten:', error?.message);
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

  // Auto-Scroll bei neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!userId) {
      alert('Bitte melden Sie sich an, um eine Nachricht zu senden.');
      return;
    }

    const { error } = await supabase.from('messages').insert({
      text: message.trim(),
      user_email: userEmail,
      user_id: userId,
    });

    if (error) {
      console.error('Fehler beim Senden der Nachricht:', error.message);
      alert('Nachricht konnte nicht gesendet werden: ' + (error.message || 'Unbekannter Fehler'));
    } else {
      setMessage('');
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Ungültiges Datum';
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
              <strong>{msg.user_email || msg.user_id || 'Unbekannt'}</strong>
              <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', color: '#888' }}>
                {formatDate(msg.created_at)}
              </span>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* ← Hier wird nach unten gescrollt */}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={userId ? 'Nachricht eingeben...' : 'Bitte anmelden zum Chatten...'}
          className={styles.input}
          disabled={!userId}
        />
        <button
          onClick={sendMessage}
          className={styles.button}
          disabled={!userId || !message.trim()}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
