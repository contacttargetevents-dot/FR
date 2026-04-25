import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { getProductBySlug } from '@/lib/woocommerce';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const image = product.images[0]?.src;
  const priceNumber = Number(product.price || product.regular_price || 0);

  return (
    <main className="container" style={{ display: 'grid', gap: 24 }}>
      <h1>{product.name}</h1>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
          ) : null}
        </div>
        <div className="card">
          <p style={{ color: 'var(--muted)' }}>₹{product.price || product.regular_price}</p>
          <div dangerouslySetInnerHTML={{ __html: product.short_description || product.description }} />
          <AddToCartButton
            item={{
              id: product.id,
              name: product.name,
              price: priceNumber,
              quantity: 1,
              image,
              slug: product.slug
            }}
          />
        </div>
      </div>
    </main>
  );
}
