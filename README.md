# MopLX - Newsletter & Learning Platform

A modern newsletter and learning platform for DevOps, Cloud, and Infrastructure engineers. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Newsletter Subscription**: Email subscription with API integration ready for services like Mailchimp, ConvertKit, or Resend
- **Free Learning Resources**: Tutorials and guides on Kubernetes, CI/CD, Terraform, Monitoring, and more
- **Premium Courses**: Paid deep-dive courses with gated content
- **Articles API**: REST API to create and list articles programmatically
- **Contact Page**: Dedicated contact page with email, social media, and GitHub links
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Automatic dark mode based on system preference
- **SEO Optimized**: Meta tags, structured content, and semantic HTML

## 📁 Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── subscribe/        # Newsletter subscription API endpoint
│   │   │   └── route.ts
│   │   └── articles/         # Articles CRUD API endpoint
│   │       └── route.ts
│   ├── resources/
│   │   ├── [slug]/           # Individual resource pages (dynamic routes)
│   │   │   └── page.tsx
│   │   └── page.tsx          # Resources listing page
│   ├── pricing/
│   │   └── page.tsx          # Pricing plans page
│   ├── contact/
│   │   └── page.tsx          # Contact page with details
│   ├── globals.css           # Global styles and CSS variables
│   ├── layout.tsx            # Root layout with Navbar + Footer
│   └── page.tsx              # Landing page (Hero + Features + Resources)
├── components/
│   ├── Navbar.tsx            # Navigation with mobile menu
│   ├── Footer.tsx            # Footer with links, social, and contact
│   ├── Hero.tsx              # Hero section with CTA
│   ├── Features.tsx          # Feature cards section
│   ├── FeaturedResources.tsx # Resource preview section
│   ├── ResourceCard.tsx      # Resource card component
│   └── NewsletterForm.tsx    # Newsletter subscription form
└── lib/
    └── resources.ts          # Resource data and helper functions
```

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel (recommended)

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

## ▲ Deploying to Vercel

This project is ready to deploy to Vercel without extra platform configuration.

1. Push the repository to GitHub.
2. In Vercel, click **Add New → Project** and import `yankeeDamn/MopLX`.
3. Let Vercel detect the app as a **Next.js** project.
4. Keep the default settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output setting: Next.js default
5. Deploy.

### Why the default setup works

- The app uses **Next.js 16** with the App Router.
- `next.config.ts` uses the default Next.js configuration.
- No `vercel.json` file is required for the current setup.
- The `/api/subscribe` and `/api/articles` routes can run on Vercel as-is.

### Environment variables for newsletter providers

If you connect `/api/subscribe` to Mailchimp, ConvertKit, Resend, or another provider later:

1. Add the provider secrets in **Vercel → Project Settings → Environment Variables**.
2. Update `src/app/api/subscribe/route.ts` to read those variables.
3. Redeploy the project.

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
