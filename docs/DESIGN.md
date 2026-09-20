# FixLink System Design & Architecture Document

**Tagline: Connect. Hire. Trade.**

---

## 1. Product Overview

### 1.1 Problem Statement
Modern communities are increasingly disconnected. When residents need dependable services (e.g., an electrician to rewire a circuit, a plumber to fix a burst pipe, an AC technician on a hot afternoon), they typically face two frustrating extremes:
1. **Opaque Aggregator Apps:** High middleman markups, hidden lead-generation fees, impersonal contractors, and disconnected customer support.
2. **Scattered Classifieds & Word-of-Mouth:** Fragmented social media groups or bulletin boards with zero accountability, unverified credentials, and no persistent portfolios or ratings.

Simultaneously, households accumulate usable second-hand goods (phones, laptops, furniture, power tools, appliances). Disposing of them or selling them via national shipping marketplaces entails excessive platform fees, shipping logistics, packaging hassle, and buyer-seller friction.

### 1.2 The Solution: FixLink
FixLink is a cohesive, lightweight local community platform that merges **Local Skilled Services** with a **Hyperlocal Second-Hand Marketplace**. It gives neighborhood residents direct agency to:
- Discover verified local professionals with rich, LinkedIn-style portfolios, skills, and genuine customer reviews.
- Directly connect and negotiate without middleman transaction cuts.
- Buy and sell pre-owned items locally with clear condition grading, location proximity, and immediate messaging.
- Switch seamlessly between roles: any community member can hire a carpenter today, sell an unused desk tomorrow, or offer their own specialized services.

### 1.3 Target Users
1. **Local Residents & Homeowners:** Seeking prompt, trustworthy home repairs, maintenance, and affordable second-hand neighborhood deals.
2. **Independent Skilled Professionals & Tradespeople:** Plumbers, electricians, carpenters, mechanics, appliance technicians, and cleaners looking for a dignified, free digital profile to showcase their craft, build local social proof, and win clients without paying for leads.
3. **Local Sellers & Bargain Hunters:** Individuals looking to declutter sustainably and buyers seeking good deals within their city or neighborhood.
4. **Community Moderators & Admins:** Overseeing content integrity, reviewing flagged listings, ensuring polite discourse, and moderating spam or abusive behavior.

### 1.4 Core Value Proposition
- **Unified Identity:** One account to hire, offer services, buy, and sell.
- **Direct Engagement:** Direct database-backed messaging with zero predatory commissions.
- **Proof of Work:** Dedicated portfolio showcases and tamper-resistant reviews.
- **Lightweight & Fast:** Serverless-native Next.js architecture deployed directly on Vercel with PostgreSQL.

---

## 2. Feature Specifications & Rationale

| Feature Area | Specific Feature | Why It Exists |
| :--- | :--- | :--- |
| **Authentication & Profile** | Custom cookie-based authentication with `jose` JWT & `bcryptjs` | Ensures high security and stateless execution on Vercel without third-party vendor lock-in or auth redirect delays. |
| **Discovery** | Multi-faceted provider search (Profession, Skills, City/Locality, Min Rating, Experience) | Enables users to instantly filter local talent down to exact needs without complex mapping dependencies. |
| **Professional Profiles** | LinkedIn-style profile with Bio, Experience, Skills badges, Portfolio grid, and Reviews breakdown | Provides skilled workers with a professional identity, highlighting craftsmanship visually rather than via plain text. |
| **Become a Provider** | Frictionless in-place onboarding (`/become-provider`) | Removes barrier to entry: ordinary users can register their profession without having to register a separate second account. |
| **Marketplace Catalog** | Second-hand listings with Category filtering, Condition pills, Price ranges, and Locality | Fosters circular economy and local neighborhood commerce with zero shipping logistics. |
| **Product Listings** | Detailed product views with image galleries, seller badge, quick messaging, and saved item toggling | Offers full visibility into product state, condition, seller reputation, and fast contact. |
| **Sell Second-Hand** | Simple item publication form (`/sell`) supporting multiple images, pricing, category, and condition grading | Enables fast 2-minute listing creation from mobile or desktop. |
| **Direct Messaging** | Polled, database-backed 1-to-1 conversation threads with read receipts (`readAt`) | Guarantees 100% Vercel serverless compatibility without long-lived WebSocket connections, while retaining conversational responsiveness. |
| **Reviews & Trust** | 1–5 star ratings, qualitative feedback, duplicate review prevention, self-review blocking | Establishes community trust and accountability while safeguarding providers against review bombardment. |
| **Saved Items** | Bookmarked providers and products (`/saved`) | Lets users keep track of pros for future repairs and monitor interesting marketplace listings. |
| **User Dashboard** | Unified command center (`/dashboard`) managing personal listings, provider profile, and received reviews | Centralizes user activity, listing status changes (Mark as Sold, Remove), and profile adjustments. |
| **Admin Moderation** | Admin console (`/admin`) for users, providers, products, reviews, and user reports | Empowers administrators to quickly resolve complaints, ban spammers, and moderate inappropriate content. |
| **Reporting System** | Contextual report modals for users, products, and reviews | Crowdsources safety by letting community members flag deceptive listings, abusive language, or scams. |

