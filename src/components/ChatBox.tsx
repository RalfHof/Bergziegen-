'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { Message } from '@/types/message';
import styles from './ChatBox.module.css';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auth-Session laden
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      setUserId(session?.user?.id ?? null);
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

  // Nachrichten laden und abonnieren
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
          setMessages((prev) =>
            [...prev, payload.new].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll nach unten bei neuer Nachricht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!userId) {
      alert('Bitte anmelden');
      return;
    }

    const { error } = await supabase.from('messages').insert({
      text: message.trim(),
      user_email: userEmail,
      user_id: userId,
    });

    if (error) {
      console.error('Fehler beim Senden:', error.message);
    } else {
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.messages}>
        {messages.map((msg) => {
          const isOwnMessage = msg.user_id === userId;
          return (
            <div
              key={msg.id}
              className={`${styles.message} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}
            >
              <div className={styles.sender}>
                {isOwnMessage ? 'Du' : msg.user_email || 'Unbekannt'}
              </div>
              <div>{msg.text}</div>
              <div className={styles.timestamp}>{formatDate(msg.created_at)}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={styles.emojiButton}
          title="Emoji hinzufügen"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={userId ? 'Nachricht eingeben...' : 'Bitte anmelden'}
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
