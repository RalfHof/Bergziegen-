'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Termin {
  datum: string;
  titel: string;
}

type TileArgs = {
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

export default function KalenderPage() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [datum, setDatum] = useState('');
  const [titel, setTitel] = useState('');
  const [kalenderDatum, setKalenderDatum] = useState<Date>(new Date());

  const handleAdd = () => {
    if (datum && titel) {
      setTermine([...termine, { datum, titel }]);
      setDatum('');
      setTitel('');
    }
  };

  const tileContent = ({ date, view }: TileArgs) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const hasTermin = termine.some((t) => t.datum === dateString);
      if (hasTermin) {
        return <div className={styles.terminMarker}></div>;
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
          {termine.map((t, i) => (
            <div key={i} className={styles.card}>
              <strong className={styles.cardDatum}>{t.datum}</strong>
              <p className={styles.cardTitel}>{t.titel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