---

## 3. User Flows

### 3.1 New User Onboarding
```
Landing Page (/)
    │
    ├──> Click "Register"
    │       │
    │       ▼
    │   Fill Name, Email, Password, City/Locality, Phone
    │       │
    │       ▼
    │   Server sets HTTP-only JWT Cookie
    │       │
    │       ▼
    └──> Redirect to Dashboard or Return to previous browsing session
```

### 3.2 Customer Hiring Flow
```
Browse /providers OR Search from Hero
    │
    ▼
Filter by Profession (e.g., Electrician), Rating (4+ stars), Locality
    │
    ▼
Click Provider Card -> View /providers/[id]
    │
    ├── Inspect Portfolio Images, Bio, Years of Experience, Past Customer Reviews
    │
    ▼
Click "Message Provider"
    │
    ▼
Redirects to /messages with active conversation open
    │
    ▼
Exchange project requirements, timeline, and quote
```

### 3.3 Provider Flow (Become & Manage)
```
User clicks "Become a Provider"
    │
    ▼
Fills: Profession, Bio, Experience Years, Skills tags, Availability, Portfolio Items
    │
    ▼
User role elevates to PROVIDER; ProviderProfile created in PostgreSQL
    │
    ▼
Profile is immediately discoverable in /providers
    │
    ▼
Manage profile & view received reviews from /dashboard -> "My Provider Profile"
```

### 3.4 Seller Flow (Second-Hand Marketplace)
```
User clicks "Sell an Item" (/sell)
    │
    ▼
Fills: Title, Price, Category, Condition (New/Like New/Good/Fair), Description, Location, Image URLs
    │
    ▼
Product published with status: ACTIVE
    │
    ▼
Manage status in /dashboard -> "My Listings"
    ├── Change status to SOLD
    └── Remove or Delete listing
```

### 3.5 Buyer Flow (Marketplace)
```
Browse /marketplace
    │
    ▼
Filter by Category (e.g., Electronics), Condition, Max Price
    │
    ▼
Click Product -> /marketplace/[id]
    │
    ├── Save to Bookmarks (/saved)
    ├── Report if fraudulent
    └── Click "Message Seller" -> direct chat initialized
```

### 3.6 Admin Moderation Flow
```
Admin navigates to /admin (Protected by requireAdmin)
    │
    ├── Overview KPIs: Total Users, Providers, Active Listings, Pending Reports
    ├── User Directory: Search, toggle suspension, elevate roles
    ├── Product Moderation: Review flagged items, remove violating listings
    ├── Review Moderation: Remove abusive or fake reviews
    └── Reports Queue: Inspect user reports with target context -> Resolve or Dismiss
```

---

## 4. Information Architecture & Route Hierarchy

