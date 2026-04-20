# LearnXOps - Newsletter & Learning Platform

A modern newsletter and learning platform for DevOps, Cloud, and Infrastructure engineers. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Newsletter Subscription**: Email subscription with API integration ready for services like Mailchimp, ConvertKit, or Resend
- **Free Learning Resources**: Tutorials and guides on Kubernetes, CI/CD, Terraform, Monitoring, and more
- **Premium Courses**: Paid deep-dive courses with gated content
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Automatic dark mode based on system preference
- **SEO Optimized**: Meta tags, structured content, and semantic HTML

## 📁 Architecture

```
src/
├── app/
│   ├── api/
│   │   └── subscribe/     # Newsletter subscription API endpoint
│   │       └── route.ts
│   ├── resources/
│   │   ├── [slug]/         # Individual resource pages (dynamic routes)
│   │   │   └── page.tsx
│   │   └── page.tsx        # Resources listing page
│   ├── pricing/
│   │   └── page.tsx        # Pricing plans page
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   └── page.tsx            # Landing page (Hero + Features + Resources)
├── components/
│   ├── Navbar.tsx          # Navigation with mobile menu
│   ├── Footer.tsx          # Footer with links and social
│   ├── Hero.tsx            # Hero section with CTA
│   ├── Features.tsx        # Feature cards section
│   ├── FeaturedResources.tsx  # Resource preview section
│   ├── ResourceCard.tsx    # Resource card component
│   └── NewsletterForm.tsx  # Newsletter subscription form
└── lib/
    └── resources.ts        # Resource data and helper functions
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
- The `/api/subscribe` route can run on Vercel as-is.

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

## 🎨 Customization

- Update colors in `src/app/globals.css` CSS variables
- Modify resources in `src/lib/resources.ts`
- Update branding/logos in components
- Add your own content and categories

## 📝 Adding New Resources

Add entries to the `resources` array in `src/lib/resources.ts`:

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

## 📄 License

MIT
