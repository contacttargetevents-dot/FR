import Link from 'next/link';
import { WooProduct } from '@/lib/types';

type Props = {
  product: WooProduct;
};

export function ProductCard({ product }: Props) {
  const image = product.images[0]?.src;

  return (
    <article className="card">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={product.name} style={{ width: '100%', borderRadius: 8, aspectRatio: '1/1', objectFit: 'cover' }} />
      ) : null}
      <h3 style={{ marginBottom: 8 }}>{product.name}</h3>
      <p style={{ color: 'var(--muted)', marginTop: 0 }}>₹{product.price || product.regular_price}</p>
      <Link className="button" href={`/product/${product.slug}`}>View Product</Link>
    </article>
  );
}
