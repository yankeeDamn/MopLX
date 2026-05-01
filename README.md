# MopLX - Newsletter & Learning Platform

A modern newsletter and learning platform for DevOps, Cloud, and Infrastructure engineers. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

**Ready to launch in under 30 minutes!**

### 📖 Complete Documentation

| Guide | Purpose | Time | Audience |
|-------|---------|------|----------|
| **[🎯 NEXT_STEPS.md](./NEXT_STEPS.md)** | **Your roadmap** | 5 min read | **Start here!** |
| **[⚡ QUICKSTART.md](./QUICKSTART.md)** | Fastest setup | 30 minutes | First-time users |
| **[📚 SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Detailed local setup | 15 minutes | Step-by-step learners |
| **[🚀 DEPLOYMENT.md](./DEPLOYMENT.md)** | Production deployment | 2-3 hours | Ready to deploy |
| **[🎨 ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** | Dashboard features | Reference | Content creators |
| **[✅ IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** | Track progress | Ongoing | Project managers |

### ⚡ Super Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yankeeDamn/MopLX.git
cd MopLX
npm install

# 2. Set up environment (interactive helper)
bash scripts/setup-env.sh

# 3. Create Supabase project & run schema
# Visit https://supabase.com → Create project
# Run supabase/schema.sql in SQL Editor
# Create storage buckets: 'images' and 'videos' (both public)

# 4. Run the app
npm run dev

# 5. Access admin at http://localhost:3000/admin
```

**Prerequisites:** Node.js 20+, Supabase account (free tier works!), 30 minutes

> 💡 **New user?** Read [NEXT_STEPS.md](./NEXT_STEPS.md) first for your complete implementation roadmap!

## 🎉 Features

**Enhanced Admin Dashboard** with powerful content management capabilities:
- 📸 **Media Management** - Upload and manage images/videos with drag-and-drop
- 📊 **Analytics Dashboard** - Track views, shares, and engagement metrics
- 🔄 **Social Media Sharing** - One-click sharing to Facebook, LinkedIn, Twitter, Reddit
- 🔍 **Advanced Search & Filtering** - Find content quickly with multiple filters
- 📦 **Bulk Operations** - Publish/unpublish/delete multiple articles at once
- 👁️ **Preview Mode** - See how articles look before publishing
- 🎨 **Multiple View Modes** - List, Grid, and Analytics views

## 🚀 Features

### Core Features
- **User Authentication**: Sign up/sign in with email verification using NextAuth.js v5
- **Email Verification**: Confirmation emails via Resend (optional, works without in dev mode)
- **Newsletter Subscription**: Email subscription with API integration ready for services like Mailchimp, ConvertKit, or Resend
- **Free Learning Resources**: Tutorials and guides on Kubernetes, CI/CD, Terraform, Monitoring, and more
- **Premium Courses**: Paid deep-dive courses with gated content
- **Articles API**: REST API to create and list articles programmatically
- **Contact Page**: Dedicated contact page with email, social media, and GitHub links
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Automatic dark mode based on system preference
- **SEO Optimized**: Meta tags, structured content, and semantic HTML

### Admin Dashboard Features
- **Rich Content Editor**: Create and edit articles with markdown support and live preview
- **Media Management**: Upload images and videos directly to Supabase Storage
- **Analytics Dashboard**: Track views, shares, and engagement metrics per article
- **Social Sharing**: Built-in sharing to Facebook, LinkedIn, Twitter, and Reddit
- **Search & Filtering**: Advanced search and filter by status, type, and category
- **Bulk Operations**: Select multiple articles to publish, unpublish, or delete
- **Multiple Views**: Switch between List, Grid, and Analytics views
- **Draft Management**: Save articles as drafts and publish when ready
- **Featured Articles**: Mark articles as featured for homepage display

## 📁 Architecture

```
src/
├── app/
│   ├── (auth)/
│   │   ├── signin/              # Sign in page
│   │   │   └── page.tsx
│   │   └── signup/              # Sign up page
│   │       └── page.tsx
│   ├── admin/                   # ⭐ Enhanced Admin Dashboard
│   │   ├── page.tsx
│   │   ├── AdminClient.tsx      # Legacy admin
│   │   └── EnhancedAdminDashboard.tsx  # New admin with all features
│   ├── api/
│   │   ├── analytics/           # ⭐ Analytics tracking API
│   │   │   └── route.ts
│   │   ├── media/               # ⭐ Media upload/management API
│   │   │   └── route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/   # NextAuth.js handler
│   │   │   │   └── route.ts
│   │   │   ├── signup/          # User registration endpoint
│   │   │   │   └── route.ts
│   │   │   └── verify/          # Email verification endpoint
│   │   │       └── route.ts
│   │   ├── subscribe/           # Newsletter subscription API endpoint
│   │   │   └── route.ts
│   │   └── articles/            # Articles CRUD API endpoint
│   │       └── route.ts
│   ├── resources/
│   │   ├── [slug]/              # Individual resource pages (dynamic routes)
│   │   │   └── page.tsx         # ⭐ Enhanced with social sharing
│   │   └── page.tsx             # Resources listing page
│   ├── pricing/
│   │   └── page.tsx             # Pricing plans page
│   ├── contact/
│   │   └── page.tsx             # Contact page with details
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with Navbar + Footer + SessionProvider
│   └── page.tsx                 # Landing page (Hero + Features + Resources)
├── components/
│   ├── Navbar.tsx               # Navigation with mobile menu and auth state
│   ├── Footer.tsx               # Footer with links, social, and contact
│   ├── Hero.tsx                 # Hero section with CTA
│   ├── Features.tsx             # Feature cards section
│   ├── FeaturedResources.tsx    # Resource preview section
│   ├── ResourceCard.tsx         # Resource card component
│   ├── NewsletterForm.tsx       # Newsletter subscription form
│   ├── AuthForm.tsx             # Sign in/sign up form component
│   ├── SessionProvider.tsx      # NextAuth session provider wrapper
│   ├── ShareButtons.tsx         # ⭐ Social media sharing buttons
│   ├── MediaUploader.tsx        # ⭐ Drag-and-drop media uploader
│   └── ResourceAnalyticsTracker.tsx  # ⭐ Automatic view tracking
├── lib/
│   ├── auth.ts                  # NextAuth configuration and user management
│   ├── email.ts                 # Email service using Resend
│   ├── resources.ts             # Resource data and helper functions
│   └── supabase/
│       ├── client.ts            # Supabase browser client
│       └── server.ts            # Supabase server client
├── types/
│   └── database.ts              # ⭐ Enhanced TypeScript types for Supabase
└── supabase/
    └── schema.sql               # ⭐ Enhanced database schema with new tables
```
├── components/
│   ├── Navbar.tsx            # Navigation with mobile menu and auth state
│   ├── Footer.tsx            # Footer with links, social, and contact
│   ├── Hero.tsx              # Hero section with CTA
│   ├── Features.tsx          # Feature cards section
│   ├── FeaturedResources.tsx # Resource preview section
│   ├── ResourceCard.tsx      # Resource card component
│   ├── NewsletterForm.tsx    # Newsletter subscription form
│   ├── AuthForm.tsx          # Sign in/sign up form component
│   └── SessionProvider.tsx   # NextAuth session provider wrapper
└── lib/
    ├── auth.ts               # NextAuth configuration and user management
    ├── email.ts              # Email service using Resend
    └── resources.ts          # Resource data and helper functions
```

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js v5 (Auth.js) - *Note: Uses beta version for Next.js 16 compatibility*
- **Email**: Resend (optional)
- **Deployment**: Vercel (recommended)

### ⚠️ Important Notes

- **In-Memory Storage**: The current authentication uses in-memory storage for users. This is for demonstration purposes only. In production, connect to a real database (see "Connecting to a Database" section below).
- **NextAuth.js Beta**: This project uses NextAuth.js v5 beta (`next-auth@5.0.0-beta.25`) for compatibility with Next.js 16. Monitor the [Auth.js releases](https://github.com/nextauthjs/next-auth/releases) for stable versions.

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Environment Variables

Copy the setup template and update it for your local environment:

```bash
cp .env.example .env.local
```

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin access (required)
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
ADMIN_EMAIL=your-email@example.com

# Local app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional canonical/base URL for sitemap + robots in production
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Recommended for production API protection
# API_SECRET_KEY=generate-with-openssl-rand-base64-32

# Optional: Email service (Resend)
# If not set, emails will be logged to console instead
# RESEND_API_KEY=re_your_api_key
# EMAIL_FROM=MopLX <noreply@yourdomain.com>

# Optional fallback used by email helpers
# NEXTAUTH_URL=http://localhost:3000
```

### Generating an API Secret

```bash
# Generate a random secret for API_SECRET_KEY
openssl rand -base64 32
```

## ▲ Deploying to Vercel

This project is ready to deploy to Vercel without extra platform configuration.

1. Push the repository to GitHub.
2. In Vercel, click **Add New → Project** and import `yankeeDamn/MopLX`.
3. Let Vercel detect the app as a **Next.js** project.
4. **Add Environment Variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` (required) - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required) - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` (required) - Your Supabase service role key
   - `NEXT_PUBLIC_ADMIN_EMAIL` (required) - Email address allowed into `/admin`
   - `ADMIN_EMAIL` (required) - Same admin email for middleware checks
   - `NEXT_PUBLIC_APP_URL` (required) - Your production URL (for links and sharing)
   - `NEXT_PUBLIC_BASE_URL` (optional) - Canonical base URL for sitemap/robots
   - `API_SECRET_KEY` (recommended) - Protects article creation in production
   - `RESEND_API_KEY` (optional) - For email verification
   - `EMAIL_FROM` (optional) - Sender email address
   - `NEXTAUTH_URL` (optional) - Fallback URL used by email helpers
5. Deploy.

### Why the default setup works

- The app uses **Next.js 16** with the App Router.
- `next.config.ts` uses the default Next.js configuration.
- No `vercel.json` file is required for the current setup.
- All API routes run on Vercel serverless functions.

### Custom domain

1. Open **Project Settings → Domains** in Vercel.
2. Add your domain.
3. Update your DNS records using the values Vercel provides.

## 📧 Newsletter Integration

The `/api/subscribe` endpoint is ready to integrate with your preferred email service. Simply update the API route to connect with:

- **Mailchimp** - Popular email marketing platform
- **ConvertKit** - Creator-focused email platform
- **Resend** - Developer-first email API
- **SendGrid** - Scalable email delivery

## 📝 Connecting a Backend & Posting Articles

### Fastest ways to add new content

There are three supported paths, depending on how you are running MopLX:

1. If Supabase is configured, sign in as your admin user and open `/admin` to create, edit, or delete resources in the `resources` table.
2. If you want static content checked into the repo, add a new object in `src/lib/resources.ts`.
3. If you want to automate publishing, `POST` to `/api/articles` during local development or from another system.

### Which source the site uses

- If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, the resources pages read from the Supabase `resources` table.
- If Supabase is not configured or the query fails, the site falls back to the hardcoded content in `src/lib/resources.ts`.
- The `/api/articles` endpoint only appends to the in-memory array for the current server process, so it is useful for demos but not durable storage.

### How the Backend Works

MopLX includes a built-in REST API for managing articles. The API routes are located in `src/app/api/` and run as Next.js API route handlers (serverless functions on Vercel).

**Current API endpoints:**

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/api/articles`   | List all articles              |
| POST   | `/api/articles`   | Create a new article           |
| POST   | `/api/subscribe`  | Subscribe to the newsletter    |

### Posting Articles via the API

Send a `POST` request to `/api/articles` with a JSON body:

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-new-article",
    "title": "My New Article Title",
    "description": "A brief description of the article",
    "category": "Kubernetes",
    "type": "free",
    "content": "## Article Content\n\nYour markdown content here...",
    "readTime": "8 min read"
  }'
```

**Required fields:**

| Field         | Type               | Description                               |
| ------------- | ------------------ | ----------------------------------------- |
| `slug`        | `string`           | URL-friendly unique identifier            |
| `title`       | `string`           | Article title                             |
| `description` | `string`           | Short description / summary               |
| `category`    | `string`           | Category (e.g., Kubernetes, CI/CD, Cloud) |
| `type`        | `"free" \| "paid"` | Whether the article is free or premium    |
| `content`     | `string`           | Full article content (markdown)           |

**Optional fields:**

| Field         | Type     | Description                                           |
| ------------- | -------- | ----------------------------------------------------- |
| `image`       | `string` | Image path (defaults to `/images/default.svg`)        |
| `publishedAt` | `string` | Publish date in `YYYY-MM-DD` format (defaults to today) |
| `readTime`    | `string` | Estimated read time (defaults to `"5 min read"`)      |
| `price`       | `number` | Price in USD (required when `type` is `"paid"`)       |

**Example response:**

```json
{
  "message": "Article created successfully.",
  "article": {
    "slug": "my-new-article",
    "title": "My New Article Title",
    "description": "A brief description of the article",
    "category": "Kubernetes",
    "type": "free",
    "image": "/images/default.svg",
    "content": "## Article Content\n\nYour markdown content here...",
    "publishedAt": "2026-04-20",
    "readTime": "8 min read"
  }
}
```

### Adding Articles Directly in Code

You can also add articles directly by editing `src/lib/resources.ts`:

```typescript
{
  slug: "your-resource-slug",
  title: "Your Resource Title",
  description: "Description here",
  category: "Category",
  type: "free" | "paid",
  image: "/images/resource.svg",
  content: "Markdown-like content...",
  publishedAt: "2024-01-01",
  readTime: "10 min read",
  price: 49, // only for paid resources
}
```

After adding an entry there:

1. Ensure `slug` is unique.
2. Keep `publishedAt` in `YYYY-MM-DD` format so sorting works correctly.
3. Use `type: "paid"` only when you also provide `price`.
4. Restart the dev server if the module cache does not refresh immediately.

### Managing content through the admin UI

If Supabase is set up, MopLX already includes an admin screen at `/admin`.

To use it:

1. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Set `NEXT_PUBLIC_ADMIN_EMAIL` to the email address allowed to manage resources.
3. Sign up or sign in with that email.
4. Open `/admin` and use the resource form to create or update entries.

The admin UI writes directly to the `resources` table, which is the cleanest way to manage content in production.

### Connecting to a Database (Production)

The current backend stores articles **in-memory**, which means they reset on server restart. To persist articles in production, connect to a database:

1. **Install a database client** (e.g., Prisma, Drizzle, or Mongoose):
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Define your Article model** in `prisma/schema.prisma`:
   ```prisma
   model Article {
     id          String   @id @default(cuid())
     slug        String   @unique
     title       String
     description String
     category    String
     type        String
     image       String   @default("/images/default.svg")
     content     String
     publishedAt DateTime @default(now())
     readTime    String   @default("5 min read")
     price       Float?
   }
   ```

3. **Update the API routes** in `src/app/api/articles/route.ts` to use Prisma instead of the in-memory array.

4. **Set the `DATABASE_URL`** environment variable in Vercel or your `.env` file.

5. **Run migrations** and redeploy:
   ```bash
   npx prisma migrate dev
   npm run build
   ```

### Authentication (Optional)

To protect the `POST /api/articles` endpoint, add API key authentication:

1. Set an `API_SECRET_KEY` environment variable in Vercel.
2. Check the `Authorization` header in the API route:
   ```typescript
   const authHeader = request.headers.get("Authorization");
   if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
   }
   ```
3. Include the key when posting articles:
   ```bash
   curl -X POST http://localhost:3000/api/articles \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{ ... }'
   ```

## 📞 Contact

- **Email**: [contact@moplx.com](mailto:contact@moplx.com)
- **Twitter/X**: [@moplx](https://twitter.com/moplx)
- **GitHub**: [yankeeDamn/MopLX](https://github.com/yankeeDamn/MopLX)

## 🎨 Customization

- Update colors in `src/app/globals.css` CSS variables
- Modify resources in `src/lib/resources.ts`
- Update branding/logos in components
- Add your own content and categories

## 📄 License

MIT
