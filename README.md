# FirstRoom Next.js Pilot (Home + PLP + PDP + Cart)

This repository now contains a pilot Next.js storefront wired to WooCommerce REST API for:
- Home
- Product Listing Page (PLP)
- Product Detail Page (PDP)
- Cart (pilot-only local cart)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Put your WooCommerce credentials in `.env.local`:
   - `WOOCOMMERCE_URL`
   - `WOOCOMMERCE_CONSUMER_KEY`
   - `WOOCOMMERCE_CONSUMER_SECRET`

4. Run development server:
   ```bash
   npm run dev
   ```

## Notes
- Credentials are intentionally read from environment variables and are **not committed**.
- Cart is localStorage-based only for pilot speed; replace with Woo Store API cart for production parity.
