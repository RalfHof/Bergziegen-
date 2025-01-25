import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="column">
        <h4>Information</h4>
        <Link href="/faq">FAQ</Link><br />
        <Link href="/login">Login</Link>
      </div>
      <div className="column">
        <h4>Kontakt</h4>
        <Link href="/legal/impressum">Impressum</Link><br />
        <Link href="/legal/datenschutz">Datenschutz</Link>
      </div>
    </footer>
  );
}