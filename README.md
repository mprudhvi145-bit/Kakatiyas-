
# KAKATIYAS - Heritage Luxury E-Commerce

A production-grade, multi-tenant capable luxury e-commerce platform built with Next.js 14, Prisma, Tailwind CSS, and TypeScript.

## 🚀 Features

*   **App Router Architecture**: Leveraging Next.js 14 Server Components and Streaming.
*   **Luxury Design System**: Custom Tailwind configuration for heritage aesthetics.
*   **Full Commerce Flow**: Product discovery, Cart, Checkout (Stripe/Razorpay), Order Management.
*   **Admin Dashboard**: Analytics, Product Management, Coupon & Gift Card issuing.
*   **SEO Optimized**: JSON-LD, Dynamic Metadata, Sitemap, Robots.txt.
*   **Performance**: `next/image`, `next/font`, ISR Caching.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14
*   **Database**: PostgreSQL (via Prisma ORM)
*   **Auth**: NextAuth.js (Credentials, extensible for OAuth)
*   **Styling**: Tailwind CSS, Lucide Icons, Google Fonts
*   **Payments**: Stripe & Razorpay integration
*   **Deployment**: Vercel (Recommended)

## 📦 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/kakatiyas.git
    cd kakatiyas
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file based on `.env.example`:
    ```env
    DATABASE_URL="postgresql://..."
    NEXTAUTH_SECRET="your_secret"
    NEXTAUTH_URL="http://localhost:3000"
    
    # Payments
    STRIPE_SECRET_KEY=""
    STRIPE_WEBHOOK_SECRET=""
    RAZORPAY_KEY_ID=""
    RAZORPAY_KEY_SECRET=""
    
    # Analytics
    NEXT_PUBLIC_GA_ID=""
    ```

4.  **Database Migration**
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🚢 Production Checklist

- [ ] **Database**: Ensure PostgreSQL is provisioned (e.g., Supabase, Neon, AWS RDS).
- [ ] **Environment**: Set all production ENV variables in Vercel/Netlify.
- [ ] **Webhooks**: Configure Stripe/Razorpay webhooks to point to `https://your-domain.com/api/webhooks/...`.
- [ ] **Admin**: Create initial admin user via seed script or direct DB access.
- [ ] **Domain**: Configure custom domain and SSL.
- [ ] **Analytics**: Add Google Analytics ID to environment variables.

## 📄 License

Proprietary software for KAKATIYAS. All rights reserved.
