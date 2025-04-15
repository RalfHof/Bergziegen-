import React from 'react';
import styles from './page.module.css'; // Erstellen Sie diese Datei, wenn sie nicht existiert

export default function ImpressumPage() {
  return (
    <div className={styles.container}>
      <h1>Impressum</h1>
      <p>
        <b>Anbieter:</b><br />
        [Name Ihres Unternehmens/Ihrer Gruppe]<br />
        [Adresse Ihres Unternehmens/Ihrer Gruppe]<br />
        <br />
        <b>Vertretungsberechtigt:</b><br />
        [Name des Vertretungsberechtigten]<br />
        <br />
        <b>Kontakt:</b><br />
        [Ihre E-Mail-Adresse]<br />
        [Ihre Telefonnummer (optional)]<br />
        <br />
        <b>Umsatzsteuer-ID:</b><br />
        [Umsatzsteuer-ID (falls vorhanden)]<br />
        <br />
        <b>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</b><br />
        [R.Hofmann]<br />
        [Adresse des Verantwortlichen]<br />
        <br />
        <b>Haftungsausschluss:</b><br />
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
      </p>
    </div>
  );
}