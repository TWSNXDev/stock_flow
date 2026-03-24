# StockFlow

StockFlow is an inventory and online storefront application built with Next.js. It combines both the customer-facing shop and the admin back office in a single codebase, making it a solid foundation for a small to medium-sized e-commerce system that needs product management, category organization, authentication, and clear stock visibility.

## Overview

This project is organized into two main areas:

- Shop storefront for general users
- Admin panel for managing products and categories

Core capabilities currently implemented in the codebase:

- Display products on the home page and product listing page
- Search, filter by stock status, sort, and paginate products
- User registration and credential-based login
- Google sign-in support via NextAuth
- Role-based access control for admin pages
- Product create, update, and delete flows through Server Actions
- Product image upload to Cloudinary
- Category management with protection against deleting categories still in use
- Client-side cart state persisted with Zustand

Note: The Prisma schema already includes models for orders and notifications, but the current workspace does not yet contain a complete checkout or order management UI flow. Those models should be treated as a foundation for future expansion.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS 4
- React Hook Form + Zod Resolver
- Cloudinary
- Zustand

## Key Features

### Customer-facing

- Landing page with latest and popular product sections
- Product listing with search, sorting, stock filters, and pagination
- Cart drawer for basic cart management
- Register and login flow for general users

### Admin-facing

- Admin dashboard entry page
- Product inventory management
- Category management
- Inventory summaries such as total items, in stock, and out of stock
- Middleware protection for `/admin/*` routes when the user is not an `ADMIN`

## Project Structure

```text
app/
  (shop)/            customer-facing storefront pages
  (auth)/            login and registration pages
  (admin)/           admin/back office pages
  actions/           server actions for product, category, and register flows
  api/auth/          NextAuth route handler
components/          reusable UI and layout components
lib/                 prisma, auth, and cloudinary utilities
prisma/              schema and migrations
store/               Zustand store
validation/          form validation schemas
```

## Data Model

The main database entities include:

- User, Account, Session for authentication
- Product and Category for catalog management
- Order and OrderItem for order data
- Notification for system notifications

The application currently defines two user roles:

- `USER`
- `ADMIN`

## Getting Started

### 1. Prerequisites

Recommended environment:

- Node.js 20+
- PostgreSQL
- A Cloudinary account
- Google OAuth credentials if you want to enable Google Sign-In

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and define the following values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3333"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

Important environment variables:

- `DATABASE_URL` connects Prisma to PostgreSQL
- `NEXTAUTH_SECRET` is used to sign sessions and tokens
- `NEXTAUTH_URL` should match the actual port used by the app
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are required for Google login
- The Cloudinary variables are required for product image uploads

### 4. Run database migrations

```bash
npx prisma migrate dev
```

To open Prisma Studio:

```bash
npx prisma studio
```

### 5. Start the development server

```bash
npm run dev
```

This project is configured to run the development server at:

```text
http://localhost:3333
```

## Available Scripts

```bash
npm run dev     # Start Next.js dev server on port 3333
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Authentication and Access Control

- Uses NextAuth with the Prisma Adapter
- Supports `credentials` login with email and password
- Supports Google OAuth
- Protects `/admin/*` routes with middleware
- Users created through the normal registration form are assigned the `USER` role

To access admin pages, a user must have their database role changed to `ADMIN`.

Typical ways to update the role:

- Update the user record through Prisma Studio
- Update the role directly in PostgreSQL with SQL

## Image Upload

Product images are uploaded to Cloudinary, and the project is already configured to allow remote images from `res.cloudinary.com` in the Next.js configuration.

## Notes for Development

- Product management is primarily implemented with Server Actions
- The shop side fetches product data from Prisma directly and through filtering actions
- Cart state is persisted in local storage through Zustand persistence
- Server Actions request body size is configured with a `2mb` limit

## Suggested Improvements

If you plan to move this project closer to production readiness, the next practical steps would be:

1. Add a seed script for creating an initial admin user
2. Implement checkout and order history pages to match the existing schema
3. Add automated tests for authentication, product actions, and admin route protection
4. Update application metadata to reflect the project name and SEO needs
5. Add CI for linting and build validation

## License

No license has been specified in this repository yet. If you plan to publish or share it publicly, you should add one explicitly.
