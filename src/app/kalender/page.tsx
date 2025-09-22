'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '@/lib/supabase';
import { Termin } from '@/types/termine';
import styles from './page.module.css';

type TileArgs = {
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

export default function KalenderPage() {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [termine, setTermine] = useState<Termin[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    tour_title: '',
    difficulty: '',
    status: 'aktiv',
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kalenderDatum, setKalenderDatum] = useState<Date>(new Date());

  // Termine laden
  const loadTermine = async () => {
    setLoadingData(true);
    setError(null);

    const { data, error } = await supabase
      .from('termine')
      .select('*')
      .order('date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fehler beim Laden der Termine:', error.message);
      setError('Fehler beim Laden der Termine.');
      setTermine([]);
    } else {
      setTermine(data as Termin[]);
    }
    setLoadingData(false);
  };

  // Auth-Check + initial load
  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setCurrentUserId(session.user.id);
        await loadTermine();
        setLoadingPage(false);
      }
    };

    checkSessionAndLoadData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (session && event === 'SIGNED_IN') {
        setCurrentUserId(session.user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // Realtime subscription — nur abhängig von loadingPage (nicht supabase-Instanz)
  useEffect(() => {
    if (loadingPage) return;

    const channel = supabase
      .channel('termine-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'termine' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTermine((prev) => [...prev, payload.new as Termin]);
          } else if (payload.eventType === 'UPDATE') {
            setTermine((prev) => prev.map((t) => (t.id === payload.old.id ? (payload.new as Termin) : t)));
          } else if (payload.eventType === 'DELETE') {
            setTermine((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      // Cleanup
      supabase.removeChannel(channel);
    };
  }, [loadingPage]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ date: '', tour_title: '', difficulty: '', status: 'aktiv' });
    setShowDifficultyMenu(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const { date, tour_title, difficulty, status } = formData;
    if (!date || !tour_title) {
      setError('Datum und Titel sind erforderlich.');
      return;
    }
    if (!currentUserId) {
      setError('Benutzer nicht angemeldet.');
      return;
    }

    setLoadingData(true);

    if (isEditing !== null) {
      const { error } = await supabase
        .from('termine')
        .update({
          date,
          tour_title,
          difficulty: difficulty === '' ? null : difficulty,
          status: status === '' ? null : status,
        })
        .eq('id', isEditing);

      if (error) setError('Fehler beim Aktualisieren des Termins.');
      else resetForm();
    } else {
      const { error } = await supabase.from('termine').insert({
        date,
        tour_title,
        difficulty: difficulty === '' ? null : difficulty,
        status: status === '' ? null : status,
        user_id: currentUserId,
      });

      if (error) setError('Fehler beim Hinzufügen des Termins.');
      else resetForm();
    }

    setLoadingData(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Termin löschen möchten?')) return;

    setLoadingData(true);
    const { error } = await supabase.from('termine').delete().eq('id', id);
    if (error) setError('Fehler beim Löschen des Termins.');
    setLoadingData(false);
  };

  const handleEditButtonClick = (termin: Termin) => {
    setIsEditing(termin.id);
    setFormData({
      date: termin.date,
      tour_title: termin.tour_title,
      difficulty: termin.difficulty || '',
      status: termin.status || 'aktiv',
    });
    setShowDifficultyMenu(null);
  };

  const handleCancelEdit = () => resetForm();

  const handleDifficultyMenuToggle = (terminId: number) => {
    setShowDifficultyMenu(showDifficultyMenu === terminId ? null : terminId);
  };

  const handleMenuSelection = async (terminId: number, type: 'difficulty' | 'status', value: string) => {
    setError(null);
    setLoadingData(true);
    setShowDifficultyMenu(null);

    const updateData: Partial<Termin> = {};
    if (type === 'difficulty') updateData.difficulty = value === '' ? null : value;
    if (type === 'status') updateData.status = value === '' ? null : value;

    const { error } = await supabase.from('termine').update(updateData).eq('id', terminId);
    if (error) setError(`Fehler beim Aktualisieren von ${type}.`);

    setLoadingData(false);
  };

  const tileContent = ({ date, view }: TileArgs) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const hasTermin = termine.some((t) => t.date === dateString);
      if (hasTermin) return <div className={styles.terminMarker}></div>;
    }
    return null;
  };

  if (loadingPage) return <p className={styles.loading}>Lade Kalender...</p>;

  return (
    <div className={styles.outerBox}>
      <div className={styles.container}>
        <h1 className={styles.title}>📅 Bergziegen-Tourkalender 🐐</h1>

        {loadingData && <p className={styles.loadingData}>Operation läuft...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={styles.input} disabled={loadingData} required />
          <input type="text" name="tour_title" value={formData.tour_title} placeholder="Titel der Tour" onChange={handleInputChange} className={styles.input} disabled={loadingData} required />

          {isEditing === null && (
            <>
              <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className={styles.input} disabled={loadingData}>
                <option value="">Schwierigkeit wählen (Optional)</option>
                <option value="Leicht">Leicht</option>
                <option value="Mittel">Mittel</option>
                <option value="Schwer">Schwer</option>
              </select>

              <select name="status" value={formData.status} onChange={handleInputChange} className={styles.input} disabled={loadingData}>
                <option value="aktiv">Status: Aktiv</option>
                <option value="abgesagt">Status: Abgesagt</option>
              </select>
            </>
          )}

          <div className={styles.formButtons}>
            <button type="submit" className={styles.button} disabled={loadingData}>
              {isEditing !== null ? 'Änderungen speichern' : 'Termin hinzufügen'}
            </button>
            {isEditing !== null && (
              <button type="button" onClick={handleCancelEdit} className={`${styles.button} ${styles.cancelButton}`} disabled={loadingData}>
                Abbrechen
              </button>
            )}
          </div>
        </form>

        <div className={styles.calendarContainer}>
          <Calendar onChange={(date) => setKalenderDatum(date as Date)} value={kalenderDatum} locale="de-DE" tileContent={tileContent} />
        </div>

        <div className={styles.list}>
          {termine
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((t) => (
              <div key={t.id} className={`${styles.card} ${t.difficulty ? styles[t.difficulty.toLowerCase()] : ''} ${t.status === 'abgesagt' ? styles.abgesagt : ''}`}>
                <div className={styles.cardInfo}>
                  <strong className={styles.cardDatum}>{t.date}</strong>
                  <p className={styles.cardTitel}>{t.tour_title}</p>
                  {(t.difficulty || t.status) && (
                    <p className={styles.cardDetails}>
                      {t.difficulty && `Schwierigkeit: ${t.difficulty}`}
                      {t.difficulty && t.status && ' | '}
                      {t.status && `Status: ${t.status}`}
                    </p>
                  )}
                </div>

                <div className={styles.cardButtons}>
                  {isEditing !== t.id && (
                    <>
                      <button type="button" onClick={() => handleDifficultyMenuToggle(t.id)} className={`${styles.button} ${styles.menuButton}`} disabled={loadingData}>
                        Optionen ▼
                      </button>

                      {showDifficultyMenu === t.id && (
                        <div className={styles.difficultyMenu}>
                          <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Leicht')}>Leicht</button>
                          <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Mittel')}>Mittel</button>
                          <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Schwer')}>Schwer</button>
                          <div className={styles.menuSeparator}></div>
                          <button type="button" onClick={() => handleMenuSelection(t.id, 'status', 'aktiv')}>Status: Aktiv</button>
                          <button type="button" onClick={() => handleMenuSelection(t.id, 'status', 'abgesagt')}>Status: Abgesagt</button>
                        </div>
                      )}

                      <button type="button" onClick={() => handleEditButtonClick(t)} className={`${styles.button} ${styles.editButton}`} disabled={loadingData}>Bearbeiten</button>
                      <button type="button" onClick={() => handleDelete(t.id)} className={`${styles.button} ${styles.deleteButton}`} disabled={loadingData}>Löschen</button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
