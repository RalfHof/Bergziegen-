'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

// Stelle sicher, dass deine Message-Typdefinition die Felder user_id und user_email|null enthält:
// export type Message = {
//   id: number; // Oder string, je nach DB
//   created_at: string;
//   text: string;
//   user_email: string | null; // Wichtig: kann string oder null sein
//   user_id: string; // Wichtig: muss string sein (UUID) laut deiner DB & RLS
// };
import { Message } from '@/types/message'; // Pfad sicherstellen
import styles from './ChatBox.module.css'; // Pfad sicherstellen


export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Zustand für die User ID

  // Benutzer-Session laden (inkl. ID) und auf Anmelde-Änderungen reagieren
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      setUserId(session?.user?.id ?? null); // User ID setzen
         console.log("Supabase Session geladen:", session); // Zum Debugging: Session loggen
         console.log("Geladene User ID:", session?.user?.id); // Zum Debugging: User ID loggen
    };

    getSession();

    // Dies abonniert Änderungen im Anmeldestatus (Login/Logout)
    // Wenn sich der Benutzer anmeldet oder abmeldet, während der Chat offen ist,
    // wird der userId-State aktualisiert, was das Eingabefeld aktiviert/deaktiviert.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session); // Zum Debugging: Änderungen loggen
        setUserEmail(session?.user?.email ?? null);
        setUserId(session?.user?.id ?? null);
      }
    );

    // Aufräumen des Listeners bei Entfernung der Komponente
    return () => {
      authListener?.subscription.unsubscribe();
    };

  }, []); // Leeres Abhängigkeits-Array bedeutet, dieser Effekt läuft nur einmal beim Mounten und beim Unmounten

  // Nachrichten laden + Live-Update abonnieren
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

    // Abonnieren von neuen Nachrichten in Echtzeit
    const channel = supabase
      .channel('messages-channel') // Ein eindeutiger Kanalname
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: RealtimePostgresInsertPayload<Message>) => {
            // Fügt die neue Nachricht am Ende der Liste hinzu
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe(); // Den Kanal abonnieren

    // Aufräumen des Kanals bei Entfernung der Komponente
    return () => {
      supabase.removeChannel(channel);
    };

  }, []); // Leeres Abhängigkeits-Array bedeutet, dieser Effekt läuft nur einmal beim Mounten und beim Unmounten

  // Nachricht senden
  const sendMessage = async () => {
    // Prüfen, ob eine Nachricht vorhanden ist UND ob der Benutzer angemeldet ist (UserId vorhanden)
    if (!message.trim()) {
        // Nachricht ist leer oder nur Leerzeichen
        return;
    }
    if (!userId) {
        // Benutzer ist nicht angemeldet
        alert('Bitte melden Sie sich an, um eine Nachricht zu senden.');
        return;
    }
 
    const { error } = await supabase.from('messages').insert({
      text: message.trim(), // Sende den bereinigten Text
      user_email: userEmail, // Sende die E-Mail (kann null sein, wenn nicht im Session Objekt)
      user_id: userId, // *** Sende die User ID *** <-- Das haben wir in den Supabase-Einstellungen vorbereitet!
    });
 
    if (error) {
      console.error('Fehler beim Senden der Nachricht:', error.message);
      // Zeige eine detailliertere Fehlermeldung an, falls verfügbar
      alert('Nachricht konnte nicht gesendet werden: ' + (error.message || 'Unbekannter Fehler'));
    } else {
      // Bei Erfolg Eingabefeld leeren
      setMessage('');
    }
  };

  // Datum & Uhrzeit schön formatieren
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
     // Stelle sicher, dass das Datum gültig ist, bevor du formatierst
     if (isNaN(date.getTime())) {
         return 'Ungültiges Datum';
     }
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
              {/* Zeige die E-Mail an, oder die User ID, je nachdem, was du willst */}
              {/* user_email könnte null sein, user_id sollte immer da sein für gesendete Nachrichten */}
              <strong>{msg.user_email || msg.user_id || 'Unbekannt'}</strong>
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
          // Placeholder Text anpassen je nach Anmeldestatus
          placeholder={userId ? "Nachricht eingeben..." : "Bitte anmelden zum Chatten..."}
          className={styles.input}
          // Eingabe deaktivieren, wenn der Benutzer NICHT angemeldet ist (userId ist null)
          disabled={!userId}
        />
        <button
            onClick={sendMessage}
            className={styles.button}
            // Button deaktivieren, wenn nicht angemeldet ODER Nachricht leer ist
            disabled={!userId || !message.trim()}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
