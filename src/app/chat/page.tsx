'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      setUser(session.user);
      setLoading(false);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      setMessages((data ?? []) as Message[]);
    };

    init();
  }, [router]);

  const sendMessage = async () => {
    if (!newMessage || !user) return;

    await supabase.from('messages').insert({
      content: newMessage,
      username: user.email ?? 'Unbekannt',
    });

    setNewMessage('');
  };

  if (loading) return <p>Lade Chat…</p>;

  return (
    <div>
      <h1>🐐 Chat</h1>

      {messages.map((m) => (
        <p key={m.id}>
          <strong>{m.username}:</strong> {m.content}
        </p>
      ))}

      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Senden</button>
    </div>
  );
}
