import React from 'react';
import styles from './page.module.css'; // Erstellen Sie diese Datei, wenn sie nicht existiert

export default function KontaktPage() {
  return (
    <div className={styles.container}>
      <h1>Kontakt</h1>
      <p>
        Sie erreichen uns unter folgenden Kontaktdaten:
      </p>
      <p>
        <b>E-Mail:</b><br />
        [Ihre E-Mail-Adresse]<br />
      </p>
      <p>
        <b>Telefon:</b><br />
        [Ihre Telefonnummer (optional)]<br />
      </p>
      <p>
        Gerne können Sie auch das folgende Kontaktformular nutzen:
      </p>
      {/* Hier könnte ein Kontaktformular stehen, falls Sie eines haben */}
    </div>
  );
}