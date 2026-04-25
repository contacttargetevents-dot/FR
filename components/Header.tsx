import Link from 'next/link';

export function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link href="/">
          <strong>FirstRoom Pilot</strong>
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>
    </header>
  );
}
