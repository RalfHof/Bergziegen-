import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <Link href="/">
        <Image src="/logo.png" alt="Die Bergziegen" width={50} height={50} priority /> {/* priority hinzugefügt */}
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/touren">Touren</Link>
        <Link href="/ueber-uns">Über Uns</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Registrieren</Link>
      </nav>
    </header>
  );
}