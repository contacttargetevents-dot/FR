import { CartClient } from '@/components/CartClient';

export default function CartPage() {
  return (
    <main className="container">
      <h1>Cart (Pilot)</h1>
      <p style={{ color: 'var(--muted)' }}>
        Client-side cart is temporary for pilot validation. Will be replaced with Woo Store API session cart for full parity.
      </p>
      <CartClient />
    </main>
  );
}
