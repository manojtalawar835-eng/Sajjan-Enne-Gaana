# Sajjan Enne Gaana — Storefront Prototype

A working front-end prototype of the Sajjan Enne Gana e-commerce site: landing page,
customer login/OTP flow, product dashboard, cart, checkout, order tracking, and an
owner dashboard with live-editable prices. Built with plain HTML/CSS/JS — no build
step, no dependencies.

## Running it

Just open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then visit the printed URL. No installation required.

## File structure

```
sajjan-enne-gana/
├── index.html          # all pages/views (single-page app, JS toggles visibility)
├── css/
│   └── style.css        # all styling, theme variables (light/dark)
├── js/
│   └── app.js            # app state, product data, cart/checkout/owner logic
├── images/                # product photos & logo (optimized for web)
└── README.md
```

## What's real vs. simulated

This is a **front-end-only prototype** — there is no backend, database, or live
integrations behind it. Specifically:

| Feature | Status |
|---|---|
| Browsing, cart, wishlist, filters | Fully functional (client-side state) |
| OTP login | **UI only** — any 6 digits "verifies". No SMS/email is sent. |
| Owner price editing | Updates in-memory only; resets on page reload |
| Checkout / Place Order | Creates a fake order ID client-side; nothing is persisted |
| UPI QR code | A visual placeholder, not a real payment QR |
| Order tracking | Shows a mock timeline, not real order state |

None of this is wired to Firebase, a database, or a payment gateway — building
that out is a separate, much larger project (see below).

## Turning this into the real, full-stack app

The original brief asked for:

- **Frontend:** React + Next.js + TypeScript
- **Backend:** Node.js + Express
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Firebase OTP (real SMS/email delivery)
- **Payments:** UPI/PhonePe dynamic QR + Cash on Delivery
- **Image storage:** Cloudinary
- **Deployment:** Vercel (frontend) + Railway/Supabase (backend)

To get there from this prototype, roughly:

1. **Stand up a Firebase project** and enable Phone/Email OTP auth — replace the
   `sendOtp()` / `verifyOtp()` stubs in `app.js` with real Firebase Auth calls.
2. **Design the Postgres schema** (Users, Products, Orders, Order Items — a draft
   is in the original brief) and scaffold it with Prisma.
3. **Build an Express (or Next.js API routes) backend** exposing REST/GraphQL
   endpoints for products, cart, orders, and owner management — move the
   `PRODUCTS` array and `state.orders` in `app.js` into real database tables.
4. **Get a UPI payment gateway** (Razorpay, Cashfree, or a direct UPI intent
   link) to generate real dynamic QR codes and confirm payments via webhook.
5. **Move image hosting to Cloudinary** and update the owner "add product" flow
   to upload there.
6. **Deploy**: frontend to Vercel, backend + Postgres to Railway or Supabase.

Happy to help scaffold any of these pieces (Prisma schema, Express routes,
Firebase Auth wiring) as a next step — just ask.
