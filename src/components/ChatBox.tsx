'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

// Stelle sicher, dass deine Message-Typdefinition die Felder user_id und user_email|null enthält:
// Zusätzlich müssen wir den Typ erweitern, um die geholten Benutzerdaten zu berücksichtigen
// Wenn wir '*, user:user_id(*)' selectieren, kommt ein 'user' Objekt hinzu.
export type MessageWithUser = {
    id: number; // Oder string, je nach DB
    created_at: string;
    text: string;
    user_email: string | null; // Kann aus der DB kommen (alte Nachrichten) oder null sein
    user_id: string; // Muss immer da sein
    // NEU: Struktur der geholten Benutzerdaten
    user: {
        id: string;
        email: string; // Die E-Mail des Erstellers aus auth.users
        user_metadata: { // Metadata, falls vorhanden
            name?: string; // Optional, falls Name im user_metadata gespeichert ist
            // ... andere Metadata-Felder
        } | null;
        // ... weitere Standardfelder des auth.users Objekts, falls selektiert
    } | null; // 'user' Objekt kann null sein, falls der Benutzer gelöscht wurde
};

// Wir verwenden den neuen Typ für den State und Realtime
// import { Message } from '@/types/message'; // Originaler Message Typ (ggf. nicht mehr nötig)
import styles from './ChatBox.module.css'; // Pfad sicherstellen


export default function ChatBox() {
  const [messages, setMessages] = useState<MessageWithUser[]>([]); // Nutzt neuen Typ
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null); // E-Mail des aktuellen Benutzers
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // ID des aktuellen Benutzers

  // Benutzer-Session laden (inkl. ID) und auf Anmelde-Änderungen reagieren
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      setCurrentUserId(session?.user?.id ?? null); // User ID setzen
         console.log("Supabase Session geladen:", session); // Zum Debugging: Session loggen
         console.log("Geladene User ID:", session?.user?.id); // Zum Debugging: User ID loggen
    };

    getSession();

    // Dies abonniert Änderungen im Anmeldestatus (Login/Logout)
    // Wenn sich der Benutzer anmeldet oder abmeldet, w\u00E4hrend der Chat offen ist,
    // wird der userId-State aktualisiert, was das Eingabefeld aktiviert/deaktiviert.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session); // Zum Debugging: \u00C4nderungen loggen
        setUserEmail(session?.user?.email ?? null);
        setCurrentUserId(session?.user?.id ?? null);
      }
    );

    // Aufr\u00E4umen des Listeners bei Entfernung der Komponente
    return () => {
      authListener?.subscription.unsubscribe();
    };

  }, []); // Leeres Abh\u00E4ngigkeits-Array bedeutet, dieser Effekt l\u00E4uft nur einmal beim Mounten und beim Unmounten

  // Nachrichten laden + Live-Update abonnieren
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
          .from('messages')
          // *** ABFRAGE GE\u00c4NDERT ***
          // W\u00e4hlt alle Spalten (*) und holt das verkn\u00fcpfte Benutzerobjekt \u00fcber user_id(*)
          // Wir w\u00e4hlen explizit email und user_metadata aus dem Benutzerobjekt
          .select('*, user:user_id(id, email, user_metadata)')
          .order('created_at', { ascending: true });

      if (!error && data) {
          // Casten auf den neuen Typ MessageWithUser[]
        setMessages(data as MessageWithUser[]);
      } else {
         console.error('Fehler beim Laden der Nachrichten:', error?.message);
      }
    };

    loadMessages();

    // Abonnieren von neuen Nachrichten in Echtzeit
    const channel = supabase
      .channel('messages-channel') // Muss derselbe Kanalname sein wie in der Datenbank
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: RealtimePostgresInsertPayload<MessageWithUser>) => { // Nutzt neuen Typ
            // Fügt die neue Nachricht am Ende der Liste hinzu
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe(); // Den Kanal abonnieren

    // Aufräumen des Kanals bei Entfernung der Komponente
    return () => {
      supabase.removeChannel(channel);
    };

  }, []); // Leeres Abh\u00E4ngigkeits-Array

  // Nachricht senden
  const sendMessage = async () => {
    // Pr\u00fcft, ob eine Nachricht vorhanden ist UND ob der Benutzer angemeldet ist (currentUserId vorhanden)
    if (!message.trim()) {
        // Nachricht ist leer oder nur Leerzeichen
        return;
    }
    if (!currentUserId) { // Prüft auf currentUserId
        // Benutzer ist nicht angemeldet
        alert('Bitte melden Sie sich an, um eine Nachricht zu senden.');
        return;
    }
 
    // user_email kann immer noch gesendet werden, auch wenn wir es im UI aus user.email holen
    // Das user_email Feld in der DB kann n\u00fctzlich sein f\u00fcr Migration oder falls auth.users gel\u00f6scht wird
    const { error } = await supabase.from('messages').insert({
      text: message.trim(), // Sende den bereinigten Text
      user_email: userEmail, // E-Mail des aktuellen Benutzers
      user_id: currentUserId, // *** Sende die User ID des aktuellen Benutzers ***
    });
 
    if (error) {
      console.error('Fehler beim Senden der Nachricht:', error.message);
      // Zeige eine detailliertere Fehlermeldung an, falls verf\u00fcgbar
      alert('Nachricht konnte nicht gesendet werden: ' + (error.message || 'Unbekannter Fehler'));
    } else {
      // Bei Erfolg Eingabefeld leeren
      setMessage('');
    }
  };

  // Datum & Uhrzeit sch\u00f6n formatieren
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
     // Stelle sicher, dass das Datum g\u00fCltig ist, bevor du formatierst
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
          // Nutzt msg.id f\u00fcr den Key, muss eindeutig sein
          <div key={msg.id} className={styles.message}>
            <div>
              {/* *** ANZEIGE DES ABSENDERS GE\u00c4NDERT *** */}
              {/* Versucht, Name aus Metadata zu holen, sonst Email aus user Objekt, sonst user_email (f\u00fcr alte Nachrichten?), sonst User ID */}
              <strong>{(msg.user?.user_metadata?.name as string) || msg.user?.email || msg.user_email || msg.user_id || 'Unbekannt'}</strong>
              {/* *** ZEITSTEMPEL ANZEIGE *** */}
              <span className={styles.timestamp}> {/* Klasse f\u00fcr Styling hinzuf\u00fcgt */}
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
          placeholder={currentUserId ? "Nachricht eingeben..." : "Bitte anmelden zum Chatten..."} // Nutzt currentUserId
          className={styles.input}
          // Eingabe deaktivieren, wenn der Benutzer NICHT angemeldet ist (currentUserId ist null)
          disabled={!currentUserId} // Nutzt currentUserId
        />
        <button
            onClick={sendMessage}
            className={styles.button}
            // Button deaktivieren, wenn nicht angemeldet ODER Nachricht leer ist
            disabled={!currentUserId || !message.trim()} // Nutzt currentUserId
        >
          Senden
        </button>
      </div>
    </div>
  );
}