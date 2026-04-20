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

-- ─── SUPABASE AUTH CONFIGURATION ─────────────────────────────
-- In Supabase Dashboard → Authentication → Settings:
--   • Enable "Email" provider
--   • Enable "Confirm email" (sends verification email)
--   • Set Site URL to: https://mop-lx.vercel.app
--   • Add redirect URL:  https://mop-lx.vercel.app/api/auth/callback
--   • For local dev add: http://localhost:3000/api/auth/callback
