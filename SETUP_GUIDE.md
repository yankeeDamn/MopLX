# MopLX Setup Guide - Quick Start

This guide will help you set up the MopLX newsletter platform with all the new admin dashboard features in under 15 minutes.

## Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works great)
- Git installed
- A code editor

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yankeeDamn/MopLX.git
cd MopLX

# Install dependencies
npm install
```

## Step 2: Set Up Supabase (5 minutes)

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New project"
5. Fill in:
   - **Name**: MopLX (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest to your users
6. Click "Create new project" (takes 1-2 minutes)

### 2.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see "Success. No rows returned"

### 2.3 Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Create two buckets:

**Bucket 1: images**
- Name: `images`
- Public: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: `image/*`

**Bucket 2: videos**
- Name: `videos`
- Public: ✅ Yes
- File size limit: 50MB
- Allowed MIME types: `video/*`

### 2.4 Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon)
2. Go to **API** section
3. Copy these values:
   - **Project URL** (starts with https://)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - click "Reveal")

⚠️ **Important**: Keep the service_role key secret! Never commit it to Git or expose it publicly.

## Step 3: Configure Authentication (2 minutes)

### 3.1 Enable Email Authentication

1. In Supabase, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable it
4. Enable "Confirm email" (optional but recommended)

### 3.2 Set Site URL

1. Still in Authentication settings, find **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (for development)
3. Add to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback`
   - `http://localhost:3000/*` (wildcard for development)

## Step 4: Configure Environment Variables (2 minutes)

1. Copy the example environment file:

```bash
cp .env.example .env.local
# If .env.example doesn't exist, create .env.local from scratch
```

2. Edit `.env.local` and add:

```env
# ─── Supabase Configuration ───────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ─── Admin Configuration ──────────────────────────────────────
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
ADMIN_EMAIL=your-email@example.com

# ─── App URL ──────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Optional Security ────────────────────────────────────────
# Uncomment and set for production:
# API_SECRET_KEY=your-random-secret-key-here
```

Replace:
- `your-project.supabase.co` with your Project URL
- `your-anon-key-here` with your anon key
- `your-service-role-key-here` with your service role key
- `your-email@example.com` with your email address

## Step 5: Create Admin User (1 minute)

### Option A: Sign Up Through the App

1. Start the dev server (see Step 6)
2. Go to `http://localhost:3000/signin`
3. Click "Sign up" and use the email from `NEXT_PUBLIC_ADMIN_EMAIL`
4. Check your email for verification link (if enabled)

### Option B: Create User in Supabase

1. Go to **Authentication** → **Users** in Supabase
2. Click "Add user" → "Create new user"
3. Enter your admin email
4. Set a password
5. Click "Create user"

## Step 6: Run the Application (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Access Admin Dashboard (1 minute)

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Sign in with your admin email
3. You should see the admin dashboard! 🎉

## Step 8: Create Your First Article (2 minutes)

1. Click **"+ New Article"**
2. Fill in:
   - Title: "Getting Started with MopLX"
   - Slug: "getting-started" (auto-fills)
   - Category: "Tutorial"
   - Type: "Free"
   - Description: "Learn how to use the MopLX admin dashboard"
   - Content:
     ```markdown
     ## Welcome to MopLX!
     
     This is your first article. You can write content using Markdown.
     
     ### Features
     - Easy content management
     - Social media sharing
     - Analytics tracking
     - Media uploads
     
     Start creating amazing content!
     ```
3. Click **"Create Article"**
4. View it at `http://localhost:3000/resources/getting-started`

## Verification Checklist

Make sure everything works:

- [ ] Admin dashboard loads at `/admin`
- [ ] You can create a new article
- [ ] Article appears on the homepage
- [ ] Article detail page loads correctly
- [ ] Social share buttons appear and work
- [ ] Upload image works (try the "Upload Image" button)
- [ ] Analytics view shows your new article
- [ ] Search and filters work
- [ ] Preview mode shows article correctly

## Next Steps

### Customize Your Site

1. **Update branding**:
   - Edit `src/app/layout.tsx` for site title and metadata
   - Update `src/components/Navbar.tsx` for navigation
   - Customize colors in `src/app/globals.css`

2. **Add content**:
   - Create more articles
   - Upload your own images
   - Organize by categories

3. **Configure email**:
   - Set up Resend for transactional emails (optional)
   - See main README for instructions

### Deploy to Production

When you're ready to go live:

1. **Set up production Supabase**:
   - Create a new project or use the same one
   - Update environment variables

2. **Deploy to Vercel**:
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial setup"
   git push origin main
   
   # Then import to Vercel
   # - Go to vercel.com
   # - Import your GitHub repo
   # - Add all environment variables
   # - Deploy!
   ```

3. **Update URLs**:
   - In Supabase, update Site URL to your production domain
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
   - Add production URL to redirect URLs

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your anon key is correct
- Make sure you don't have typos in `.env.local`

### "Unauthorized" when accessing /admin
- Verify your email matches `NEXT_PUBLIC_ADMIN_EMAIL` exactly
- Make sure you're signed in
- Try signing out and signing in again

### Media upload fails
- Check storage buckets are created in Supabase
- Verify buckets are set to public
- Check file size is under limits (10MB images, 50MB videos)

### Build errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall
- Check Node.js version is 20 or higher

## Getting Help

- 📖 Read the [Admin Guide](./ADMIN_GUIDE.md) for detailed feature documentation
- 📝 Check the main [README](./README.md) for general information
- 🐛 Open an issue on GitHub if you find bugs
- 💬 Contact support (see README for details)

## What's Next?

Now that you have MopLX set up, explore these features:

1. **Media Library**: Upload and manage images/videos
2. **Analytics Dashboard**: Track article performance
3. **Social Sharing**: Share to Facebook, LinkedIn, Twitter
4. **Bulk Operations**: Manage multiple articles at once
5. **Preview Mode**: See how articles look before publishing

Happy publishing! 🚀

---

**Pro Tip**: Bookmark `/admin` for quick access to your dashboard!
