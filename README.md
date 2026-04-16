# ClassAds

ClassAds is a tuition/classified platform for Sri Lanka with:
- public class discovery
- secure user posting flow
- admin moderation dashboard
- institute listing support

It is built with Next.js App Router, MongoDB, server actions, and reusable UI components.

## Core Features

- Public pages with search, category browsing, featured carousel, latest ads, stats, contact page, and custom 404 page.
- User authentication with register/login/logout and email OTP verification.
- User-owned ad management with edit and OTP-based delete confirmation.
- Admin authentication with DB-backed credentials, Argon2 password hashing, and optional dev-only fallback login.
- Admin moderation tools: approve/reject, feature/unfeature, edit, delete, and institute management.
- Cloudflare Turnstile support for anti-bot posting (enabled in production, bypassed in development).
- Reusable UI system (dropdowns, modals, confirmations, toast, spinner, pagination, scroll area).

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- MongoDB + Mongoose
- JWT (`jose`)
- Argon2 password hashing
- Nodemailer (SMTP)
- Framer Motion
- React Icons

## Security Notes

- Passwords are hashed with Argon2.
- JWT cookies are HTTP-only.
- OTP codes are hashed before storing.
- Middleware protects admin and account routes.
- Turnstile verification is server-validated in production.
- Security headers are configured in `next.config.ts`.

## Project Scripts

```bash
npm run dev          # start local development server
npm run build        # production build
npm run start        # run production server
npm run lint         # lint checks
npm run seed:admin   # seed admin user into DB
```

## Environment Variables

Create `.env` with the following keys:

```bash
# Database
MONGODB_URI=

# App/Auth
JWT_SECRET=
DEV_ADMIN_AUTH=false
DEV_ADMIN_EMAIL=
DEV_ADMIN_PASSWORD=
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=

# Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Contact page
CONTACT_WHATSAPP_NUMBER=

# SMTP (OTP emails)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Important:
- Never commit real secrets.
- Rotate credentials if exposed.
- For Gmail SMTP, use App Passwords (not normal account password).

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`.
3. Seed admin (optional but recommended):
   ```bash
   npm run seed:admin
   ```
4. Start app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Main Flows

- **User Registration**
  - Register -> OTP sent via email -> verify OTP -> login session set.
- **Post Ad**
  - Logged-in user submits ad -> ad is created as `pending`.
- **Admin Moderation**
  - Admin approves/rejects ad; approved+featured ads appear in homepage featured carousel.
- **My Ads**
  - User sees own ads, edits fields via modal, deletes with OTP verify + confirmation.

## File Structure

```text
classads1/
  app/
    (public)/
      account/ads/
      ads/[id]/
      auth/
        login/
        register/
        verify/
      contact/
      institutes/
      search/
      submit/
      layout.tsx
      page.tsx
    (admin)/
      admin/
        ads/
        dashboard/
        login/
        users/
        layout.tsx
        page.tsx
    actions/
      ads.ts
      auth.ts
      institutes.ts
      user-auth.ts
    globals.css
    layout.tsx
    not-found.tsx

  components/
    ads/
      ad-carousel.tsx
      ad-carousel.module.css
      contact-buttons.tsx
      my-ads-manager.tsx
    forms/
      submit-form.tsx
      institute-form.tsx
    hero/
      animated-orbs.tsx
    institutes/
      create-institute-modal.tsx
    layout/
      site-header.tsx
      site-footer.tsx
    search/
    ui/
      button.tsx
      card.tsx
      dropdown.tsx
      modal.tsx
      confirmation-modal.tsx
      confirm-submit-button.tsx
      toast.tsx
      loading-spinner.tsx
      pagination.tsx
      scroll-area.tsx
    ad-card.tsx
    category-cards.tsx
    hero-search.tsx
    institute-card.tsx
    stats-bar.tsx

  lib/
    auth.ts
    constants.ts
    crypto-util.ts
    db.ts
    email.ts
    otp.ts
    password.ts
    turnstile.ts

  models/
    Ad.ts
    AdminUser.ts
    EmailOtp.ts
    Institute.ts
    User.ts

  scripts/
    seed-admin.mjs

  public/
    images.png

  proxy.ts
  next.config.ts
  package.json
```

## Notes for Production

- Keep `DEV_ADMIN_AUTH=false`.
- Ensure Turnstile keys are configured and allowed domains are correct.
- Configure real SMTP provider and verify mail delivery.
- Use strong `JWT_SECRET`.
- Run `npm run build` before deployment.
