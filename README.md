# TutorAI 🎓

Your AI tutor for every subject and every age, powered by Claude AI.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — styling
- **Clerk** — authentication
- **Supabase** — database
- **Stripe** — payments
- **Anthropic Claude** — AI tutor

---

## Setup Guide

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

#### Clerk
1. Create a project at [clerk.com](https://clerk.com)
2. Copy your publishable key and secret key
3. Set `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat` and `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat`
4. In Clerk Dashboard → Webhooks, create a webhook pointing to `https://yourdomain.com/api/webhooks/clerk`
5. Select `user.created` event and copy the webhook secret

#### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Copy your project URL, anon key, and service role key

#### Stripe
1. Create an account at [stripe.com](https://stripe.com)
2. Create 3 products:
   - **Starter** — $9/month recurring → copy price ID to `STRIPE_STARTER_PRICE_ID`
   - **Pro** — $25/month recurring → copy price ID to `STRIPE_PRO_PRICE_ID`
   - **Max** — $50 one-time → copy price ID to `STRIPE_MAX_PRICE_ID`
3. Copy your secret key and publishable key
4. Set up a webhook at `https://yourdomain.com/api/stripe/webhook` with events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

#### Anthropic
1. Get your API key at [console.anthropic.com](https://console.anthropic.com)
2. Set `ANTHROPIC_API_KEY`

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Update Stripe and Clerk webhook URLs to your Vercel domain

---

## Admin Access

The email `bluedechannell@gmail.com` has unlimited free access — no subscription required. This is enforced server-side in the API routes.

---

## Plans

| Plan | Price | Type | Features |
|------|-------|------|---------|
| Free Trial | $0 | 3 questions | All subjects |
| Starter | $9/mo | Monthly | Unlimited questions |
| Pro | $25/mo | Monthly | + Quiz mode, Notes, Progress |
| Max | $50 | One-time | Lifetime + Priority support |
