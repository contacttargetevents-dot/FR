# WordPress/WooCommerce to Next.js + WooCommerce REST API Migration Plan

## Goal
Rebuild the current storefront (`https://staging.firstroom.in/`) with a high-performance frontend using **React + Next.js**, while retaining WooCommerce as the backend for products, pricing, inventory, orders, and payments.

## Key Constraint
All public-facing pages and flows should match the existing site as closely as possible (layout, content structure, navigation, and user journeys), with performance and maintainability improvements.

---

## Recommended Architecture

### Backend (keep existing)
- WordPress + WooCommerce remains the source of truth.
- Continue using existing WooCommerce admin workflows for catalog/order management.
- Expose data via:
  - WooCommerce REST API (`/wp-json/wc/v3/...`) for commerce entities.
  - WordPress REST API (`/wp-json/wp/v2/...`) for pages/posts/blog content.
- Add/verify CORS, rate limiting, and API key restrictions.

### Frontend (new)
- Next.js (App Router) + React.
- Rendering strategy:
  - **Static generation + revalidation** for mostly static pages (home, categories, CMS pages).
  - **Server rendering** for dynamic/private flows (cart, checkout, account).
- Data access through a typed API layer (server-side route handlers or server actions).
- Image optimization via `next/image` and modern formats.
- CDN + edge caching for public pages and assets.

### Suggested Stack
- Next.js 15+ (TypeScript)
- Tailwind CSS (or CSS Modules if strict design parity requires custom CSS)
- State/query layer: TanStack Query (client) + server fetch layer
- Forms: React Hook Form + Zod validation
- Auth/session for customer account and cart persistence via WooCommerce cookies/tokens

---

## Exact-Rebuild Execution Plan

### Phase 0 — Discovery & Baseline
1. Crawl and list all live/staging URLs and templates.
2. Capture desktop/mobile screenshots for every page type.
3. Record baseline performance (LCP, CLS, INP, TTFB) from staging.
4. Inventory WooCommerce dependencies:
   - payment gateways
   - shipping plugins
   - coupons/rules
   - taxes/GST
   - custom product types/fields

**Deliverables:** URL inventory, component inventory, plugin compatibility matrix, and performance baseline.

### Phase 1 — Design System & Layout Parity
1. Extract spacing, colors, fonts, breakpoints, and reusable UI components.
2. Build shared primitives (header, footer, nav, cards, filters, forms, modals).
3. Implement global layout and responsive behavior to match current site.

**Deliverables:** reusable design system and parity-approved shell.

### Phase 2 — Core Commerce Pages
Recreate all storefront pages with API-driven data:
- Home
- Shop/category listing
- Product detail page
- Search
- Cart
- Checkout
- Order confirmation
- Static CMS pages (about, contact, policies)
- Blog (if currently used)

**Deliverables:** clickable full storefront in Next.js with real WooCommerce data.

### Phase 3 — Customer & Transaction Flows
1. Login/register/reset password.
2. My Account (orders, addresses, profile).
3. Coupons, taxes, shipping methods, payment flow.
4. Transaction webhooks and order status sync checks.

**Deliverables:** end-to-end purchase and account flow parity.

### Phase 4 — SEO, Analytics, and Ops
1. SEO parity:
   - meta tags
   - canonical URLs
   - schema markup
   - sitemap/robots
2. Analytics parity (GA/GTM/Meta Pixel etc.).
3. 301 redirect map from old routes to Next routes.
4. Observability: error logging + uptime + performance monitoring.

**Deliverables:** production-readiness checklist and launch playbook.

### Phase 5 — QA, UAT, and Go-Live
1. Cross-browser and responsive QA.
2. API failure-state handling and fallback UX.
3. Load/perf testing for peak traffic.
4. Content freeze, final sync, and cutover.
5. Post-launch hypercare (48–72 hours).

---

## Page-by-Page Implementation Checklist (with Story Points + API Contracts)

> Story points are indicative (Fibonacci scale) and should be finalized after plugin audit.

### 1) Global Layout Shell (Header/Footer/Nav/Mega menu)
- **Estimated effort:** 8 points
- **Pages impacted:** all
- **Checklist**
  - [ ] Rebuild header with announcement bar, search, account, cart, and mobile nav drawer.
  - [ ] Rebuild footer with policy/support/contact links and newsletter block.
  - [ ] Match typography, spacing scale, and breakpoints with staging screenshots.
  - [ ] Add skeleton loaders and fallback states for nav/category fetch.
- **Primary API contracts**
  - `GET /wp-json/wp/v2/menus/*` *(or plugin/custom endpoint)*
  - `GET /wp-json/wc/v3/products/categories`
  - `GET /wp-json/wp/v2/pages?slug=<slug>` (footer static blocks if CMS-driven)

