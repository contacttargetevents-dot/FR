'use client';

import { CartItem } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('pilot-cart');
    setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
  }, []);

  function updateQuantity(id: number, quantity: number) {
    const next = items
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
      .filter((item) => item.quantity > 0);
    setItems(next);
    localStorage.setItem('pilot-cart', JSON.stringify(next));
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  if (!items.length) {
    return (
      <div className="card">
        <p>Your cart is empty.</p>
        <Link className="button" href="/shop">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((item) => (
        <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{item.name}</strong>
            <p style={{ margin: '4px 0', color: 'var(--muted)' }}>₹{item.price}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button className="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="card">
        <strong>Total: ₹{total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
