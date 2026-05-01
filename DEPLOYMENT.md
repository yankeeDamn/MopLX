# 🚀 MopLX Production Deployment Guide

Complete guide to deploy your newsletter platform to production.

## Overview

This guide covers:
- Supabase production setup
- Vercel deployment
- Domain configuration
- Email service setup
- Security best practices
- Post-deployment testing

**Estimated Time**: 2-3 hours (including DNS propagation)

---

## Phase 1: Supabase Production Setup (30 minutes)

### 1.1 Create Production Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Create project:
   - **Name**: MopLX-Production (or your preferred name)
   - **Database Password**: Generate a **strong** password and save it
   - **Region**: Choose closest to your target audience
4. Wait for project creation (~2 minutes)

### 1.2 Apply Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click "New query"
3. Copy entire contents of `supabase/schema.sql` from your repository
4. Paste and click "Run"
5. Verify: "Success. No rows returned"

### 1.3 Create Storage Buckets

#### Create Images Bucket
1. Go to **Storage** in sidebar
2. Click "Create a new bucket"
3. Settings:
   - Name: `images`
   - Public bucket: ✅ **Yes**
   - File size limit: `10485760` (10MB)
   - Allowed MIME types: `image/*`
4. Click "Create bucket"

#### Create Videos Bucket
1. Click "Create a new bucket" again
2. Settings:
   - Name: `videos`
   - Public bucket: ✅ **Yes**
   - File size limit: `52428800` (50MB)
   - Allowed MIME types: `video/*`
3. Click "Create bucket"

### 1.4 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - Enable email confirmations: ✅ (optional but recommended)
   - Secure email change: ✅

### 1.5 Set URL Configuration

1. In Authentication → **URL Configuration**
2. Update settings:
   - **Site URL**: `https://yourdomain.com` (your production URL)
   - **Redirect URLs**: Add:
     - `https://yourdomain.com/**`
     - `https://yourdomain.com/api/auth/callback`

⚠️ **Note**: Replace `yourdomain.com` with your actual domain

### 1.6 Get Production API Keys

1. Go to **Project Settings** → **API**
2. Copy and save securely:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal")

⚠️ **Security**: Never expose service_role key in client-side code or Git!

---

## Phase 2: Vercel Deployment (30 minutes)

### 2.1 Prepare Repository

1. Ensure all changes are committed:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

2. Verify `.gitignore` includes:
```
.env.local
.env*.local
.env.production
```

### 2.2 Import to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 2.3 Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# App URL (use your Vercel domain initially)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

#### Optional but Recommended

```env
# API Security
API_SECRET_KEY=generate-with-openssl-rand-base64-32

# Email Service (if using Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=MopLX <noreply@yourdomain.com>
```

**Generate API_SECRET_KEY**:
```bash
openssl rand -base64 32
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Verify deployment at `https://your-project.vercel.app`

---

## Phase 3: Custom Domain Setup (20 minutes)

### 3.1 Add Domain in Vercel

1. In Vercel project → **Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Vercel will provide DNS configuration

### 3.2 Configure DNS Records

Add these records in your domain registrar:

**For apex domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Wait for DNS propagation** (~5-60 minutes)

### 3.3 Update Environment Variables

Once domain is active:
1. In Vercel → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL`:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. Redeploy to apply changes

### 3.4 Update Supabase URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Update:
   - **Site URL**: `https://yourdomain.com`
3. Update redirect URLs to use your domain

### 3.5 SSL Certificate

- Vercel automatically provisions SSL certificates
- Wait a few minutes for SSL to be active
- Verify HTTPS is working

---

## Phase 4: Email Service Setup (Optional, 20 minutes)

### 4.1 Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Create an account
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `re_`)

### 4.2 Verify Domain

1. In Resend → **Domains** → "Add Domain"
2. Enter your domain: `yourdomain.com`
3. Add the provided DNS records to your domain:
   - **TXT** record for verification
   - **MX** records for receiving (optional)
   - **DKIM** records for authentication
4. Wait for verification (5-30 minutes)

### 4.3 Update Environment Variables

In Vercel:
```env
RESEND_API_KEY=re_your_actual_key_here
EMAIL_FROM=MopLX <noreply@yourdomain.com>
```

Redeploy after updating.

---

## Phase 5: Security Hardening (15 minutes)

### 5.1 Create Production Admin User

1. Go to production Supabase → **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: Same as `NEXT_PUBLIC_ADMIN_EMAIL` in Vercel
   - **Password**: Strong, unique password
   - **Auto Confirm User**: ✅
4. Save credentials securely (use a password manager)

### 5.2 Enable Additional Security

In Supabase → **Authentication** → **Settings**:
- ✅ Enable email confirmations
- ✅ Enable secure email change
- ✅ Set session timeout (e.g., 7 days)

### 5.3 Set Up Rate Limiting (Optional)

Consider adding rate limiting in `middleware.ts` for production:
```typescript
// Example: Add rate limiting logic
```

### 5.4 Review Row Level Security

Verify RLS policies in Supabase → **Authentication** → **Policies**:
- Resources table should allow public reads
- Only authenticated users can write
- Admin operations use service_role key

---

## Phase 6: Testing & Validation (30 minutes)

### 6.1 Functionality Testing

Test these features in production:

**Public Pages:**
- [ ] Homepage loads correctly
- [ ] Resources page displays articles
- [ ] Individual article pages work
- [ ] Newsletter form submission
- [ ] Contact page loads
- [ ] Pricing page loads

**Authentication:**
- [ ] Sign up flow works
- [ ] Email verification (if enabled)
- [ ] Sign in works
- [ ] Sign out works

