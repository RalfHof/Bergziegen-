import React from 'react';
import styles from './page.module.css'; // Erstellen Sie diese Datei, wenn sie nicht existiert

export default function DatenschutzPage() {
  return (
    <div className={styles.container}>
      <h1>Datenschutzerklärung</h1>
      <p>
        Wir freuen uns über Ihr Interesse an unserer Website. Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Im Folgenden informieren wir Sie über den Umgang mit Ihren Daten gemäß DSGVO.
      </p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
        R.Hofmann]<br />
        [Die Bergziegen]<br />
        [ralfhille1982@googlemail.com]<br />
        [Habt ihr schon]
      </p>

      <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
      <p>
        Wir erheben, verarbeiten und nutzen Ihre personenbezogenen Daten nur, soweit dies zur Erfüllung des jeweiligen Zwecks erforderlich ist. Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden „betroffene Person“) beziehen.
      </p>

      <h2>3. Nutzung und Weitergabe personenbezogener Daten</h2>
      <p>
        Wir nutzen Ihre personenbezogenen Daten zur Bereitstellung der angeforderten Dienste, zur Bearbeitung Ihrer Anfragen und zur Kommunikation mit Ihnen. Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, wenn dies zur Vertragserfüllung erforderlich ist, Sie ausdrücklich eingewilligt haben oder eine gesetzliche Verpflichtung zur Weitergabe besteht.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Einige Cookies werden nach dem Schließen Ihres Browsers wieder gelöscht (sog. Session-Cookies), andere verbleiben auf Ihrem Endgerät und ermöglichen uns, Ihren Browser beim nächsten Besuch wiederzuerkennen (sog. Persistente Cookies).
      </p>

      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit Ihrer personenbezogenen Daten. Sie haben zudem das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
      </p>

      <h2>6. Widerspruchsrecht</h2>
      <p>
        Sie haben das Recht, jederzeit Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen, die aufgrund von Art. 6 Abs. 1 lit. f DSGVO erfolgt.
      </p>

      <h2>7. Änderungen dieser Datenschutzerklärung</h2>
      <p>
        Wir behalten uns das Recht vor, diese Datenschutzerklärung jederzeit zu ändern. Die jeweils aktuelle Version der Datenschutzerklärung ist auf unserer Website abrufbar.
      </p>
    </div>
  );
}