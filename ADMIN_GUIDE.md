# MopLX Admin Dashboard - Complete Guide

This guide covers all the new features added to the MopLX admin dashboard, including media management, analytics tracking, social media sharing, and more.

## 🎯 Overview

The enhanced admin dashboard provides a complete content management system for your newsletter with:

- ✅ **Rich Content Editor** - Create and edit articles with markdown support
- 📸 **Media Management** - Upload and manage images and videos
- 📊 **Analytics Dashboard** - Track views, shares, and engagement
- 🔄 **Social Media Integration** - Share directly to Facebook, LinkedIn, Twitter, Reddit
- 🔍 **Search & Filtering** - Find articles quickly with advanced filters
- 📦 **Bulk Operations** - Manage multiple articles at once
- 👁️ **Preview Mode** - Preview articles before publishing
- 🎨 **Multiple View Modes** - List, Grid, and Analytics views

## 🗄️ Database Schema

### New Tables

#### 1. **resources** (Enhanced)
Enhanced with new fields:
- `is_published` - Control article visibility
- `author_email` - Track article authors
- `featured` - Mark articles as featured
- `views` - Track total views

#### 2. **media**
Store uploaded images and videos:
```sql
CREATE TABLE media (
  id uuid PRIMARY KEY,
  resource_id uuid REFERENCES resources(id),
  url text NOT NULL,
  type text CHECK (type IN ('image', 'video')),
  filename text NOT NULL,
  size_bytes bigint,
  mime_type text,
  created_at timestamptz DEFAULT now()
);
```

#### 3. **admin_users**
Manage admin permissions:
```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at timestamptz DEFAULT now()
);
```

#### 4. **analytics**
Track engagement metrics:
```sql
CREATE TABLE analytics (
  id uuid PRIMARY KEY,
  resource_id uuid REFERENCES resources(id),
  event_type text CHECK (event_type IN ('view', 'share', 'click')),
  platform text,
  created_at timestamptz DEFAULT now()
);
```

## 🚀 Getting Started

### 1. Set Up Supabase

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Run the schema from `supabase/schema.sql` in the SQL Editor
3. Create two storage buckets:
   - `images` (for image uploads)
   - `videos` (for video uploads)
4. Make both buckets public

### 2. Configure Environment Variables

Add these to your `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Access (Required)
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
ADMIN_EMAIL=your-admin@email.com

# App URL (Required for social sharing)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL

# Optional: For production security
API_SECRET_KEY=your-secure-random-key
```

### 3. Install Dependencies

All dependencies are already in `package.json`. Just run:

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## 📱 Admin Dashboard Features

### Accessing the Dashboard

1. Navigate to `/admin`
2. Sign in with the email specified in `NEXT_PUBLIC_ADMIN_EMAIL`
3. The dashboard will load with all features

### Dashboard Views

#### 1. **List View** (Default)
- See all articles in a compact list
- Quick access to edit, delete, and share
- Select multiple articles for bulk actions
- Social sharing buttons for each article

#### 2. **Grid View**
- Visual card-based layout
- Perfect for browsing article thumbnails
- Easy to scan titles and descriptions

#### 3. **Analytics View**
- View engagement metrics per article
- Track views, total shares, and platform-specific shares
- See Facebook, LinkedIn, and Twitter share counts

### Creating Articles

1. Click **"+ New Article"** button
2. Fill in the required fields:
   - **Title** - Article headline
   - **Slug** - URL-friendly identifier (auto-generates from title)
   - **Category** - Article category (e.g., "Kubernetes", "CI/CD")
   - **Type** - Free or Paid
   - **Description** - Short summary
   - **Content** - Full article in Markdown format

3. Optional fields:
   - **Image URL** - Featured image (or upload one)
   - **Read Time** - Estimated reading time
   - **Published Date** - When to show the article as published
   - **Price** - For paid articles only
   - **Published** - Toggle to publish/unpublish
   - **Featured** - Mark as featured content

4. Click **"Create Article"** or **"Update Article"**

### Media Upload

#### Uploading Images/Videos

1. In the article editor, find the "Image URL" field
2. Click **"Upload Image"** button
3. Select a file (max 10MB for images, 50MB for videos)
4. The URL will automatically populate in the image field
5. Use this URL in your article content as well

#### Supported Formats

**Images:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

**Videos:**
- MP4 (.mp4)
- WebM (.webm)
- OGG (.ogg)

### Preview Mode

1. While editing an article, click **"Preview"**
2. See how the article will look to readers
3. Click **"Edit"** to return to editing

### Search & Filtering

#### Search
Type in the search box to find articles by:
- Title
- Description
- Category
- Slug

#### Filters
Use the dropdown to filter by:
- **All Articles** - Show everything
- **Published** - Only published articles
- **Drafts** - Only unpublished articles
- **Free** - Only free content
- **Paid** - Only premium content

### Bulk Operations

1. **Select Articles**: Check boxes next to articles or click "Select All"
2. **Choose Action**:
   - **Publish** - Make selected articles public
   - **Unpublish** - Convert to drafts
   - **Delete** - Remove permanently (with confirmation)
3. **Clear** - Deselect all

## 📊 Analytics

### Automatic View Tracking

Views are automatically tracked when users visit article pages. No setup required!

### Share Tracking

Every time someone clicks a share button, the platform is recorded:
- Facebook shares
- LinkedIn shares
- Twitter shares
- Reddit shares
- Link copies

