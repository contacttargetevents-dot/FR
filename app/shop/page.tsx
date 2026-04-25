import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/woocommerce';

export default async function ShopPage() {
  const products = await getProducts(1, 24);

  return (
    <main className="container">
      <h1>Shop (PLP Pilot)</h1>
      <p style={{ color: 'var(--muted)' }}>API-backed product listing page scaffold.</p>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
