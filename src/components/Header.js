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
        <Link href="/about">Über Uns</Link>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Registrieren</Link>
      </nav>
    </header>
  );
}