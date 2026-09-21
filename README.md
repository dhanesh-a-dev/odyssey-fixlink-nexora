# FixLink

## Problem Statement

Finding reliable local service providers such as electricians, plumbers, carpenters, mechanics, and technicians is often difficult. People usually depend on word-of-mouth recommendations, local contacts, or scattered social media posts, making the process slow and unreliable.

At the same time, skilled workers struggle to reach potential customers and showcase their experience, skills, and past work in a professional manner.

Additionally, many people own second-hand products that they no longer use but lack a convenient local platform to sell them to nearby buyers.

FixLink addresses these challenges by creating a unified platform where users can discover trusted local professionals, connect directly with them, and buy or sell second-hand products within their community.


## Project Description

FixLink is a community-focused web platform that combines three key functionalities:

1. **Local Service Marketplace**

   * Users can search for nearby electricians, plumbers, carpenters, technicians, and other skilled workers.
   * Service providers can create professional profiles highlighting their skills, experience, portfolio, ratings, and reviews.

2. **Professional Profile System**

   * Similar to a simplified LinkedIn experience for skilled workers.
   * Providers can showcase work history, experience, portfolio images, and customer feedback.

3. **Second-Hand Marketplace**

   * Users can list used products for sale.
   * Buyers can browse local listings and contact sellers directly.

The platform helps customers find trusted professionals, helps workers attract more clients, and encourages local buying and selling through a single, easy-to-use application.

---

## Google AI Usage

### Tools / Models Used
* Gemini 3.8 Flash (medium) 

## Tech Stack Used

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Prisma ORM

### Database

* PostgreSQL

### Authentication

* JWT Authentication

### Deployment

* Vercel

---

### How Google AI Was Used

Explain clearly how AI is integrated into your project.
- We have not integrated AI into our project.
---

### GitHub Repo Link of the Project

[GitHub Repository](https://github.com/dhanesh-a-dev/odyssey-fixlink-nexora)

---

## Proof of Google AI Usage

- We have not integrated AI into our project.

---

## Screenshots

Application screenshots are available in the:

```text
/ screenshots
```

folder, including:

* Landing Page
* Provider Search
* Provider Profile
* Marketplace
* Dashboard
* Messaging Interface

---

## Demo Video

Demo Video Link:

[Watch Demo](https://your-demo-video-link)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/github_user_name/repo_name.git
cd repo_name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Seed Sample Data (Optional)

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

### 7. Open Application

```text
http://localhost:3000
```

### 8. Production Deployment

Push the repository to GitHub and deploy directly through Vercel.

The application will automatically build and deploy using the configured environment variables.
