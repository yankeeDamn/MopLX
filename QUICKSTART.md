# 🚀 MopLX Quick Start Guide

Get your newsletter platform up and running in **under 30 minutes**!

## Prerequisites
- Node.js 20+ installed
- Git installed
- A [Supabase](https://supabase.com) account (free tier works)

## Step 1: Clone & Install (2 minutes)

```bash
git clone https://github.com/yankeeDamn/MopLX.git
cd MopLX
npm install
```

## Step 2: Supabase Setup (10 minutes)

### 2.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: MopLX
   - **Database Password**: (generate a strong one)
   - **Region**: Choose closest to you
4. Wait 1-2 minutes for project creation

### 2.2 Run Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Click "New query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. You should see: "Success. No rows returned"

### 2.3 Create Storage Buckets
1. Go to **Storage** in sidebar
2. Click "Create a new bucket"
3. Create first bucket:
   - Name: `images`
   - Public: ✅ **Yes**
   - Click "Create bucket"
4. Create second bucket:
   - Name: `videos`
   - Public: ✅ **Yes**
   - Click "Create bucket"

### 2.4 Get Your API Keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy these three values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string)
   - **service_role** key (click "Reveal" first)

⚠️ **Keep service_role key secret!**

## Step 3: Configure Environment (3 minutes)

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and update:
```env
# Replace with YOUR Supabase values from Step 2.4
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Use YOUR email address
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
ADMIN_EMAIL=your-email@example.com

# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Create Admin User (2 minutes)

### Option A: Through Supabase Dashboard (Recommended)
1. In Supabase → **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: Same as `NEXT_PUBLIC_ADMIN_EMAIL` above
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ Check this
4. Click "Create user"

### Option B: Through the App
1. Start dev server first (see Step 5)
2. Go to `http://localhost:3000/signup`
3. Sign up with your admin email
4. Check email for verification (if required)

## Step 5: Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Access Admin Dashboard

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Sign in with your admin email and password
3. You should see the dashboard! 🎉

## Step 7: Create Your First Article

1. Click **"+ New Article"** button
2. Fill in the form:
   - **Title**: "Welcome to MopLX"
   - **Slug**: Auto-generates, or customize
   - **Category**: "Getting Started"
   - **Type**: Free
   - **Description**: "Your first article"
   - **Content**: Write some markdown
3. Click **"Create Article"**
4. View at: `http://localhost:3000/resources/welcome-to-moplx`

## ✅ Verify Everything Works

- [ ] Homepage loads at `http://localhost:3000`
- [ ] Admin dashboard accessible at `/admin`
- [ ] Can create new articles
- [ ] Can upload images (try the "Upload Image" button)
- [ ] Articles appear on homepage
- [ ] Article detail pages load
- [ ] Social share buttons work
- [ ] Analytics view shows data

## 🚀 Next Steps

### Customize Your Site
1. **Branding**: Edit `src/app/layout.tsx` for site title
2. **Colors**: Update `src/app/globals.css` for themes
3. **Navigation**: Modify `src/components/Navbar.tsx`
4. **Content**: Start creating articles!

### Deploy to Production
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

Quick deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Complete admin features guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[README.md](./README.md)** - Full project documentation

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Double-check your `.env.local` values
- Ensure no typos in URLs or keys
- Verify Supabase project is active

### "Unauthorized" at /admin
- Verify email matches `NEXT_PUBLIC_ADMIN_EMAIL` exactly
- Make sure you're signed in
- Try signing out and back in

### Media upload fails
- Check storage buckets exist in Supabase
- Verify buckets are set to **public**
- Check file size (10MB max for images, 50MB for videos)

### Port 3000 already in use
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## 🎉 You're Ready!

You now have a fully functional newsletter platform with:
- ✅ Admin dashboard
- ✅ Content management
- ✅ Media uploads
- ✅ Analytics tracking
- ✅ Social sharing
- ✅ Dark mode
- ✅ SEO optimized

**Start creating content and grow your community!** 🚀

---

**Need Help?** Check the other documentation files or open an issue on GitHub.
