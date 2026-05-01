-- ============================================================
--  MopLX — Supabase Schema + RLS Policies
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── RESOURCES TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resources (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text        UNIQUE NOT NULL,
  title        text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  category     text        NOT NULL DEFAULT '',
  type         text        NOT NULL DEFAULT 'free' CHECK (type IN ('free', 'paid')),
  image        text        NOT NULL DEFAULT '',
  content      text        NOT NULL DEFAULT '',
  published_at date        NOT NULL DEFAULT CURRENT_DATE,
  read_time    text        NOT NULL DEFAULT '5 min read',
  price        numeric,
  is_published boolean     NOT NULL DEFAULT true,
  author_email text,
  featured     boolean     NOT NULL DEFAULT false,
  views        bigint      NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resources_updated_at ON public.resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read resources (public site)
CREATE POLICY "Public read access"
  ON public.resources
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete
-- (The admin page uses the service_role key which bypasses RLS,
--  so this policy is a safety net for direct DB calls via anon key)
CREATE POLICY "Authenticated users can insert"
  ON public.resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update"
  ON public.resources
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete"
  ON public.resources
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources (slug);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources (category);
CREATE INDEX IF NOT EXISTS idx_resources_published ON public.resources (is_published);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON public.resources (featured);
CREATE INDEX IF NOT EXISTS idx_resources_published_at ON public.resources (published_at DESC);

-- ─── MEDIA TABLE ───────────────────────────────────────────
-- Store uploaded images and videos linked to resources
CREATE TABLE IF NOT EXISTS public.media (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id  uuid        REFERENCES public.resources(id) ON DELETE CASCADE,
  url          text        NOT NULL,
  type         text        NOT NULL CHECK (type IN ('image', 'video')),
  filename     text        NOT NULL,
  size_bytes   bigint,
  mime_type    text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_resource_id ON public.media (resource_id);

-- RLS for media
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media"
  ON public.media
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
  ON public.media
  FOR DELETE
  TO authenticated
  USING (true);

-- ─── ADMIN USERS TABLE ───────────────────────────────────────
-- Track admin users for authorization
CREATE TABLE IF NOT EXISTS public.admin_users (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text        UNIQUE NOT NULL,
  role         text        NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index for fast email lookup
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

-- RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- ─── ANALYTICS TABLE ─────────────────────────────────────────
-- Track article views, shares, and engagement
CREATE TABLE IF NOT EXISTS public.analytics (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id  uuid        NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  event_type   text        NOT NULL CHECK (event_type IN ('view', 'share', 'click')),
  platform     text,       -- For shares: 'facebook', 'linkedin', 'twitter', etc.
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_resource_id ON public.analytics (resource_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics (created_at);

-- RLS for analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert analytics"
  ON public.analytics
  FOR INSERT
  USING (true);

CREATE POLICY "Authenticated users can read analytics"
  ON public.analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- ─── HELPER FUNCTIONS ────────────────────────────────────────
-- Function to get article statistics
CREATE OR REPLACE FUNCTION public.get_resource_stats(resource_uuid uuid)
RETURNS TABLE (
  views_count bigint,
  shares_count bigint,
  facebook_shares bigint,
  linkedin_shares bigint,
  twitter_shares bigint
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'view') AS views_count,
    COUNT(*) FILTER (WHERE event_type = 'share') AS shares_count,
    COUNT(*) FILTER (WHERE event_type = 'share' AND platform = 'facebook') AS facebook_shares,
    COUNT(*) FILTER (WHERE event_type = 'share' AND platform = 'linkedin') AS linkedin_shares,
    COUNT(*) FILTER (WHERE event_type = 'share' AND platform = 'twitter') AS twitter_shares
  FROM public.analytics
  WHERE resource_id = resource_uuid;
END;
$$;

-- Function to increment views counter
CREATE OR REPLACE FUNCTION public.increment_views(resource_uuid uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.resources
  SET views = views + 1
  WHERE id = resource_uuid;
END;
$$;

-- ─── SUPABASE AUTH CONFIGURATION ─────────────────────────────
-- In Supabase Dashboard → Authentication → Settings:
--   • Enable "Email" provider
--   • Enable "Confirm email" (sends verification email)
--   • Set Site URL to: https://mop-lx.vercel.app
--   • Add redirect URL:  https://mop-lx.vercel.app/api/auth/callback
--   • For local dev add: http://localhost:3000/api/auth/callback
