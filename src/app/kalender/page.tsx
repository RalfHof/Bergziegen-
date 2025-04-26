'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// React Calendar Imports
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Supabase Import
import { supabase } from '@/lib/supabase'; // Pfad sicherstellen

// Eigene Typen und CSS
import { Termin } from '@/types/termine'; // Importiere den Termin-Typ

// Importiere Styles
import styles from './page.module.css'; // Pfad sicherstellen


// Das TerminUI-Interface wurde entfernt, da es keine zusätzlichen Felder hinzugefügt hat.
// Wir verwenden direkt den importierten 'Termin'-Typ.

// Argumente für die tileContent Funktion des Kalenders
type TileArgs = {
  date: Date;
  view: 'month' | 'year' | 'decade' | 'century';
};

export default function KalenderPage() {
  const router = useRouter();
  // State für den Ladezustand der gesamten Seite (inkl. Session Check und initialem Datenladen)
  const [loadingPage, setLoadingPage] = useState(true);

  // State für den aktuell angemeldeten Benutzer (benötigt für INSERT)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State für die Liste der Termine aus Supabase - Nutzt direkt den 'Termin' Typ
  const [termine, setTermine] = useState<Termin[]>([]); // <-- Geändert von TerminUI[] zu Termin[]

  // State für die Daten im Formular (zum Hinzufügen oder Bearbeiten)
  const [formData, setFormData] = useState({
    date: '',
    tour_title: '',
    difficulty: '', // Kann leer bleiben, wenn optional
    status: 'aktiv', // Standardwert für neuen Termin
  });
  // State, um zu wissen, ob wir gerade einen bestehenden Termin bearbeiten (enthält dessen ID)
  const [isEditing, setIsEditing] = useState<number | null>(null);
  // State, um zu wissen, für welchen Termin das Schwierigkeits/Status-Menü offen ist
  const [showDifficultyMenu, setShowDifficultyMenu] = useState<number | null>(null);

  // States für allgemeine Lade- und Fehlermeldungen bei Datenoperationen
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State für das aktuell ausgewählte Datum im react-calendar (nicht direkt mit Termin-Daten verbunden)
  const [kalenderDatum, setKalenderDatum] = useState<Date>(new Date());


  // --- Authentifizierungscheck beim Laden der Seite ---
  // Lädt die Supabase Session und leitet unauthentifizierte Benutzer zur Login-Seite um.
  // Wenn authentifiziert, wird die Benutzer-ID gespeichert und die Termine geladen.
  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Wenn keine Session, zum Login umleiten
      if (!session) {
        router.push('/login');
      } else {
        // Session gefunden: User ID speichern und initiale Daten laden
         setCurrentUserId(session.user.id);
         // Hier rufen wir loadTermine auf, da die Session vorhanden ist
         await loadTermine(); // Laden der Termine NACH erfolgreichem Session Check
         setLoadingPage(false); // Ladezustand der Seite beenden
      }
    };

    checkSessionAndLoadData();

    // Optional: Auf Anmelde-Änderungen reagieren (z.B. wenn Benutzer sich auf anderer Seite abmeldet)
     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
       if (!session && event === 'SIGNED_OUT') {
         // Wenn Benutzer sich abmeldet, während er auf dieser Seite ist
         router.push('/login');
       } else if (session && event === 'SIGNED_IN') {
          // Optional: Neu laden oder neu fetchen bei neuem Login
          setCurrentUserId(session.user.id);
          // loadTermine(); // Kann hier aufgerufen werden, wenn Termine neu geladen werden sollen
       }
     });

     // Aufräumen des Listeners bei Entfernung der Komponente
     return () => {
       authListener?.subscription.unsubscribe();
     };

  }, [router]); // Abhängigkeit vom router


  // --- Termine aus Supabase laden ---
  // Holt alle Termine, RLS (authenticated + true) erlaubt dies.
  const loadTermine = async () => {
      setLoadingData(true); // Ladezustand für Datenoperationen
      setError(null); // Fehlermeldung zurücksetzen

      // SELECT * FROM termine ORDER BY date ASC, created_at ASC
      const { data, error } = await supabase
          .from('termine')
          .select('*') // Wählt alle Spalten aus
          .order('date', { ascending: true }) // Nach Datum sortieren
          .order('created_at', { ascending: true }); // Zusätzlich nach Erstellung sortieren (bei gleichem Datum)

      if (error) {
          console.error('Fehler beim Laden der Termine:', error.message);
          setError('Fehler beim Laden der Termine.');
          setTermine([]); // Leere Liste bei Fehler
      } else {
          // Erfolgreich geladen, Termine in den State setzen - Nutzt jetzt 'Termin' Typ
          setTermine(data as Termin[]); // Type assertion
      }
      setLoadingData(false); // Ladezustand beenden
  };


  // --- Realtime Updates abonnieren ---
  // Hält die Liste der Termine im UI aktuell, wenn sich in der DB etwas ändert
  // (andere Benutzer fügen hinzu/ändern/löschen)
  useEffect(() => {
      // Abonnieren nur, wenn der Seite nicht mehr im anfänglichen Ladezustand ist
      if (loadingPage) return;

      // Sicherstellen, dass der Kanal nur einmal abonniert wird und vorherige abbestellt werden
      const channel = supabase
          .channel('termine-changes') // Ein eindeutiger Kanalname für diese Tabelle
          .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'termine' }, // Auf alle Event-Typen für die termine Tabelle reagieren
              (payload) => {
                  console.log('Realtime change received:', payload); // Debugging-Ausgabe

                  // State basierend auf dem Event-Typ aktualisieren - Nutzt jetzt 'Termin' Typ
                  if (payload.eventType === 'INSERT') {
                      // Fügt die neue Termin-Daten am Ende der Liste hinzu
                      setTermine((prev) => [...prev, payload.new as Termin]); // Nutzt 'Termin'
                  } else if (payload.eventType === 'UPDATE') {
                      // Ersetzt den alten Termin durch den aktualisierten
                      setTermine((prev) =>
                          prev.map(t => t.id === payload.old.id ? payload.new as Termin : t) // Nutzt 'Termin'
                      );
                  } else if (payload.eventType === 'DELETE') {
                       // Entfernt den gelöschten Termin aus der Liste
                       setTermine((prev) => prev.filter(t => t.id !== payload.old.id));
                  }
              }
          )
          .subscribe(); // Den Kanal abonnieren

      // Aufräumen des Kanals bei Entfernung der Komponente
      return () => {
          supabase.removeChannel(channel);
      };

  // Füge supabase.channel und supabase.removeChannel als Abhängigkeiten hinzu,
  // um sicherzustellen, dass der Listener korrekt abbestellt wird,
  // falls sich die Instanz ändern sollte (unwahrscheinlich, aber gute Praxis)
  // Diese Abhängigkeiten sind laut ESLint unnötig, aber ihre Entfernung kann in manchen strikten Setups
  // dazu führen, dass der Cleanup nicht korrekt ausgeführt wird.
  // Wenn ESLint als Fehler konfiguriert ist, entferne sie: `}, [loadingPage]);`
  // Wenn ESLint als Warnung konfiguriert ist, kannst du sie lassen ODER entfernen.
  }, [loadingPage, supabase.channel, supabase.removeChannel]); // Abhängigkeiten


  // --- Handler für Formular-Eingaben ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  // --- Handler für Hinzufügen oder Bearbeiten Speichern ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Standardformular-Submit verhindern
    setError(null); // Fehlermeldung zurücksetzen

    const { date, tour_title, difficulty, status } = formData;

    // Einfache Validierung der notwendigen Felder
    if (!date || !tour_title) {
        setError('Datum und Titel sind erforderlich.');
        return;
    }

    // Sicherstellen, dass der Benutzer angemeldet ist (sollte durch Seiten-Check schon sein, aber doppelt prüfen)
    if (!currentUserId) {
        setError('Benutzer nicht angemeldet. Bitte melden Sie sich an.');
        // Optional: Zur Login-Seite weiterleiten, falls Session hier plötzlich fehlt
        // router.push('/login');
        return;
    }

    setLoadingData(true); // Ladezustand aktivieren

    if (isEditing !== null) {
        // --- Bestehenden Termin AKTUALISIEREN ---
        // update({ ...Felder }) WHERE id = isEditing
        const { error } = await supabase
            .from('termine')
            .update({
                date,
                tour_title,
                difficulty: difficulty === '' ? null : difficulty, // Konvertiere leere Strings zu null für die DB
                status: status === '' ? null : status // Konvertiere leere Strings zu null für die DB
            })
            .eq('id', isEditing); // Aktualisiere den Termin mit dieser ID

        if (error) {
            console.error('Fehler beim Aktualisieren des Termins:', error.message);
            setError('Fehler beim Aktualisieren des Termins.');
        } else {
            alert('Termin erfolgreich aktualisiert!');
            // Realtime wird den State aktualisieren, Formular zurücksetzen
            resetForm(); // Setzt Formular und Bearbeitungsmodus zurück
        }

    } else {
        // --- Neuen Termin HINZUFÜGEN ---
        // insert({ ...Felder, user_id })
        const { error } = await supabase
            .from('termine')
            .insert({
                date,
                tour_title,
                difficulty: difficulty === '' ? null : difficulty, // Konvertiere leere Strings zu null für die DB
                status: status === '' ? null : status, // Konvertiere leere Strings zu null für die DB
                user_id: currentUserId, // Die User ID des Erstellers speichern
            });

        if (error) {
            console.error('Fehler beim Hinzufügen des Termins:', error.message);
            setError('Fehler beim Hinzufügen des Termins.');
        } else {
            alert('Termin erfolgreich hinzugefügt!');
            // Realtime wird den State aktualisieren, Formular zurücksetzen
            resetForm(); // Setzt Formular zurück
        }
    }

    setLoadingData(false); // Ladezustand deaktivieren
  };

  // --- Handler für Löschen Button ---
  const handleDelete = async (id: number) => {
      if (confirm('Sind Sie sicher, dass Sie diesen Termin löschen möchten?')) {
          setLoadingData(true); // Ladezustand
          setError(null); // Fehler zurücksetzen

          // delete FROM termine WHERE id = id
          const { error } = await supabase
              .from('termine')
              .delete()
              .eq('id', id); // Lösche den Termin mit dieser ID

          if (error) {
              console.error('Fehler beim Löschen des Termins:', error.message);
              setError('Fehler beim Löschen des Termins.');
          } else {
              alert('Termin erfolgreich gelöscht!');
              // Realtime wird den State aktualisieren
          }
          setLoadingData(false); // Ladezustand beenden
      }
  };

  // --- Handler für Bearbeiten Button Klick ---
  // Setzt den Bearbeitungsmodus und füllt das Formular mit den Termin-Daten
  const handleEditButtonClick = (termin: Termin) => { // Geändert von TerminUI zu Termin
      setIsEditing(termin.id); // Bearbeitungsmodus aktivieren mit der ID des Termins
      // Formular mit den Daten des Termins füllen
      setFormData({
          date: termin.date,
          tour_title: termin.tour_title,
          difficulty: termin.difficulty || '', // Leeren String setzen, falls null in DB
          status: termin.status || 'aktiv', // 'aktiv' setzen, falls null in DB
      });
      setShowDifficultyMenu(null); // Menü schließen, falls offen
  };

  // --- Handler für Abbrechen Button im Bearbeiten Modus ---
  // Setzt das Formular und den Bearbeitungsmodus zurück
  const handleCancelEdit = () => {
      resetForm();
  };

  // --- Formular und Bearbeitungsmodus zurücksetzen ---
  const resetForm = () => {
      setIsEditing(null); // Bearbeitungsmodus beenden
      setFormData({ // Formular leeren / auf Standardwerte setzen
          date: '',
          tour_title: '',
          difficulty: '',
          status: 'aktiv',
      });
      setShowDifficultyMenu(null); // Menü schließen
  };


  // --- Handler für Schwierigkeits/Status Menü Button Klick ---
  // Schaltet das Menü für einen spezifischen Termin ein oder aus
  const handleDifficultyMenuToggle = (terminId: number) => {
      // Wenn das Menü für diesen Termin schon offen ist, schließen. Sonst für diesen Termin öffnen.
      setShowDifficultyMenu(showDifficultyMenu === terminId ? null : terminId);
  };

  // --- Handler für Auswahl im Schwierigkeits/Status Menü ---
  // Aktualisiert Schwierigkeit oder Status eines Termins in der DB
   const handleMenuSelection = async (terminId: number, type: 'difficulty' | 'status', value: string) => {
       setError(null);
       setLoadingData(true);
       setShowDifficultyMenu(null); // Menü nach Auswahl immer schließen

       // Bereite das Update-Objekt vor
       const updateData: Partial<Termin> = {}; // Partial, da wir nur einige Felder aktualisieren

       if (type === 'difficulty') {
           updateData.difficulty = value === '' ? null : value; // Leeren String als null speichern
           // Optional: Wenn Schwierigkeit auf 'Abgesagt' gesetzt wird, setze auch Status auf 'abgesagt'
           // if (value === 'Abgesagt') {
           //     updateData.status = 'abgesagt';
           // }
       } else { // type === 'status'
           updateData.status = value === '' ? null : value; // Leeren String als null speichern
           // Optional: Wenn Status von 'abgesagt' auf 'aktiv' zurückgesetzt wird,
           // kannst du optional auch Difficulty zurücksetzen, falls es null war (je nach Logik)
           // const terminToUpdate = termine.find(t => t.id === terminId); // Dazu müsste man den Termin finden
           // if (value !== 'abgesagt' && terminToUpdate?.status === 'abgesagt' && terminToUpdate?.difficulty === null) {
           //     updateData.difficulty = ''; // Beispiel: Setze Difficulty wieder auf leer im UI
           // }
       }


       const { error } = await supabase
           .from('termine')
           .update(updateData as Partial<Termin>) // Add Type assertion here
           .eq('id', terminId); // Aktualisiere den Termin mit dieser ID

       if (error) {
           console.error(`Fehler beim Aktualisieren von ${type}:`, error.message);
           setError(`Fehler beim Aktualisieren von ${type}.`);
       } else {
           // Optional: alert(`${type === 'difficulty' ? 'Schwierigkeit' : 'Status'} erfolgreich aktualisiert!`);
           // Realtime wird den State aktualisieren, UI wird sich anpassen
       }
       setLoadingData(false); // Ladezustand beenden
   };


  // --- Kalender Marker auf Basis geladener Termine ---
  // Zeigt einen Punkt auf Tagen mit Terminen
  const tileContent = ({ date, view }: TileArgs) => {
    if (view === 'month') {
      // Datum im Format 'YYYY-MM-DD' für den Vergleich formatieren
      const dateString = date.toISOString().split('T')[0];
      // Prüfen, ob Termine für dieses Datum im geladenen State existieren
      const hasTermin = termine.some((t) => t.date === dateString);
      if (hasTermin) {
        // Marker anzeigen
        return <div className={styles.terminMarker}></div>;
      }
    }
    return null; // Kein Marker für andere Tage
  };


  // --- Rendern der Seite ---

  // Zeige "Lade Kalender..." während der anfängliche Session Check läuft ODER Daten geladen/gespeichert werden
  if (loadingPage) {
      return <p className={styles.loading}>Lade Kalender...</p>;
  }

  // Haupt-UI der Kalenderseite (wird nur gerendert, wenn der Benutzer angemeldet ist und loadingPage false ist)
  return (
    <div className={styles.outerBox}>
      <div className={styles.container}>
        <h1 className={styles.title}>📅 Bergziegen-Tourkalender 🐐</h1>

        {/* Anzeige von allgemeinen Lade- oder Fehlermeldungen */}
        {loadingData && <p className={styles.loadingData}>Operation läuft...</p> /* Oder ein Spinner */}
        {error && <p className={styles.error}>{error}</p>}

        {/* --- Formular zum Hinzufügen/Bearbeiten von Terminen --- */}
        {/* Formular wird immer angezeigt, der "Speichern" Button ändert sich. */}
        {/* Felder sind deaktiviert während Datenoperationen laufen */}
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Datum Auswahl */}
          <input
            type="date"
            name="date" // Name muss mit formData State übereinstimmen
            value={formData.date}
            onChange={handleInputChange}
            className={styles.input}
            disabled={loadingData}
            required // Datum ist erforderlich
          />
            {/* Titel Eingabe */}
          <input
            type="text"
            name="tour_title" // Name muss mit formData State übereinstimmen
            value={formData.tour_title}
            placeholder="Titel der Tour"
            onChange={handleInputChange}
            className={styles.input}
            disabled={loadingData}
            required // Titel ist erforderlich
          />

            {/* Auswahl Schwierigkeit im Formular (nur sichtbar, wenn NICHT im Bearbeitungsmodus) */}
            {/* Bei Bearbeitung wird dies über das Menü in der Liste geändert */}
            {isEditing === null && (
                 <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className={styles.input}
                    disabled={loadingData}
                 >
                     <option value="">Schwierigkeit wählen (Optional)</option>
                     <option value="Leicht">Leicht</option>
                     <option value="Mittel">Mittel</option>
                     <option value="Schwer">Schwer</option>
                 </select>
            )}

            {/* Auswahl Status im Formular (nur sichtbar, wenn NICHT im Bearbeitungsmodus) */}
            {/* Bei Bearbeitung wird dies über das Menü in der Liste geändert */}
             {isEditing === null && (
                 <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.input}
                    disabled={loadingData}
                 >
                     <option value="aktiv">Status: Aktiv</option> {/* Standard */}
                     <option value="abgesagt">Status: Abgesagt</option>
                 </select>
             )}


            {/* Submit Button für Hinzufügen oder Speichern (Bearbeiten) */}
          <button type="submit" className={styles.button} disabled={loadingData}>
            {isEditing !== null ? 'Änderungen speichern' : 'Termin hinzufügen'}
          </button>

            {/* Abbrechen Button im Bearbeiten Modus (nur sichtbar, wenn im Bearbeitungsmodus) */}
            {isEditing !== null && (
                <button type="button" onClick={handleCancelEdit} className={`${styles.button} ${styles.cancelButton}`} disabled={loadingData}>
                    Abbrechen
                </button>
            )}
        </form>

        {/* --- Kalender Anzeige --- */}
        {/* Zeige den Kalender an, wenn Daten geladen sind */}
        {!loadingData && (
            <div className={styles.calendarContainer}>
              <Calendar
                onChange={(date) => setKalenderDatum(date as Date)} // Datum im State aktualisieren
                value={kalenderDatum} // Ausgewähltes Datum im Kalender
                locale="de-DE" // Sprache des Kalenders
                tileContent={tileContent} // Inhalt für Kalenderzellen (Marker)
                 // Optional: onClickDay, etc. hinzufügen, um auf Klick auf ein Datum zu reagieren
              />
            </div>
        )}


        {/* --- Liste der Termine --- */}
        <div className={styles.list}>
            {/* Zeige Ladezustand, wenn Termine geladen werden */}
            {loadingData && termine.length === 0 && <p>Termine werden geladen...</p>}

            {/* Mappe und zeige die Termine an */}
            {/* Sortiere Termine nach Datum vor dem Mappen */}
          {termine
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Nach Datum sortieren
              .map((t) => (
                 /* Anwenden von CSS-Klassen basierend auf Schwierigkeit (kleingeschrieben) und Status */
                <div key={t.id} className={`${styles.card} ${t.difficulty ? styles[t.difficulty.toLowerCase()] : ''} ${t.status === 'abgesagt' ? styles.abgesagt : ''}`}>
                  <div className={styles.cardInfo}>
                      {/* Datum, Titel */}
                    <strong className={styles.cardDatum}>{t.date}</strong>
                    <p className={styles.cardTitel}>{t.tour_title}</p>
                     {/* Schwierigkeit und Status anzeigen */}
                     {(t.difficulty || t.status) && (
                          <p className={styles.cardDetails}>
                             {t.difficulty && `Schwierigkeit: ${t.difficulty}`}
                             {t.difficulty && t.status && ' | '} {/* Trenner falls beides da */}
                             {t.status && `Status: ${t.status}`}
                          </p>
                     )}
                      {/* Optional: Ersteller-ID anzeigen (wenn E-Mail nicht gejoint wurde) */}
                       {/* <p className={styles.cardCreator}>Erstellt von: {t.user_id.substring(0, 6)}...</p> // Zeige nur die ersten 6 Zeichen */}
                  </div>

                    {/* --- Buttons für Bearbeiten, Status/Schwierigkeit Menü, Löschen --- */}
                    {/* Zeige Buttons nur an, wenn NICHT gerade ein anderer Termin im Formular bearbeitet wird */}
                    <div className={styles.cardButtons}>

                        {/* Button zum Öffnen des Schwierigkeits/Status Menüs */}
                        {/* Zeige Menü-Button nur, wenn dieser Termin NICHT gerade im Formular bearbeitet wird */}
                         {isEditing !== t.id && (
                            <button
                                 type="button"
                                 onClick={() => handleDifficultyMenuToggle(t.id)}
                                 className={`${styles.button} ${styles.menuButton}`}
                                 disabled={loadingData} // Deaktivieren während Datenoperationen
                             >
                                Optionen ▼
                            </button>
                         )}

                        {/* Menü für Schwierigkeit/Status (erscheint, wenn showDifficultyMenu diese ID hat) */}
                        {/* Positioniere dieses Menü absolut, relativ zum cardButtons div */}
                        {showDifficultyMenu === t.id && (
                            <div className={styles.difficultyMenu}>
                               <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Leicht')}>Leicht</button>
                               <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Mittel')}>Mittel</button>
                               <button type="button" onClick={() => handleMenuSelection(t.id, 'difficulty', 'Schwer')}>Schwer</button>
                               <div className={styles.menuSeparator}></div> {/* Trennlinie */}
                               <button type="button" onClick={() => handleMenuSelection(t.id, 'status', 'aktiv')}>Status: Aktiv</button>
                               <button type="button" onClick={() => handleMenuSelection(t.id, 'status', 'abgesagt')}>Status: Abgesagt</button>
                            </div>
                        )}

                         {/* Bearbeiten Button */}
                        {/* Zeige Bearbeiten-Button nur, wenn dieser Termin NICHT gerade im Formular bearbeitet wird */}
                         {isEditing !== t.id && (
                            <button
                                type="button"
                                onClick={() => handleEditButtonClick(t)} // Ruft Handler auf, um Formular zu füllen und Modus zu wechseln
                                className={`${styles.button} ${styles.editButton}`}
                                disabled={loadingData} // Deaktivieren während Datenoperationen
                            >
                                Bearbeiten
                            </button>
                         )}

                        {/* Löschen Button */}
                         {isEditing !== t.id && (
                            <button
                                type="button"
                                onClick={() => handleDelete(t.id)} // Ruft Handler für Löschen auf
                                className={`${styles.button} ${styles.deleteButton}`}
                                disabled={loadingData} // Deaktivieren während Datenoperationen
                            >
                                Löschen
                            </button>
                         )}
                      </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}