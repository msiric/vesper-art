# Vesper

An art marketplace portfolio project by Mario Siric. It demonstrates browsing, artist profiles, favorites, comments, artwork uploads, collections, simulated orders and license-record verification.

The restored demo uses **fictional accounts and simulated transactions**. It does not collect money, send email, or grant real rights to artwork. The former `vesperart.co` deployment is retired; current deployment status is in [DEPLOYMENT.md](DEPLOYMENT.md).

## Explore

The bundled gallery contains 28 sample artworks and opens without waking the API. Start a live demo to create a temporary account and use the real Express/PostgreSQL workflows. Accounts expire after 24 hours; a later session creation prunes expired data. Uploads and comments can be visible to other visitors. Use non-sensitive test content only.

Free-hosting limits: 50 active temporary accounts, 60 successful mutations per account, 2 MiB of stored images per account, bounded requests, and a maximum of 20 short-lived notification connections. New image uploads accept JPEG/PNG, at most 2 MB and 4 megapixels, and are resized/re-encoded. Payments, SMTP, external object storage and analytics writes are disabled.

## Local development

Use Node 22.13+ in the Node 22 line and a separate PostgreSQL 16 database named `vesper_demo`.

1. Copy `.env.example` to `.env`. Set the local database URL and generate three independent secrets of at least 32 random characters.
2. Run `npm ci` and `npm --prefix client ci`.
3. Run `npm run build && npm run migrate`.
4. Run `npm start` and `npm --prefix client start` in separate terminals.
5. Open http://127.0.0.1:5175 (API port 5075).

`npm test` runs real PostgreSQL integration tests and Pages proxy checks, using only a local demo database. `node scripts/migration-roundtrip.cjs` creates and removes its own local test database to verify migration up/down/up. `npm run build:client` builds the frontend. Schema synchronization and the old destructive fixture runner are disabled.

## Hosting

Cloudflare Pages hosts the React/Vite frontend and bundled sample images. A same-origin Pages Function forwards live API requests to a Render Free service. Neon Free provides a separate PostgreSQL database, including bounded temporary image storage. Socket.IO uses HTTP polling with authenticated, three-minute connections that close when the page is hidden.

The older Material UI interface is retained. CRA, obsolete server dependencies, broken S3 links and production payment/email requirements have been replaced for the public demo. The original project also explored Stripe Connect, commercial licensing and sales dashboards; those real-commerce integrations are intentionally disabled here.

## Original walkthrough

![Original demo](https://github.com/msiric/vesper-art/assets/26199969/8a981c5a-c0a1-4510-a847-71ec95dcf8c0)

ISC license.
