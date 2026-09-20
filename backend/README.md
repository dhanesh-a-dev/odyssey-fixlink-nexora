# FixLink Backend API

Backend service for **FixLink** — a local services marketplace platform connecting customers with verified trade professionals (electricians, plumbers, carpenters, cleaners) and enabling a local second-hand marketplace.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Media Uploads**: [Cloudinary](https://cloudinary.com/) with `multer` & `multer-storage-cloudinary`
- **Security**: `helmet`, `cors`, parameterized Prisma queries, sanitization of sensitive fields

---

## 📂 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema definition & relations
│   └── seed.js                   # Seed script with realistic dummy data
├── src/
│   ├── config/
│   │   ├── db.js                 # Prisma client instance
│   │   └── cloudinary.js         # Cloudinary configuration & storage engines
│   ├── controllers/
│   │   ├── auth.controller.js    # Register, login, current user
│   │   ├── provider.controller.js# Provider profiles, search, filtering
│   │   ├── review.controller.js  # Ratings & reviews
│   │   ├── product.controller.js # Second-hand marketplace products CRUD
│   │   └── message.controller.js # Direct messaging & conversation threads
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification & role authorization (RBAC)
│   │   ├── upload.middleware.js  # Multer image upload handlers (avatar, portfolio, products)
│   │   └── error.middleware.js   # 404 handler and centralized error boundary
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth routes
│   │   ├── provider.routes.js    # /api/providers routes
│   │   ├── review.routes.js      # /api/reviews routes
│   │   ├── product.routes.js     # /api/products routes
│   │   ├── message.routes.js     # /api/messages routes
│   │   └── index.js              # Aggregated API router
│   ├── utils/
│   │   └── helpers.js            # Password hashing, token signing, user sanitization
│   └── server.js                 # Express server bootstrap & middleware wiring
├── .env.example                  # Template of required environment variables
├── .gitignore                    # Ensures secrets and node_modules are never committed
├── package.json                  # Scripts & dependencies
└── README.md                     # Documentation & API reference
```

---

## 🔒 Security & Privacy Features

1. **Password Protection**: Plaintext passwords are never saved. All passwords are encrypted with `bcryptjs` (salt rounds: 10).
2. **Confidentiality**: Password hashes are stripped before returning any user or seller object in API responses.
3. **Environment Isolation**: Database connection strings, JWT secrets, and Cloudinary keys are stored strictly in `.env`. `.gitignore` prevents them from being committed to Git.
4. **Ownership Verification**: Users can only modify or delete their own product listings or provider profiles.
5. **Role-Based Access Control (RBAC)**: Only service providers (`PROVIDER`) can create and update professional service profiles; only authenticated users can post reviews and messages.

---

## 🚀 Quick Setup Guide

### 1. Prerequisites
- **Node.js** v18+ installed.
- A running **PostgreSQL** instance (local Postgres or a free cloud provider like Supabase, Neon, Railway, or Render).
- (Optional) A free [Cloudinary](https://cloudinary.com/) account for image uploads.

### 2. Install Dependencies
Open your terminal and navigate to the `backend` folder:
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fixlink_db?schema=public"

# JWT Secret (Generate any random secure string)
JWT_SECRET=super_secure_fixlink_jwt_secret_key_2026
JWT_EXPIRES_IN=7d

# Cloudinary credentials (from your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Database Migrations
Initialize your database schema:
```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

### 5. Seed the Database (Optional but Recommended)
Populate your database with sample providers, reviews, and marketplace items matching the FixLink frontend:
```bash
npm run seed
```
> **Seed Account Credentials:**
> - Customers: `anjali@example.com`, `vikram@example.com`
> - Providers: `rajesh@example.com`, `amit@example.com`, `sunita@example.com`
> - Password for all seeded accounts: `Password123!`

### 6. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```
The server will start at `http://localhost:5000`.

---

## 📚 API Reference

All routes are accessible under `/api` and direct root paths (e.g. `/api/auth/login` or `/login`).

### 1. Authentication

#### `POST /api/auth/register` (or `POST /register`)
Register a new customer or service provider. Supports optional `profileImage` file upload.

**Request (JSON or multipart/form-data):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "CUSTOMER"
}
```
*Note: `role` can be `"CUSTOMER"` or `"PROVIDER"`.*

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "CUSTOMER",
    "profileImage": null,
    "createdAt": "2026-09-21T00:00:00.000Z"
  }
}
```

