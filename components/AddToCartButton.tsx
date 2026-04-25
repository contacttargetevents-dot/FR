'use client';

import { CartItem } from '@/lib/types';

type Props = {
  item: CartItem;
};

export function AddToCartButton({ item }: Props) {
  function handleAdd() {
    const raw = localStorage.getItem('pilot-cart');
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];
    const existing = cart.find((x) => x.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('pilot-cart', JSON.stringify(cart));
    alert('Added to cart');
  }

  return (
    <button className="button" onClick={handleAdd}>
      Add to cart
    </button>
  );
}
