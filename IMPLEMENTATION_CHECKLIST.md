# 📋 MopLX Implementation Checklist

Use this checklist to track your progress from setup to production deployment.

---

## Phase 1: Local Development Setup ⚙️

### Supabase Configuration
- [ ] Created Supabase account at https://supabase.com
- [ ] Created new Supabase project
- [ ] Ran database schema from `supabase/schema.sql`
- [ ] Created `images` storage bucket (public)
- [ ] Created `videos` storage bucket (public)
- [ ] Copied Project URL from Settings → API
- [ ] Copied anon public key from Settings → API
- [ ] Copied service_role key from Settings → API (keep secret!)

### Environment Configuration
- [ ] Created `.env.local` file (from `.env.example`)
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set `NEXT_PUBLIC_ADMIN_EMAIL` (your email)
- [ ] Set `ADMIN_EMAIL` (same as above)
- [ ] Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`

**Helper:** Run `bash scripts/setup-env.sh` for interactive setup

### Admin User Creation
- [ ] Created admin user in Supabase (Authentication → Users)
- [ ] Used same email as `NEXT_PUBLIC_ADMIN_EMAIL`
- [ ] Saved admin password securely
- [ ] Auto-confirmed user (checked the box)

### Application Setup
- [ ] Ran `npm install`
- [ ] Ran `npm run dev` successfully
- [ ] Visited http://localhost:3000 (homepage loads)
- [ ] Visited http://localhost:3000/admin (redirects to sign in)
- [ ] Signed in with admin credentials
- [ ] Admin dashboard loads successfully

---

## Phase 2: Initial Testing & Content 📝

### Dashboard Features
- [ ] Created first test article
- [ ] Edited an article
- [ ] Deleted test article
- [ ] Uploaded test image
- [ ] Uploaded test video
- [ ] Tested preview mode
- [ ] Used search functionality
- [ ] Applied filters (status, type, category)
- [ ] Tested bulk operations
- [ ] Switched between view modes (List/Grid/Analytics)

### Public Features
- [ ] Homepage displays articles
- [ ] Article detail page loads
- [ ] Newsletter subscription form works
- [ ] Social share buttons appear
- [ ] Contact page loads
- [ ] Pricing page loads
- [ ] Dark mode works
- [ ] Mobile responsive (test on phone or resize browser)

### Analytics
- [ ] View counter increments on article visits
- [ ] Share tracking works (click share buttons)
- [ ] Analytics view shows data in admin dashboard
- [ ] Platform-specific share counts appear

---

## Phase 3: Production Deployment 🚀

### Supabase Production Setup
- [ ] Created production Supabase project (separate from dev)
- [ ] Applied database schema to production
- [ ] Created storage buckets (images, videos)
- [ ] Set buckets to public
- [ ] Configured authentication providers (email)
- [ ] Set Site URL (will update after domain setup)
- [ ] Copied production API keys
- [ ] Added redirect URLs

### GitHub Repository
- [ ] Committed all changes to Git
- [ ] Pushed to GitHub
- [ ] Verified `.env.local` is NOT in repository (.gitignore)
- [ ] Repository is accessible for Vercel import

### Vercel Deployment
- [ ] Created Vercel account at https://vercel.com
- [ ] Imported GitHub repository
- [ ] Confirmed Next.js framework detected
- [ ] Added all environment variables in Vercel settings:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` (production)
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (production)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (production)
  - [ ] `NEXT_PUBLIC_ADMIN_EMAIL`
  - [ ] `ADMIN_EMAIL`
  - [ ] `NEXT_PUBLIC_APP_URL` (Vercel URL initially)
- [ ] Deployed successfully
- [ ] Visited Vercel deployment URL
- [ ] Homepage loads in production

### Production Admin Setup
- [ ] Created admin user in production Supabase
- [ ] Tested login at production /admin
- [ ] Created first production article
- [ ] Verified article appears on homepage

---

## Phase 4: Custom Domain (Optional) 🌐

### Domain Configuration
- [ ] Added domain in Vercel (Settings → Domains)
- [ ] Configured DNS records at domain registrar:
  - [ ] A record: @ → 76.76.21.21
  - [ ] CNAME: www → cname.vercel-dns.com
- [ ] Waited for DNS propagation (5-60 minutes)
- [ ] Verified domain is accessible
- [ ] SSL certificate is active (HTTPS works)

### Update URLs
- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel to custom domain
- [ ] Redeployed application
- [ ] Updated Site URL in Supabase to custom domain
- [ ] Updated redirect URLs in Supabase
- [ ] Tested authentication with new domain

