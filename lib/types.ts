export type WooImage = {
  id: number;
  src: string;
  alt: string;
};

export type WooProduct = {
  id: number;
  slug: string;
  name: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  short_description: string;
  description: string;
  images: WooImage[];
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
};