**Admin Dashboard:**
- [ ] `/admin` requires authentication
- [ ] Admin can access with correct email
- [ ] Non-admin users are blocked

**Content Management:**
- [ ] Create new article
- [ ] Edit existing article
- [ ] Delete article
- [ ] Publish/unpublish toggle
- [ ] Preview mode works

**Media Upload:**
- [ ] Image upload works
- [ ] Video upload works
- [ ] Media URLs are accessible
- [ ] File size limits enforced

**Analytics:**
- [ ] View tracking works
- [ ] Share buttons function
- [ ] Analytics view displays data

**Social Features:**
- [ ] Facebook share works
- [ ] LinkedIn share works
- [ ] Twitter share works
- [ ] Copy link works

### 6.2 Performance Testing

- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Test load time from different locations
- [ ] Check mobile responsiveness
- [ ] Verify images are optimized

### 6.3 SEO Verification

- [ ] Meta tags are correct
- [ ] Open Graph tags work (test with Facebook Debugger)
- [ ] Sitemap is accessible (if generated)
- [ ] robots.txt is correct

### 6.4 Browser Testing

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## Phase 7: Post-Deployment Tasks

### 7.1 Create Initial Content

1. Sign in to admin dashboard
2. Create 3-5 initial articles
3. Upload featured images
4. Set one article as featured
5. Publish articles

### 7.2 Set Up Monitoring

**Vercel Analytics:**
1. In Vercel project → **Analytics**
2. Enable Web Analytics
3. Monitor traffic and performance

**Supabase Monitoring:**
1. Check **Database** → **Usage**
2. Monitor API requests
3. Review storage usage

### 7.3 Configure Backup

In Supabase:
1. Enable automatic backups (paid plans)
2. Or set up manual backup scripts

### 7.4 Document Credentials

Store securely (use password manager):
- Supabase project URL and keys
- Admin email and password
- Vercel deployment info
- Domain registrar details
- Resend API key (if used)

---

## Troubleshooting

### Build Fails in Vercel

**Error: "Module not found"**
```bash
# Locally, clear and rebuild
rm -rf node_modules .next
npm install
npm run build
```

**TypeScript errors:**
- Check `tsconfig.json` is correct
- Ensure all dependencies are installed
- Fix any type errors locally first

### Environment Variables Not Working

1. Verify variables are set in Vercel
2. Ensure names match exactly (case-sensitive)
3. Redeploy after adding/changing variables
4. Check that `NEXT_PUBLIC_` prefix is used for client-side vars

### Admin Dashboard 404 or Unauthorized

1. Verify `ADMIN_EMAIL` matches user email exactly
2. Check user is created in Supabase
3. Ensure middleware is working correctly
4. Clear browser cache and cookies

### Media Upload Fails

1. Verify storage buckets exist
2. Check buckets are set to public
3. Verify service_role key is correct
4. Check CORS settings in Supabase

### Email Not Sending

1. Verify Resend API key is valid
2. Check domain is verified in Resend
3. Review email logs in Resend dashboard
4. Check spam folder

---

## Production Checklist

Before going live:

**Configuration:**
- [ ] All environment variables set in Vercel
- [ ] Supabase database schema applied
- [ ] Storage buckets created and public
- [ ] Admin user created
- [ ] Domain configured with SSL

**Security:**
- [ ] Service role key is secret
- [ ] API secret key is set
- [ ] RLS policies are active
- [ ] Authentication is working
- [ ] Admin access is restricted

**Content:**
- [ ] At least 3-5 articles published
- [ ] Featured content is set
- [ ] Images are uploaded and optimized
- [ ] Categories are defined

**Testing:**
- [ ] All features tested in production
- [ ] Mobile responsiveness verified
- [ ] SEO tags are correct
- [ ] Analytics tracking works

**Monitoring:**
- [ ] Vercel analytics enabled
- [ ] Supabase usage tracking enabled
- [ ] Error logging configured

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review analytics
- Check for errors in Vercel logs
- Monitor Supabase usage
- Respond to newsletter subscribers

**Monthly:**
- Update dependencies (security patches)
- Review and optimize database queries
- Clean up unused media files
- Backup database manually

**Quarterly:**
- Review and update content
- Optimize images and performance
- Update documentation
- Review security settings

---

## Scaling Considerations

### When You Outgrow Free Tiers

**Supabase:**
- Free: 500MB database, 1GB storage
- Pro ($25/mo): 8GB database, 100GB storage
- Consider upgrading when approaching limits

**Vercel:**
- Free: 100GB bandwidth/month
- Pro ($20/mo): 1TB bandwidth
- Consider CDN for static assets

**Resend:**
- Free: 100 emails/day, 3k/month
- Paid plans start at $20/mo for higher volumes

### Performance Optimization

When scaling:
1. Enable CDN for media files
2. Implement database connection pooling
3. Add Redis for caching
4. Use ISR (Incremental Static Regeneration)
5. Optimize images with next/image

---

## Support & Resources

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Resend Docs](https://resend.com/docs)

**MopLX Docs:**
- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Local setup
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Admin features
- [QUICKSTART.md](./QUICKSTART.md) - Quick start

**Community:**
- Open issues on GitHub
- Contact maintainers

---

## 🎉 Congratulations!

Your MopLX newsletter platform is now live in production! 

**What's Next?**
1. Start creating amazing content
2. Grow your subscriber base
3. Monitor analytics and engagement
4. Share on social media
5. Consider premium content offerings

**Happy publishing!** 🚀
