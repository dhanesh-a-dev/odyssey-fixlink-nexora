# FixLink — Connect. Hire. Trade.

FixLink is a complete, modern full-stack local community platform combining **Local Skilled Services** (electricians, plumbers, carpenters, mechanics, cleaners) with a **Second-Hand Marketplace** (phones, laptops, tools, furniture, appliances) into a single, unified web application.

The entire frontend and backend are developed together in **this single repository** and deployable as **one Vercel project** without any external chat servers, separate Express backends, microservices, or Docker dependencies.

---

## 🌟 Key Features

1. **Local Service Discovery (`/providers`)**
   - Find nearby skilled professionals (Electricians, Plumbers, Carpenters, Painters, Mechanics, AC Techs, Appliance Techs, Cleaners).
   - Multi-parameter search by profession, locality, keywords, minimum rating, and years of experience.
   - LinkedIn-style networking cards with skill badges, ratings, and experience.

2. **Professional Profiles (`/providers/[id]`)**
   - Verified credentials, biography, and availability status.
   - Interactive project portfolio gallery showcasing past work.
   - 100% verified customer ratings and reviews with anti-abuse protection (prevents self-reviews and duplicate reviews).

3. **Become a Provider (`/become-provider`)**
   - Frictionless in-place conversion: any registered user can publish their tradesperson profile without creating a separate account.

4. **Second-Hand Marketplace (`/marketplace`)**
   - Buy and sell pre-owned items locally with zero shipping hassles and zero commission cuts.
   - Filter by category (Phones, Computers, Electronics, Furniture, Appliances, Vehicles, Tools, Books, Gaming), condition (New, Like New, Good, Fair), and price range.

5. **Sell an Item (`/sell`)**
   - Simple 2-minute listing flow supporting multiple image URLs, category, condition grading, price, and neighborhood.

6. **Direct Database-Backed Messaging (`/messages`)**
   - Instant 1-to-1 conversation threads with unread indicators and read receipts (`readAt`).
   - 100% Vercel serverless-native: uses efficient database queries and optimistic polling instead of fragile persistent WebSockets.

7. **Saved Items (`/saved`)**
   - Bookmark favorite professionals for future home repairs and save interesting marketplace listings.

8. **Unified User Dashboard (`/dashboard`)**
   - Overview metrics, my listings manager (toggle ACTIVE / SOLD / REMOVE, delete), provider profile editor, and received customer reviews.

9. **Admin Moderation Portal (`/admin`)**
   - Restricted to `ADMIN` users.
   - Live KPI overview, user management (suspend, elevate roles), marketplace listing moderation, review moderation, and user reports handling queue.

10. **System Design Documentation (`docs/DESIGN.md`)**
    - Comprehensive technical specifications, ASCII Entity Relationship Diagram (ERD), user journey flows, UI design tokens, and deployment handbook.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Custom stateless JWT authentication using [jose](https://github.com/panva/jose) in secure `HttpOnly` cookies, with [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dhanesh-a-dev/odyssey-fixlink-nexora.git
cd odyssey-fixlink-nexora
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your PostgreSQL connection string in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fixlink?schema=public"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars-long"
NODE_ENV="development"
```

*(Note: If testing without a local PostgreSQL instance, FixLink automatically uses an intelligent in-memory store initialized with realistic demo data, ensuring 100% zero-config execution!)*

### 3. Generate Prisma Client & Seed Database
```bash
npx prisma generate
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

For rapid testing and grading, FixLink includes pre-seeded demo accounts with preset passwords:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixlink.local` | `Admin123!` | Full access to `/admin` moderation portal |
| **Provider** | `marcus.vance@fixlink.local` | `Password123!` | Master Electrician with verified portfolio & reviews |
| **Customer / Buyer** | `sarah.j@fixlink.local` | `Password123!` | Active buyer with saved items & active chats |

---

## 🚢 Production Deployment (GitHub → Vercel)

FixLink is designed specifically for Vercel's serverless environment.

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy FixLink"
   git push origin main
   ```
2. **Import into Vercel**:
   - Create a new project on [Vercel](https://vercel.com).
   - Select your GitHub repository.
   - Vercel automatically detects Next.js.
3. **Set Environment Variables in Vercel Project Settings**:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. from Neon, Vercel Postgres, Supabase, or Railway).
   - `JWT_SECRET`: A 32+ character random string for signing secure auth cookies.
   - `NODE_ENV`: `production`.
4. **Deploy**:
   - Vercel automatically executes `npm install` (which triggers `prisma generate` via postinstall) and `npm run build`.
   - Your full-stack app is live in seconds with global edge acceleration!

---

## 📄 Documentation

For full architectural details, ASCII ERD diagrams, and security specifications, see [docs/DESIGN.md](docs/DESIGN.md).