```
/
├── /login                         # Authentication: User sign in
├── /register                      # Authentication: User registration
├── /providers                     # Discovery: Service provider directory & filters
│   └── /[id]                      # Detail: Provider profile, portfolio, reviews
├── /become-provider               # Action: Convert user account to service provider
├── /marketplace                   # Discovery: Second-hand catalog & search
│   └── /[id]                      # Detail: Product specification, gallery & seller contact
├── /sell                          # Action: Create new product listing
├── /messages                      # Communication: Master-detail chat interface
├── /saved                         # Bookmarks: Saved providers & products tabs
├── /dashboard                     # User Center: Overview, Listings, Provider settings, Reviews
└── /admin                         # Moderation: Restricted admin control panel
```

### API Endpoints (`/api/...`)
- `POST /api/auth/register`: Create user account & issue session cookie.
- `POST /api/auth/login`: Authenticate credentials & issue session cookie.
- `POST /api/auth/logout`: Clear session cookie.
- `GET /api/auth/me`: Fetch current authenticated user.
- `GET /api/providers`: Paginated provider search with filters (profession, location, rating, sort).
- `POST /api/providers`: Create or update provider profile.
- `GET /api/providers/[id]`: Retrieve single provider profile with portfolio and reviews.
- `POST /api/reviews`: Submit review for a provider (anti-spam validated).
- `GET /api/marketplace`: Paginated products search with category, price, condition filters.
- `POST /api/marketplace`: Create new second-hand listing.
- `GET /api/marketplace/[id]`: Product details with seller data.
- `PATCH /api/marketplace/[id]`: Update product status (ACTIVE, SOLD, REMOVED).
- `DELETE /api/marketplace/[id]`: Delete product listing.
- `GET /api/messages/conversations`: List user's active conversations with unread indicators.
- `POST /api/messages/conversations`: Initiate or retrieve conversation with a target user.
- `GET /api/messages/[conversationId]`: Fetch message history & mark incoming as read.
- `POST /api/messages/[conversationId]`: Post new message to thread.
- `GET /api/saved`: Fetch user's saved providers and products.
- `POST /api/saved`: Toggle save state for a provider or product.
- `POST /api/reports`: File a moderation report against user, product, or review.
- `GET /api/admin/stats`: Moderation metrics for admin overview.
- `GET /api/admin/users`: User management list with filter & suspend action.
- `GET /api/admin/reports`: Pending and resolved moderation reports.
- `PATCH /api/admin/reports/[id]`: Update report status (RESOLVED, DISMISSED) and apply penalties.

---

## 5. UI Design System