---

## Phase 5: Email Service (Optional) 📧

### Resend Setup
- [ ] Created account at https://resend.com
- [ ] Created API key
- [ ] Added domain in Resend
- [ ] Added DNS records for domain verification:
  - [ ] TXT record for verification
  - [ ] DKIM records
  - [ ] MX records (optional)
- [ ] Waited for domain verification
- [ ] Domain status shows "Verified"

### Environment Configuration
- [ ] Added `RESEND_API_KEY` to Vercel
- [ ] Added `EMAIL_FROM` to Vercel (e.g., `MopLX <noreply@yourdomain.com>`)
- [ ] Redeployed application
- [ ] Tested email verification (sign up new user)
- [ ] Received verification email

---

## Phase 6: Security & Optimization 🔒

### Security Hardening
- [ ] Generated API secret key (`openssl rand -base64 32`)
- [ ] Added `API_SECRET_KEY` to Vercel
- [ ] Verified service_role key is NOT exposed in client code
- [ ] Enabled email confirmation in Supabase (optional)
- [ ] Set session timeout in Supabase
- [ ] Reviewed RLS policies in Supabase

### Performance
- [ ] Ran Lighthouse audit (aim for 90+ score)
- [ ] Optimized images before uploading
- [ ] Tested page load speed
- [ ] Verified mobile performance
- [ ] Checked Core Web Vitals in Vercel Analytics

### SEO
- [ ] Verified meta tags are correct
- [ ] Tested Open Graph preview (Facebook Debugger)
- [ ] Added structured data if needed
- [ ] Submitted sitemap to Google Search Console (if generated)

---

## Phase 7: Content & Launch 🎉

### Initial Content Creation
- [ ] Written and published 5-10 initial articles
- [ ] Uploaded featured images for all articles
- [ ] Set 1-2 articles as featured
- [ ] Organized articles by categories
- [ ] Added at least 3 different categories
- [ ] Created mix of free and paid content (if applicable)

### Branding & Customization
- [ ] Updated site title in `src/app/layout.tsx`
- [ ] Customized color scheme in `src/app/globals.css`
- [ ] Updated navigation in `src/components/Navbar.tsx`
- [ ] Updated footer links in `src/components/Footer.tsx`
- [ ] Added logo/branding images
- [ ] Updated contact information
- [ ] Customized pricing plans (if applicable)

### Testing Before Launch
- [ ] Created test newsletter subscription
- [ ] Tested all public pages
- [ ] Verified admin dashboard works
- [ ] Tested on multiple browsers:
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
- [ ] Tested on mobile devices:
  - [ ] iOS Safari
  - [ ] Android Chrome
- [ ] Verified all social share buttons work
- [ ] Checked analytics tracking
- [ ] Reviewed for broken links

### Launch Preparation
- [ ] Prepared launch announcement
- [ ] Created social media posts
- [ ] Notified existing community (if any)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Created backup of database (Supabase)
- [ ] Documented admin credentials securely

---

## Phase 8: Post-Launch Monitoring 📊

### Week 1
- [ ] Monitor Vercel deployment logs daily
- [ ] Check Supabase usage metrics
- [ ] Respond to any user feedback
- [ ] Fix any critical bugs
- [ ] Monitor analytics for traffic patterns

### Ongoing Maintenance
- [ ] Weekly: Review analytics and engagement
- [ ] Weekly: Publish new content (1-2 articles)
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review and optimize performance
- [ ] Monthly: Backup database
- [ ] Quarterly: Security audit
- [ ] Quarterly: Update documentation

---

## Resources & Support 📚

### Documentation
- [QUICKSTART.md](./QUICKSTART.md) - 30-minute setup guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Admin dashboard features
- [README.md](./README.md) - Project overview

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)

### Helper Commands
```bash
# Interactive environment setup
bash scripts/setup-env.sh

# Development
npm run dev

# Build for production
npm run build
npm start

# Generate API secret
openssl rand -base64 32
```

---

## Notes & Customizations

Use this space to track your specific customizations, important URLs, and notes:

```
Project Name: ________________
Production URL: ________________
Supabase Project: ________________
Admin Email: ________________

Custom Features Added:
- 
- 
- 

Known Issues:
- 
- 

Future Improvements:
- 
- 
```

---

## Progress Summary

**Status:** [ ] Not Started  [ ] In Progress  [ ] Complete

**Current Phase:** _________________

**Next Steps:**
1. ________________
2. ________________
3. ________________

**Blockers/Issues:**
- ________________

---

**Last Updated:** ________________

**Notes:**