### 2) Home Page
- **Estimated effort:** 8 points
- **Route:** `/`
- **Checklist**
  - [ ] Hero, featured categories, featured products, promo strips, trust badges.
  - [ ] Recreate all sections in exact sequence as current site.
  - [ ] Implement section-level caching and ISR.
  - [ ] Validate mobile stacking and image crop parity.
- **Primary API contracts**
  - `GET /wp-json/wp/v2/pages?slug=home`
  - `GET /wp-json/wc/v3/products?featured=true&per_page=<n>`
  - `GET /wp-json/wc/v3/products/categories?per_page=<n>`

### 3) Shop / Product Listing Page (PLP)
- **Estimated effort:** 13 points
- **Routes:** `/shop`, `/product-category/[slug]`
- **Checklist**
  - [ ] Grid/list toggle if present in current site.
  - [ ] Sorting (popularity, latest, price ASC/DESC).
  - [ ] Faceted filters (category, attribute, price, stock, rating as applicable).
  - [ ] Pagination or infinite scroll parity.
  - [ ] URL query params for shareable filter state.
- **Primary API contracts**
  - `GET /wp-json/wc/v3/products?category=<id>&page=<p>&per_page=<n>&orderby=<sort>&order=<dir>`
  - `GET /wp-json/wc/v3/products/attributes`
  - `GET /wp-json/wc/v3/products/attributes/<id>/terms`
  - Custom endpoint may be required for aggregated filter counts.

### 4) Product Detail Page (PDP)
- **Estimated effort:** 13 points
- **Route:** `/product/[slug]`
- **Checklist**
  - [ ] Gallery with zoom/swipe and thumbnail behavior matching existing site.
  - [ ] Variable product selection (size/color/etc.) with price/stock updates.
  - [ ] Delivery/policy info blocks, related/upsell products.
  - [ ] Reviews section parity (if enabled).
  - [ ] Sticky add-to-cart CTA behavior on mobile if present.
- **Primary API contracts**
  - `GET /wp-json/wc/v3/products?slug=<slug>`
  - `GET /wp-json/wc/v3/products/<id>/variations`
  - `GET /wp-json/wc/v3/products/<id>` (upsell/cross-sell IDs)
  - `GET /wp-json/wc/v3/products/reviews?product=<id>`

### 5) Search + Autocomplete
- **Estimated effort:** 5 points
- **Routes:** `/search`, header autocomplete
- **Checklist**
  - [ ] Keyword result page parity with current cards.
  - [ ] Debounced autocomplete with keyboard navigation.
  - [ ] No-result state and suggestion UX.
- **Primary API contracts**
  - `GET /wp-json/wc/v3/products?search=<q>&per_page=<n>`
  - Optional custom endpoint for weighted autocomplete relevance.

### 6) Cart
- **Estimated effort:** 8 points
- **Route:** `/cart`
- **Checklist**
  - [ ] Add/remove/update quantity with optimistic UI.
  - [ ] Coupon apply/remove.
  - [ ] Shipping/tax estimate parity.
  - [ ] Cart persistence for guest and logged-in users.
- **Primary API contracts**
  - Preferred: Woo Store API (`/wp-json/wc/store/cart/*`) for cart sessions.
  - Fallback: custom WP endpoints if Store API or plugin setup is constrained.

### 7) Checkout
- **Estimated effort:** 13 points
- **Route:** `/checkout`
- **Checklist**
  - [ ] Billing/shipping forms with validation and autofill parity.
  - [ ] Shipping method selection and recalculation.
  - [ ] Payment gateway integration (Razorpay/Stripe/others used on site).
  - [ ] Coupon/tax/order summary accuracy against Woo totals.
  - [ ] Error and retry flows for payment failure/timeouts.
- **Primary API contracts**
  - `POST /wp-json/wc/store/checkout`
  - Gateway-specific token/intent endpoints
  - `POST /wp-json/wc/v3/orders` (if Store API flow not used)

### 8) Order Success / Thank You
- **Estimated effort:** 3 points
- **Route:** `/order-received/[orderKey]`
- **Checklist**
  - [ ] Accurate order summary and payment status.
  - [ ] Continue shopping and order tracking CTA parity.
  - [ ] Conversion events firing (analytics/pixels).
- **Primary API contracts**
  - `GET /wp-json/wc/v3/orders/<id>` *(server-side only for auth/security)*

### 9) Authentication
- **Estimated effort:** 5 points
- **Routes:** `/account/login`, `/account/register`, `/account/forgot-password`
- **Checklist**
  - [ ] Login/register parity with existing forms and messages.
  - [ ] Password reset email flow.
  - [ ] Session persistence and logout behavior.
- **Primary API contracts**
  - WP auth/JWT/session endpoint setup (depends on chosen auth strategy)
  - `POST /wp-json/wp/v2/users/register` *(if enabled/customized)*

### 10) My Account
- **Estimated effort:** 8 points
- **Routes:** `/account`, `/account/orders`, `/account/addresses`, `/account/details`
- **Checklist**
  - [ ] Order list + order detail.
  - [ ] Address CRUD with default billing/shipping.
  - [ ] Profile update and password change.
  - [ ] Empty states and error states parity.