#### `POST /api/auth/login` (or `POST /login`)
Authenticate with email and password.

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### `GET /api/auth/me`
Get details of the currently authenticated user.
*Header:* `Authorization: Bearer <token>`

---

### 2. Service Providers

#### `GET /api/providers`
List all providers with optional search & filter parameters.

**Query Parameters:**
- `profession` (e.g. `?profession=Electrician`)
- `location` (e.g. `?location=Downtown`)
- `search` (e.g. `?search=wiring`)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "profile-uuid",
      "userId": "user-uuid",
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "profileImage": "https://...",
      "profession": "Electrician",
      "bio": "Experienced electrician with 12+ years...",
      "experienceYears": 12,
      "location": "Downtown",
      "skills": ["Wiring", "Switchboards", "Inverters"],
      "portfolioImages": ["https://..."],
      "averageRating": 4.5,
      "totalReviews": 2
    }
  ]
}
```

#### `GET /api/providers/:id`
Fetch a specific provider by profile ID or user ID, including reviews and reviewer details.

#### `POST /api/providers/profile`
Create a professional provider profile.
*Requires `Authorization: Bearer <token>` (Provider role only).*
*Accepts multipart/form-data with up to 5 `portfolioImages`.*

**Form Fields:**
- `profession`: `"Plumber"`
- `bio`: `"Expert in pipe fittings and leak repairs."`
- `experienceYears`: `8`
- `location`: `"Green Park"`
- `skills`: `"Pipe Fitting, Water Heaters, Leak Repair"` (comma-separated or array)
- `portfolioImages`: File(s)

#### `PUT /api/providers/profile`
Update an existing provider profile.
*Requires `Authorization: Bearer <token>` (Provider role only).*

---

### 3. Reviews & Ratings

#### `POST /api/reviews`
Submit a review for a service provider.
*Requires `Authorization: Bearer <token>`.*

**Request:**
```json
{
  "providerId": "provider-user-uuid",
  "rating": 5,
  "comment": "Prompt service, very professional and courteous!"
}
```

#### `GET /api/providers/:id/reviews`
Get all reviews and ratings for a provider.

---

### 4. Marketplace Products

#### `GET /api/products`
Retrieve second-hand marketplace products with filters.

**Query Parameters:**
- `category` (e.g. `?category=Furniture`)
- `location` (e.g. `?location=Sector 21`)
- `search` (e.g. `?search=chair`)

#### `GET /api/products/:id`
Get single product details with seller info.

#### `POST /api/products`
Create a product listing.
*Requires `Authorization: Bearer <token>`.*
*Supports multipart/form-data with up to 5 `images` files.*

**Form Fields / Body:**
```json
{
  "title": "Ergonomic Desk Chair",
  "description": "Like-new condition, lumbar support.",
  "price": 1200,
  "category": "Furniture",
  "location": "Sector 21"
}
```

#### `PUT /api/products/:id`
Update a product listing.
*Requires `Authorization: Bearer <token>` (Must be the seller).*

#### `DELETE /api/products/:id`
Delete a product listing.
*Requires `Authorization: Bearer <token>` (Must be the seller).*

---

### 5. Direct Messaging

#### `POST /api/messages`
Send a direct message to another user.
*Requires `Authorization: Bearer <token>`.*

**Request:**
```json
{
  "receiverId": "recipient-user-uuid",
  "content": "Hi, is this service available on Saturday?"
}
```

#### `GET /api/messages/:userId`
Fetch direct message conversation history with a specific user.
*Requires `Authorization: Bearer <token>`.*

#### `GET /api/messages`
Get an inbox list of all recent conversations.
*Requires `Authorization: Bearer <token>`.*
