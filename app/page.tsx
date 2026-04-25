export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/woocommerce';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="container">
      <h1>Home (Pilot)</h1>
      <p style={{ color: 'var(--muted)' }}>
        This is the pilot Home page powered by WooCommerce REST API.
      </p>
      <div style={{ margin: '16px 0 24px' }}>
        <Link className="button" href="/shop">
          Go to Shop (PLP)
        </Link>
      </div>
      <section>
        <h2>Featured Products</h2>
        <div className="grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