### Viewing Analytics

1. Switch to **Analytics View** in the dashboard
2. See metrics for each article:
   - Total views
   - Total shares
   - Platform-specific share counts

### API Access

Get analytics programmatically:

```bash
# Get stats for a specific article
curl "http://localhost:3000/api/analytics?resource_id=ARTICLE_ID&stats=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get raw analytics data
curl "http://localhost:3000/api/analytics?resource_id=ARTICLE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔗 Social Media Sharing

### Automatic Integration

Share buttons appear:
- On each article detail page
- In the admin dashboard list view
- When users click share

### Supported Platforms

1. **Facebook** - Opens Facebook share dialog
2. **LinkedIn** - Opens LinkedIn share dialog
3. **Twitter/X** - Pre-fills tweet with title and link
4. **Reddit** - Opens Reddit submit page
5. **Copy Link** - Copies URL to clipboard
6. **Native Share** - Uses device share menu (mobile)

### Customizing Share Content

Articles automatically include:
- **Title** - Used as share headline
- **Description** - Used as share text
- **URL** - Full link to article
- **Open Graph tags** - For rich previews

### Adding Share Buttons to Custom Pages

```tsx
import ShareButtons from "@/components/ShareButtons";

<ShareButtons
  url="https://yoursite.com/article"
  title="Article Title"
  description="Article description"
  resourceId="optional-resource-id"
/>
```

## 🔒 Security & Permissions

### Admin Access Control

Only users with the email specified in `NEXT_PUBLIC_ADMIN_EMAIL` can:
- Access `/admin` dashboard
- Create, edit, delete articles
- Upload media files
- View analytics

### API Protection

The media upload and analytics APIs are protected:
- Require authentication via Supabase
- Only authenticated users can upload/delete media
- Only authenticated users can view detailed analytics

### Row Level Security (RLS)

Supabase RLS policies ensure:
- Anyone can read published resources
- Only authenticated users can modify data
- Admin operations bypass RLS using service role key

## 📡 API Reference

### Media API

#### Upload Media
```bash
POST /api/media
Content-Type: multipart/form-data

# Form fields:
# - file: The file to upload
# - resource_id: (optional) Link to a resource
```

#### List Media
```bash
GET /api/media?resource_id=RESOURCE_ID
```

#### Delete Media
```bash
DELETE /api/media?id=MEDIA_ID
```

### Analytics API

#### Track Event
```bash
POST /api/analytics
Content-Type: application/json

{
  "resource_id": "uuid",
  "event_type": "view" | "share" | "click",
  "platform": "facebook" | "linkedin" | "twitter" | etc
}
```

#### Get Analytics
```bash
GET /api/analytics?resource_id=RESOURCE_ID&stats=true
```

### Articles API

#### List Articles
```bash
GET /api/articles
```

#### Create Article
```bash
POST /api/articles
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY  # If API_SECRET_KEY is set

{
  "slug": "my-article",
  "title": "My Article",
  "description": "Article description",
  "category": "DevOps",
  "type": "free",
  "content": "# Article content in markdown",
  "readTime": "10 min read"
}
```

## 🎨 Customization

### Styling

The dashboard uses Tailwind CSS. Customize colors in:
- `src/app/globals.css` for global styles
- Component classes for specific elements

### Adding Custom Fields

1. Update the database schema in `supabase/schema.sql`
2. Update TypeScript types in `src/types/database.ts`
3. Update the form in `EnhancedAdminDashboard.tsx`

### Custom Analytics Events

Track custom events:

```typescript
await fetch("/api/analytics", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    resource_id: "article-id",
    event_type: "click",
    platform: "custom-button"
  })
});
```

## 🐛 Troubleshooting

### Media Upload Fails

1. Check Supabase storage buckets are created
2. Verify buckets are set to public
3. Check file size limits (10MB images, 50MB videos)
4. Ensure user is authenticated

### Analytics Not Showing

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is set
2. Check database functions are created
3. Ensure analytics table exists
4. Try refreshing the page

### Social Sharing Not Working

1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. Check that resource IDs are being passed
3. Ensure URLs are publicly accessible

### Admin Access Denied

1. Verify `NEXT_PUBLIC_ADMIN_EMAIL` matches your login email
2. Check that you're signed in
3. Clear browser cache and cookies
4. Check middleware configuration

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Database schema is applied in production Supabase
- [ ] Storage buckets created and configured
- [ ] Environment variables set in Vercel/hosting platform
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Admin email configured
- [ ] API secret key set (optional but recommended)

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment

1. Test admin dashboard access
2. Create a test article
3. Upload a test image
4. Verify social sharing works
5. Check analytics tracking

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## 💡 Best Practices

1. **Content**:
   - Write clear, descriptive titles
   - Use consistent categories
   - Add featured images for better engagement
   - Include social share descriptions

2. **SEO**:
   - Use descriptive slugs
   - Write compelling descriptions
   - Add relevant categories
   - Keep content fresh and updated

3. **Performance**:
   - Optimize images before uploading
   - Use WebP format when possible
   - Keep video files under 50MB
   - Cache static assets

4. **Security**:
   - Never share service role keys
   - Use environment variables for secrets
   - Enable RLS on all tables
   - Regularly review admin access

## 🤝 Support

For issues or questions:
- Check the troubleshooting section above
- Review the [main README](../README.md)
- Open an issue on GitHub
- Contact the team

---

**Built with ❤️ for modern newsletter creators**
