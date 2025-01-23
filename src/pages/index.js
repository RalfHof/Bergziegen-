import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Willkommen Bei den Bergziegen</h1>
      <nav>
        <ul>
          <li><Link href="/about">Über uns</Link></li>
          <li><Link href="/legal/impressum">Impressum</Link></li>
          <li><Link href="/legal/datenschutz">Datenschutz</Link></li>
          <li><Link href="/auth/login">Login</Link></li>
          <li><Link href="/auth/register">Registrieren</Link></li>
        </ul>
      </nav>
    </div>
  );
}
