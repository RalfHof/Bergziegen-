'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


interface Termin {
  id: string;
  datum: string;
  titel: string;
  kategorie: 'leicht' | 'mittel' | 'schwer' | 'abgesagt';
}

type TileArgs = {
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

export default function KalenderPage() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [datum, setDatum] = useState('');
  const [titel, setTitel] = useState('');
  const [kategorie, setKategorie] = useState<Termin['kategorie']>('leicht');
  const [kalenderDatum, setKalenderDatum] = useState<Date>(new Date());

  // 📥 Termine laden
  useEffect(() => {
    const fetchTermine = async () => {
      const { data, error } = await supabase
        .from('termine')
        .select('*')
        .order('datum', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden:', error);
      } else {
        setTermine(data as Termin[]);
      }
    };

    fetchTermine();
  }, []);

  // ➕ Termin hinzufügen
  const handleAdd = async () => {
    if (datum && titel) {
      const { data, error } = await supabase
        .from('termine')
        .insert([{ datum, titel, kategorie }])
        .select();

      if (error) {
        console.error('Fehler beim Hinzufügen:', error.message);
      } else if (data && data.length > 0) {
        setTermine([...termine, data[0] as Termin]);
        setDatum('');
        setTitel('');
        setKategorie('leicht');
      }
    }
  };

  // 🗑️ Termin löschen
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('termine').delete().eq('id', id);
    if (error) {
      console.error('Fehler beim Löschen:', error.message);
    } else {
      setTermine(termine.filter((t) => t.id !== id));
    }
  };

  // 🖊️ Termin bearbeiten (vereinfachte Variante: nur Titel aktualisieren)
  const handleEdit = async (id: string, neuerTitel: string) => {
    const { data, error } = await supabase
      .from('termine')
      .update({ titel: neuerTitel })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Fehler beim Bearbeiten:', error.message);
    } else if (data && data.length > 0) {
      setTermine(termine.map((t) => (t.id === id ? data[0] as Termin : t)));
    }
  };

  // 🎨 Kalender-Tiles einfärben
  const tileContent = ({ date, view }: TileArgs) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const termin = termine.find((t) => t.datum === dateString);
      if (termin) {
        return (
          <div
            className={styles.terminMarker}
            data-kategorie={termin.kategorie}
          />
        );
      }
    }
    return null;
  };

  return (
    <div className={styles.outerBox}>
      <div className={styles.container}>
        <h1 className={styles.title}>📅 Bergziegen-Tourkalender 🐐</h1>

        <div className={styles.form}>
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            value={titel}
            placeholder="Titel der Tour"
            onChange={(e) => setTitel(e.target.value)}
            className={styles.input}
          />
          <select
            value={kategorie}
            onChange={(e) =>
              setKategorie(e.target.value as Termin['kategorie'])
            }
            className={styles.input}
          >
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
            <option value="abgesagt">Abgesagt</option>
          </select>
          <button onClick={handleAdd} className={styles.button}>
            Termin hinzufügen
          </button>
        </div>

        <div className={styles.calendarContainer}>
          <Calendar
            onChange={(date) => setKalenderDatum(date as Date)}
            value={kalenderDatum}
            locale="de-DE"
            tileContent={tileContent}
          />
        </div>

        <div className={styles.list}>
          {termine.map((t) => (
            <div key={t.id} className={styles.card}>
              <strong className={styles.cardDatum}>{t.datum}</strong>
              <p className={styles.cardTitel}>{t.titel}</p>
              <span className={styles.kategorie}>{t.kategorie}</span>
              <div className={styles.actions}>
                <button
                  onClick={() =>
                    handleEdit(t.id, prompt('Neuer Titel:', t.titel) || t.titel)
                  }
                  className={styles.smallButton}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className={styles.smallButton}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
