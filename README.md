# Iconix Nail Bar — Hosting & Setup Guide

This is the official website for **Iconix Nail Bar**, built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Get the Code](#2-get-the-code)
3. [Install Dependencies](#3-install-dependencies)
4. [Set Up Supabase](#4-set-up-supabase)
5. [Configure Environment Variables](#5-configure-environment-variables)
6. [Run Locally (Development)](#6-run-locally-development)
7. [Deploy to Vercel (Recommended)](#7-deploy-to-vercel-recommended)
8. [Deploy to a Custom Server (Alternative)](#8-deploy-to-a-custom-server-alternative)
9. [Admin Panel Access](#9-admin-panel-access)
10. [Gallery Images](#10-gallery-images)
11. [Verify Everything Works](#11-verify-everything-works)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure you have the following installed and ready:

| Requirement | Version            | How to check |
| ----------- | ------------------ | ------------ |
| **Node.js** | v20 or higher      | `node -v`    |
| **npm**     | v10 or higher      | `npm -v`     |
| **Git**     | Any recent version | `git -v`     |

If Node.js is not installed, download it from [https://nodejs.org](https://nodejs.org) — choose the **LTS** version.

You will also need accounts on:

- **Supabase** — [https://supabase.com](https://supabase.com) (free tier is sufficient)
- **Vercel** — [https://vercel.com](https://vercel.com) (free tier is sufficient, recommended for hosting)

---

## 2. Get the Code

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd nail-salon
```

---

## 3. Install Dependencies

Inside the project folder, install all required packages:

```bash
npm install
```

This will install everything listed in `package.json`, including:

- **Next.js 16** — the web framework
- **React 19** — UI library
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations
- **Supabase JS** — database client
- **Resend** — email sending
- **Vercel Analytics & Speed Insights** — performance monitoring

---

## 4. Set Up Supabase

The site uses **Supabase** as its database backend. You need to create a Supabase project and set up the required tables.

### Step 4.1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New project"**
3. Give it a name (e.g., `iconix-nail-bar`), choose a region close to your users, and set a database password
4. Wait for the project to finish provisioning (~1–2 minutes)

### Step 4.2 — Get Your API Keys

1. In your Supabase project, go to **Settings → API**
2. Note down the following:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **Publishable (anon) key** — a long string starting with `eyJ...`
   - **Secret (service_role) key** — another long string starting with `eyJ...` — **keep this private**

### Step 4.3 — Create the Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL scripts one at a time.

#### Create the `contact_status` enum

```sql
CREATE TYPE contact_status AS ENUM ('new', 'in_progress', 'resolved', 'spam');
```

#### Create the `newsletter_subscribers` table

```sql
CREATE TABLE newsletter_subscribers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  source      TEXT        NOT NULL DEFAULT 'popup',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON newsletter_subscribers (email);
CREATE INDEX ON newsletter_subscribers (created_at DESC);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);
```

#### Create the `soft_opening_reservations` table

```sql
CREATE TABLE soft_opening_reservations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL CHECK (trim(name) <> ''),
  email       TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone       TEXT,
  confirmed   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON soft_opening_reservations (email);
CREATE INDEX ON soft_opening_reservations (created_at DESC);
CREATE INDEX ON soft_opening_reservations (confirmed);

ALTER TABLE soft_opening_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert" ON soft_opening_reservations
  FOR INSERT TO anon WITH CHECK (true);
```

#### Create the `insert_soft_opening_reservation` function (enforces 50-spot cap)

```sql
CREATE OR REPLACE FUNCTION insert_soft_opening_reservation(
  p_name  TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL
)
RETURNS soft_opening_reservations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
  v_row   soft_opening_reservations;
BEGIN
  SELECT COUNT(*) INTO v_count FROM soft_opening_reservations;
  IF v_count >= 50 THEN
    RAISE EXCEPTION 'SPOTS_FULL' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO soft_opening_reservations (name, email, phone)
  VALUES (trim(p_name), lower(trim(p_email)), trim(p_phone))
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_soft_opening_reservation TO anon;
```

#### Create the `contact_submissions` table

```sql
CREATE TABLE contact_submissions (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT            NOT NULL,
  email       TEXT            NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone       TEXT,
  message     TEXT            NOT NULL CHECK (trim(message) <> ''),
  status      contact_status  NOT NULL DEFAULT 'new',
  notes       TEXT,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX ON contact_submissions (status, created_at DESC);
CREATE INDEX ON contact_submissions (email);
CREATE INDEX ON contact_submissions (created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);
```

#### Create the `updated_at` auto-update trigger

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 5. Configure Environment Variables

The project uses two environment files. Both must be in the **root of the project folder**.

### `.env` — Public configuration (already included in the repo)

This file is already committed and contains salon info. You can edit it to update business details:

```env
NEXT_PUBLIC_SALON_NAME=Iconix

# Contact
NEXT_PUBLIC_ADDRESS_LINE1=6547 HWY 6 North
NEXT_PUBLIC_ADDRESS_LINE2= Houston, TX 77084
NEXT_PUBLIC_PHONE=(281) 766-5678
NEXT_PUBLIC_EMAIL=iconixnailbar@gmail.com

# Hours
NEXT_PUBLIC_HOURS_MON_SAT=9:30 AM – 7:00 PM
NEXT_PUBLIC_HOURS_SUN=10:00 AM – 5:00 PM

# Social Media Links
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/iconixnailbar
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/iconixnailbar
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@iconix.nail.bar

# Supabase (public keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here

# Soft Opening
NEXT_PUBLIC_SOFT_OPENING_DATE=2026-05-01T23:59:59
NEXT_PUBLIC_SOFT_OPENING_SPOTS=50
```

> Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the values from Step 4.2.

### `.env.local` — Private secrets (you must create this file manually)

Create a new file called `.env.local` in the project root. **Never commit this file** — it is already in `.gitignore`.

```env
# Supabase service role key (bypasses RLS — keep this secret)
SUPABASE_SECRET_KEY=your-service-role-key-here

# Admin panel password (you choose this — used to log into /admin)
ADMIN_PASSWORD=choose-a-strong-password-here

# Admin session secret — must be a 64-character hex string
ADMIN_SESSION_SECRET=your-64-char-hex-string-here
```

#### How to generate `ADMIN_SESSION_SECRET`

Run this command in your terminal:

```bash
openssl rand -hex 32
```

Copy the output (64 characters) and paste it as the value for `ADMIN_SESSION_SECRET`.

> If `openssl` is not available, use any password manager's "generate random string" feature — 64 hex characters (0–9, a–f only).

---

## 6. Run Locally (Development)

Once dependencies are installed and environment variables are configured:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other useful commands:

```bash
npm run build    # Check for build errors (run this before deploying)
npm run lint     # Check for code style issues
npm start        # Run the production build locally (run `npm run build` first)
```

---

## 7. Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform — it is built by the same team as Next.js and requires zero configuration.

### Step 7.1 — Push the code to GitHub

If the repo is not already on GitHub, create a new repository and push:

```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 7.2 — Import the project on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** and connect your GitHub account
3. Select the `nail-salon` repository
4. Click **"Deploy"** — Vercel will detect it is a Next.js project automatically

### Step 7.3 — Add environment variables to Vercel

The `.env.local` file is not pushed to GitHub, so you must add the private variables manually in Vercel.

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add **all** of the following variables (copy the values from your local `.env` and `.env.local`):

| Variable Name                          | Where to find the value                      |
| -------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase → Settings → API                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API                    |
| `SUPABASE_SECRET_KEY`                  | Supabase → Settings → API (service_role key) |
| `ADMIN_PASSWORD`                       | The password you chose in `.env.local`       |
| `ADMIN_SESSION_SECRET`                 | The 64-char hex string from `.env.local`     |
| `NEXT_PUBLIC_SALON_NAME`               | From `.env`                                  |
| `NEXT_PUBLIC_ADDRESS_LINE1`            | From `.env`                                  |
| `NEXT_PUBLIC_ADDRESS_LINE2`            | From `.env`                                  |
| `NEXT_PUBLIC_PHONE`                    | From `.env`                                  |
| `NEXT_PUBLIC_EMAIL`                    | From `.env`                                  |
| `NEXT_PUBLIC_HOURS_MON_SAT`            | From `.env`                                  |
| `NEXT_PUBLIC_HOURS_SUN`                | From `.env`                                  |
| `NEXT_PUBLIC_INSTAGRAM_URL`            | From `.env`                                  |
| `NEXT_PUBLIC_FACEBOOK_URL`             | From `.env`                                  |
| `NEXT_PUBLIC_TIKTOK_URL`               | From `.env`                                  |
| `NEXT_PUBLIC_SOFT_OPENING_DATE`        | From `.env`                                  |
| `NEXT_PUBLIC_SOFT_OPENING_SPOTS`       | From `.env`                                  |

3. After adding all variables, go to **Deployments** and click **"Redeploy"** on the latest deployment — environment variables only apply to new deployments.

---

## 8. Deploy to a Custom Server (Alternative)

If you prefer to host on your own server (e.g., a VPS on DigitalOcean, AWS, Railway, etc.):

```bash
# 1. Install dependencies
npm install

# 2. Build the production bundle
npm run build

# 3. Start the production server
npm start
```

The server will run on port **3000** by default. Use a reverse proxy (Nginx, Caddy) to expose it on port 80/443 with HTTPS.

> Make sure all environment variables from `.env` and `.env.local` are set in your server's environment before running `npm start`.

---

## 9. Admin Panel Access

The site has a private admin dashboard for managing contacts, reservations, and newsletter subscribers.

- **URL:** `https://your-domain.com/admin`
- **Login:** Enter the password you set as `ADMIN_PASSWORD`

The admin panel includes:

- **Contacts** — View and update status of contact form submissions
- **Reservations** — View soft opening sign-ups
- **Newsletter** — View newsletter subscribers

> If you forget the admin password, update `ADMIN_PASSWORD` in Vercel's environment variables and redeploy.

---

## 10. Gallery Images

To add or update photos on the gallery page:

1. Place image files (`.jpg`, `.jpeg`, `.png`, or `.webp`) into the folder:
   ```
   public/images/gallery_imgs/
   ```
2. The gallery page will automatically pick them up — no code changes needed.

---

## 11. Verify Everything Works

After deploying, test each feature to confirm it is working:

- [ ] Home page loads correctly
- [ ] Services page shows the service menu
- [ ] Gallery page shows images
- [ ] About page loads
- [ ] Contact form submits successfully (check Supabase → `contact_submissions` table)
- [ ] `/special` soft opening page shows the countdown and signup form works (check Supabase → `soft_opening_reservations`)
- [ ] Email popup appears and newsletter signup works (check Supabase → `newsletter_subscribers`)
- [ ] `/admin` redirects to `/admin/login`
- [ ] Admin login works with the password you set
- [ ] Admin pages show data from Supabase

---

## 12. Troubleshooting

### Build fails with missing environment variable errors

Make sure all environment variables are set — both in Vercel's dashboard (for deployed site) and in your local `.env` / `.env.local` files (for local dev).

### Supabase connection errors / data not saving

- Double-check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` match your Supabase project exactly
- Verify `SUPABASE_SECRET_KEY` is the **service_role** key, not the anon key
- Confirm the tables and RLS policies were created (Step 4.3)

### Admin panel redirects to login on every visit

- `ADMIN_SESSION_SECRET` must be set and must stay the same between deployments — changing it invalidates all existing sessions
- Make sure `ADMIN_PASSWORD` is set correctly

### Gallery shows no images

- Images must be inside `public/images/gallery_imgs/` with one of these extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Re-deploy after adding images if hosting on Vercel (static files need a new build)

### `npm run build` fails locally but works on Vercel (or vice versa)

- Make sure your local Node.js version is **v20 or higher** (`node -v`)
- Delete `node_modules` and `.next`, then reinstall: `rm -rf node_modules .next && npm install`
