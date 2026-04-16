# Project: GiftWise (The Gifting Concierge)
**Status:** MVP / Bootstrap Phase
**Stack:** Next.js 15 (App Router), Tailwind CSS, Vercel, JSON-based DB.

## Core Philosophy
- **Editorial over Catalog:** We are a filter, not a store. The UI must feel like a fashion magazine.
- **Zero Friction:** No login for browsing. High priority on "Open to Buy" (OTB) click tracking.
- **Low Burn:** All data is served from `/data/products.json`. No expensive database connections.

## Tech Rules
1. Use **Lucide React** for icons.
2. Product data must be fetched from a local JSON file.
3. Every outbound click must be routed through `/api/track` to log analytics before redirecting to the affiliate URL.
4. Mobile-first design: The primary audience uses high-end smartphones.

## Revenue Flow
- Primary: Affiliate (Amazon/Myntra).
- Secondary: Digital Art Upsell (Redirects to WhatsApp for personalization).
