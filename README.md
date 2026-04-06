# CityBoard Ads

A Next.js 16 ads marketplace with:

- Public ad listing and detail pages (no authentication required)
- Admin login
- Admin dashboard with CRUD operations (create, update, delete, view)
- MongoDB data storage
- Tailwind CSS and shadcn-style UI components

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and set values:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/classads1
JWT_SECRET=your-strong-secret
ADMIN_EMAIL=admin@classads.local
ADMIN_PASSWORD=your-secure-password
```

## 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/` public ads board
- `/ads/[slug]` public ad details
- `/login` admin login
- `/admin` admin dashboard
- `/admin/new` create ad
- `/admin/[id]/edit` edit ad

## Notes

- `proxy.ts` protects `/admin/*` routes.
- Server actions enforce admin authorization for all mutations.
