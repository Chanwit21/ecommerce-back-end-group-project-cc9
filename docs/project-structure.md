# Ecommerce modernization

Frontend: Next.js 16 / React 19 on http://127.0.0.1:3200. Backend: NestJS 11 / Sequelize on http://127.0.0.1:4200. Separate cloned Git histories are preserved in frontend and backend.

## Run

Node.js 24+ and npm are required.

```sh
npm run install:all
# Copy backend/.env.example to backend/.env and set SECRET_KEY.
# Copy frontend/.env.example to frontend/.env.local and set SESSION_SECRET (32+ random characters).
ALLOW_DEMO_SEED=true npm run db:seed
npm run dev
```

This checkout already has ignored local secrets and PostgreSQL. `npm run build` builds both apps. `npm run test:smoke` checks both running servers. Production: build, then npm start in each repository; use HTTPS for Secure cookies. PostgreSQL DATABASE_URL and DB_SCHEMA are required; production schemas are never auto-synced. Demo seed requires ALLOW_DEMO_SEED=true and does not drop data.

## Demo accounts

Password: `DemoShop!2026`.

- CUSTOMER: customer@ecommerce.local
- ADMIN: admin@ecommerce.local

Products and the single Bangkok location are synthetic examples. Payment-related ordering/card screens retain the original provider flow. Payments return 503 until Omise is configured; no payment transaction was tested. Social login is disabled until server verification of provider identity is implemented; the original client-trusted profile login is unsafe. Cloudinary is optional; local images are served at /uploads.

## Structure

Frontend follows drug-store's feature pattern: app/(guest), app/(user), modules/<feature>/views, components, providers, shared and services/adapter. API calls go through a Next route handler, which keeps JWTs in signed HttpOnly cookies and forwards them to Nest. Proxy validates the signed role snapshot and expiry before protected page requests; Nest Passport verifies JWTs and current database roles for API authorization. Session restore refreshes user information. Mutating API calls require a same-origin Origin header. Never expose SESSION_SECRET as NEXT_PUBLIC_.

Backend follows payment-service's layered feature concept: presentation controllers, injected application services, infrastructure adapters, domain contracts, and feature modules. The catalogue uses a framework-independent ProductRepository with a Sequelize implementation. Remaining operations retain JavaScript handlers behind a compatibility boundary; they are not yet fully typed domain use cases. Existing schemas retain legacy field names (including cetagory and quality) to preserve contracts.

Modern public routes: /products/[category], /products/detail/[productName], /login, /register, /contact and /terms. Customer routes: /account, /account/orders, /account/addresses, /favorite, /cart and /checkout. Admin routes: /admin/products, /admin/orders, /admin/inbox and /admin/transactions. Old URLs redirect to canonical paths. The home, catalogue, product detail, auth, cart and dashboards use the new responsive rose/cream theme; several management/address/order views remain transitional legacy UI. Browser checks cover customer sign-in, browsing and product details; cart operations are covered by API tests; real payments and all legacy order scenarios remain unverified.

Startup scripts and integration tests live at this workspace root. Each child repository includes its own README and copies of project docs for standalone setup. The original SQL dumps remain historical references and are not imported or executed by the seed.