- **Primary API contracts**
  - `GET /wp-json/wc/v3/customers/<id>`
  - `PUT /wp-json/wc/v3/customers/<id>`
  - `GET /wp-json/wc/v3/orders?customer=<id>`

### 11) CMS Static Pages (About/Contact/Policies)
- **Estimated effort:** 3 points
- **Routes:** `/about`, `/contact`, `/privacy-policy`, `/terms`, etc.
- **Checklist**
  - [ ] Render CMS content with typography parity.
  - [ ] Preserve internal links and assets.
  - [ ] Add SEO metadata parity per page.
- **Primary API contracts**
  - `GET /wp-json/wp/v2/pages?slug=<slug>`

### 12) Blog (if active)
- **Estimated effort:** 5 points
- **Routes:** `/blog`, `/blog/[slug]`
- **Checklist**
  - [ ] Blog listing and detail parity.
  - [ ] Category/tag pages if currently used.
  - [ ] Author/date/share components parity.
- **Primary API contracts**
  - `GET /wp-json/wp/v2/posts`
  - `GET /wp-json/wp/v2/posts?slug=<slug>`
  - `GET /wp-json/wp/v2/categories`

### 13) Cross-cutting SEO/Analytics/Redirects
- **Estimated effort:** 8 points
- **Checklist**
  - [ ] Meta title/description/canonical parity.
  - [ ] OpenGraph/Twitter card coverage.
  - [ ] Structured data (Organization, Product, Breadcrumb, Article).
  - [ ] 301 redirect map from WP routes to Next routes.
  - [ ] GA/GTM/Meta pixel event parity across funnel.
- **Primary API contracts**
  - SEO fields from Yoast/RankMath endpoints if used.
  - Analytics events via client + server conversion APIs.

### 14) QA + Performance Hardening
- **Estimated effort:** 8 points
- **Checklist**
  - [ ] Visual regression against staging screenshots.
  - [ ] API contract tests and failure handling.
  - [ ] Lighthouse/Web Vitals budget enforcement.
  - [ ] Browser/device matrix sign-off.

**Total indicative effort:** ~108 story points

---

## API Contract Layer (recommended in codebase)
Use a dedicated typed contract layer in Next.js so page components never call Woo endpoints directly.

- `api/catalog.ts` → categories, products, filters, search
- `api/product.ts` → PDP, variations, reviews, related products
- `api/cart.ts` → add/remove/update/coupon
- `api/checkout.ts` → shipping/payment/order submit
- `api/account.ts` → customer profile, addresses, order history
- `api/cms.ts` → pages, blog posts, menus

Each module should define:
1. Request params schema (Zod)
2. Response schema validation (Zod)
3. Cache policy (`force-cache`, revalidate windows, or no-store)
4. Error mapping to user-facing fallback states

---

## WooCommerce API Integration Notes

### Data Types
- Products, categories, attributes, variations
- Prices, stock, sale rules
- Cart and checkout endpoints (custom handling may be needed)
- Customers and orders

### Practical Considerations
- Some WooCommerce plugin features are not fully exposed by REST; custom WP endpoints may be required.
- Checkout complexity (shipping/payment plugins) usually needs a compatibility validation pass early.
- Use server-side calls for sensitive API keys and order operations.

---

## Performance Targets (recommended)
- LCP: < 2.5s
- CLS: < 0.1
- INP: < 200ms
- Category/Product page payload budgets with strict image and script budgets

High-impact optimizations:
- ISR/revalidation for catalog pages
- aggressive CDN caching
- critical CSS + deferred non-critical JS
- optimized product image pipeline
- third-party script governance (only essential scripts)

---

## Team & Timeline (typical)
- 1 Next.js frontend lead
- 1 WooCommerce/WordPress backend engineer
- 1 QA engineer
- 1 UI/UX reviewer

Estimated timeline for complete parity ecommerce rebuild: **8–14 weeks** (depends heavily on plugin/customization complexity).

---

## Confirmed Project Decisions (as of 2026-04-25)
1. Checkout flow must be **100% identical** to current WooCommerce site behavior and UX.
2. Account flows must be **100% identical** (login/register/forgot password/profile/orders/addresses).
3. Pilot scope approved: **Home + PLP + PDP + Cart** as the first implementation milestone.

---

## Immediate Next Steps
1. Lock parity acceptance criteria for checkout/account (field order, validations, coupon behavior, shipping/payment steps, error states).
2. Share plugin list from current WooCommerce install.
3. Approve page inventory and parity criteria.
4. Start pilot implementation immediately with: Home + PLP + PDP + Cart.
5. Define pilot success gates: visual parity sign-off, API contract stability, and target performance budgets.

With these decisions confirmed, implementation can begin immediately with a detailed sprint plan.
