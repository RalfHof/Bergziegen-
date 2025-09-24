'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    setMessages(data as Message[]);
  };

  const sendMessage = async () => {
    if (!newMessage || !session?.user?.name) return;

    await supabase.from('messages').insert([
      {
        content: newMessage,
        username: session.user.name,
      },
    ]);
    setNewMessage('');
  };

  return (
    <main className={styles.chatPage}>
      <div className={styles.overlay}>
        <h1 className={styles.chatTitle}>🐐 Bergziegen Chat</h1>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.messageCard}>
              <div>
                <strong>{msg.username}</strong> am{' '}
                {new Date(msg.created_at).toLocaleString()}
              </div>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={newMessage}
            placeholder="Nachricht eingeben..."
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.button}>
            Senden
          </button>
        </div>
      </div>
    </main>
  );
}