### 5.1 Color Palette
- **Primary / Brand:** Emerald & Teal modern tones (`emerald-600` #059669, `emerald-500` #10b981, `teal-700` #0f766e) conveying reliability, local vitality, and trust.
- **Secondary / Accent:** Indigo & Slate (`indigo-600` #4f46e5, `slate-900` #0f172a) for professional structure and modern polish.
- **Surfaces & Backgrounds:** Crisp off-white (`slate-50` #f8fafc), card whites (`#ffffff`), and subtle dark card borders (`border-slate-200/80`).
- **Feedback:** Emerald for success, Amber for warnings / ratings, Rose/Red for destructive actions / errors.

### 5.2 Typography
- **Primary Font:** Inter / System UI stack (`font-sans`), optimized for readability on high-DPI displays.
- **Scale:**
  - Hero Display: `text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight`
  - Section Headings: `text-2xl md:text-3xl font-bold text-slate-900`
  - Card Titles: `text-lg font-semibold text-slate-900`
  - Body Copy: `text-sm md:text-base text-slate-600 leading-relaxed`
  - Metadata & Badges: `text-xs font-medium uppercase tracking-wider`

### 5.3 Component Language
- **Cards:** Rounded borders (`rounded-2xl`), subtle border lines (`border border-slate-200/70`), gentle ambient elevation (`shadow-sm hover:shadow-md transition-all duration-200`).
- **Interactive Badges:** Pill-shaped badges with tinted backgrounds (e.g. `bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20`).
- **Buttons:**
  - Primary: High-contrast emerald fill with hover brighten effect (`bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl px-5 py-2.5 shadow-sm active:scale-[0.98]`).
  - Secondary / Outline: `border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl px-4 py-2.5`.
  - Ghost: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-3 py-2`.
- **Forms & Inputs:** Clean white backgrounds, slate borders with emerald focus rings (`focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 rounded-xl`).
- **Feedback & States:**
  - Skeleton screens during data loading.
  - Expressive empty states featuring custom iconography, descriptive guidance, and immediate call-to-action buttons.

---

## 6. Database Schema & Entity Relationship Diagram

### 6.1 ASCII ERD
```
+-------------------------------------------------------------+
|                            USER                             |
+-------------------------------------------------------------+
| id: String (UUID, PK)                                       |
| name: String                                                |
| email: String (Unique)                                      |
| passwordHash: String                                        |
| avatarUrl: String?                                          |
| phone: String?                                              |
| location: String                                            |
| latitude: Float?                                            |
| longitude: Float?                                           |
| role: RoleEnum (USER | PROVIDER | ADMIN)                    |
| createdAt: DateTime                                         |
| updatedAt: DateTime                                         |
+-------------------------------------------------------------+
        │ 1                      │ 1                    │ 1
        │                        │                      │
        ▼ 0..1                   ▼ 0..*                 ▼ 0..*
+-----------------------+ +--------------------+ +--------------------+
|    PROVIDER_PROFILE   | |      PRODUCT       | |       REVIEW       |
+-----------------------+ +--------------------+ +--------------------+
| id: UUID (PK)         | | id: UUID (PK)      | | id: UUID (PK)      |
| userId: UUID (FK,UQ)  | | sellerId: UUID(FK) | | providerId: UUID   |
| profession: String    | | title: String      | | reviewerId: UUID   |
| bio: String?          | | description: String| | rating: Int (1-5)  |
| experienceYears: Int  | | price: Float       | | comment: String    |
| skills: String[]      | | category: String   | | createdAt: DateTime|
| location: String      | | condition: CondEnum| +--------------------+
| latitude: Float?      | | location: String   |          ▲
| longitude: Float?     | | latitude: Float?   |          │
| availability: String  | | longitude: Float?  |          │ providerId
| createdAt: DateTime   | | status: StatEnum   |          │
+-----------------------+ | createdAt: DateTime|   +---------------+
        │ 1             +--------------------+   | Provider User |
        ▼ 0..*                     │ 1           +---------------+
+-----------------------+          ▼ 0..*
|    PORTFOLIO_ITEM     | +--------------------+
+-----------------------+ |   PRODUCT_IMAGE    |
| id: UUID (PK)         | +--------------------+
| providerId: UUID (FK) | | id: UUID (PK)      |
| title: String         | | productId:UUID(FK) |
| description: String?  | | imageUrl: String   |
| imageUrl: String      | +--------------------+
| createdAt: DateTime   |
+-----------------------+

        +---------------------------------------------+
        |                 MESSAGING                   |
        +---------------------------------------------+
        |  CONVERSATION (id, createdAt, updatedAt)    |
        |       │ 1                                   |
        |       ├──> CONVERSATION_PARTICIPANT (userId)|
        |       │                                     |
        |       └──> MESSAGE (id, senderId, content,  |
        |                     createdAt, readAt)      |
        +---------------------------------------------+

        +---------------------------------------------+
        |               SAVED & REPORTS               |
        +---------------------------------------------+
        | SAVED_PROVIDER (userId, providerId)         |
        | SAVED_PRODUCT (userId, productId)           |
        | REPORT (id, reporterId, targetType,         |
        |         targetId, reason, status)           |
        +---------------------------------------------+
```

### 6.2 Key Indexes
- `User`: `@@index([email])`, `@@index([role])`
- `ProviderProfile`: `@@index([profession])`, `@@index([location])`
- `Product`: `@@index([category])`, `@@index([status])`, `@@index([location])`, `@@index([sellerId])`
- `Review`: `@@unique([providerId, reviewerId])` (Prevents duplicate reviews), `@@index([providerId])`
- `Message`: `@@index([conversationId])`, `@@index([senderId])`, `@@index([createdAt])`
- `SavedProvider`: `@@unique([userId, providerId])`
- `SavedProduct`: `@@unique([userId, productId])`
- `Report`: `@@index([status])`, `@@index([targetType])`

---

## 7. Backend Architecture & Security

### 7.1 Custom Authentication
- **Token Format:** Signed JSON Web Token (JWT) containing `{ userId, email, role }`.
- **Crypto Engine:** `jose` library (standards-based Web Crypto API, fully edge & serverless compatible without Node-GYP C++ binaries).
- **Storage:** Secure `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=7 days` cookie (`fixlink_token`).
- **CSRF & Injection Mitigation:** Standard cookie protection with Next.js SameSite semantics and Prisma parameterized SQL queries.

### 7.2 Authorization Matrix
| Resource / Action | Public / Guest | Authenticated User | Provider | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Browse Providers & Products | Yes | Yes | Yes | Yes |
| View Profiles & Product Details | Yes | Yes | Yes | Yes |
| Message Seller / Provider | No | Yes | Yes | Yes |
| Post Product Listing | No | Yes | Yes | Yes |
| Submit Review | No | Yes (Excl. Self) | Yes (Excl. Self) | Yes |
| Create Provider Profile | No | Yes | Edit Own | Yes |
| Edit / Delete Own Product | No | Owner Only | Owner Only | Any (Moderation) |
| Access `/admin` & Moderation | No | No | No | Yes |

### 7.3 Real-Time Feel without WebSockets
Vercel serverless functions terminate after request completion and cannot sustain persistent duplex WebSockets.
FixLink solves this with:
- Optimistic UI updates upon message submission.
- High-efficiency polling (3-5 second interval when the conversation view is active).
- Indexed timestamp queries (`WHERE conversationId = ? AND createdAt > ?`) ensuring queries take < 5ms.

---

## 8. Deployment Strategy (GitHub -> Vercel -> PostgreSQL)

```
[ Developer Push ]
       │
       ▼
[ GitHub Repository ]
       │ (Automatic Webhook)
       ▼
[ Vercel Deployment Pipeline ]
       ├── 1. `npm install`
       ├── 2. `prisma generate`
       └── 3. `next build` (compiles App Router pages & server routes)
       │
       ▼
[ Serverless Edge Network ] <─── DATABASE_URL ───> [ PostgreSQL Database ]
                                                   (Neon / Vercel Postgres / Supabase)
```

### 8.1 Required Environment Variables
| Variable | Description | Example / Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection URL with pooled or direct connection | `postgresql://user:pass@ep-xyz.neon.tech/fixlink?sslmode=require` |
| `JWT_SECRET` | 32+ character random secret for signing authentication cookies | `c7f918e9a2b5d4e3f1a089b7c6d5e4f3a2b1...` |
| `NODE_ENV` | Runtime environment | `production` |

### 8.2 Database Setup & Migrations
1. Run `npx prisma db push` or `npx prisma migrate deploy` in production.
2. For initial seeding: `npm run seed`.

---

## 9. Future Improvements (Post-MVP Roadmap)

1. **Direct Object Storage Integration:** S3/Cloudflare R2/Vercel Blob direct presigned URL image uploads instead of image URLs.
2. **Push Notifications:** Web Push Notifications API for new chat messages when the browser is inactive.
3. **Interactive Maps:** Optional Mapbox/Leaflet integration for radius-based neighborhood visualization.
4. **Verified Tradesperson Badges:** Upload of trade licenses and identification for manual admin verification checkmarks.
5. **Escrow / In-Person Payment Verification:** Optional confirmation codes for safe in-person handoffs.
