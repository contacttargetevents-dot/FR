import 'server-only';
import { WooProduct } from './types';

const baseUrl = process.env.WOOCOMMERCE_URL ?? 'https://staging.firstroom.in';
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

function getAuthHeader() {
  if (!consumerKey || !consumerSecret) {
    return null;
  }

  const token = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  return `Basic ${token}`;
}

async function wooFetch<T>(path: string, nextRevalidate = 60): Promise<T> {
  const authHeader = getAuthHeader();

  if (!authHeader) {
    throw new Error('Missing WooCommerce API credentials in environment variables.');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Authorization: authHeader
    },
    next: { revalidate: nextRevalidate }
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function getFeaturedProducts(): Promise<WooProduct[]> {
  try {
    return await wooFetch<WooProduct[]>('/wp-json/wc/v3/products?featured=true&per_page=8', 120);
  } catch (error) {
    console.error('Failed to fetch featured products', error);
    return [];
  }
}

export async function getProducts(page = 1, perPage = 12): Promise<WooProduct[]> {
  try {
    return await wooFetch<WooProduct[]>(`/wp-json/wc/v3/products?page=${page}&per_page=${perPage}`, 60);
  } catch (error) {
    console.error('Failed to fetch product list', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  try {
    const products = await wooFetch<WooProduct[]>(`/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`, 60);
    return products[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch product by slug: ${slug}`, error);
    return null;
  }
}
