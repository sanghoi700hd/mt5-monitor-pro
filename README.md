# MT5 Monitor Pro

MT5 Monitor Pro is a production-oriented monitoring and operations platform for MetaTrader 5 accounts. It combines a Next.js dashboard, Cloudflare Workers for ingestion and API delivery, Cloudflare D1 for durable storage, and an Expert Advisor implementation in the ea/ folder for event streaming and trade monitoring.

## Architecture

- Frontend: Next.js 15 with TypeScript and Tailwind CSS
- API layer: Cloudflare Workers for secure, low-latency event handling
- Data layer: Cloudflare D1 for account, position, trade, alert, and audit storage
- Integration layer: MetaTrader 5 Expert Advisor (MQL5) for real-time signal publication

## Repository layout

- apps/dashboard: Next.js application shell and dashboard UI
- apps/worker: Cloudflare Worker entry points and business logic
- database: D1 migration files and schema definitions
- ea: MQL5 Expert Advisor source for MT5 integration
- packages/shared: shared types and utility modules
- packages/types: domain models and transport contracts

## Prerequisites

- Node.js 20.12+ and pnpm 9+
- A Cloudflare account with access to Workers and D1
- A MetaTrader 5 terminal with the MQL5 Expert Advisor compiled for your environment

## Initial setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create the D1 database:
   ```bash
   wrangler d1 create mt5-monitor-pro
   ```
3. Update the database ID in wrangler.toml with the output from the previous command.
4. Apply the schema:
   ```bash
   pnpm db:migrate
   ```
5. Start the dashboard locally:
   ```bash
   pnpm dev
   ```

## Deployment

- Deploy the Worker:
  ```bash
  pnpm deploy:worker
  ```
- Apply remote D1 migrations:
  ```bash
  pnpm db:migrate:remote
  ```

## Security and operations notes

- Keep all broker credentials and secrets in Cloudflare Secrets or environment bindings.
- Use signed requests between the MetaTrader 5 Expert Advisor and the Worker endpoint.
- Review access controls before exposing the dashboard publicly.
- Enable observability and alerting for trade ingestion failures and Worker errors.

## MQL5 integration

The Expert Advisor under ea/ should publish normalized trade and account events to the Worker endpoints using authenticated POST requests. Keep the payload schema consistent with the shared packages/types definitions to preserve compatibility across the platform.
