"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resources" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/80 bg-[rgba(255,252,246,0.92)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-stone-900">
              MopLX
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}

            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-stone-200" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-stone-500">{displayName}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-950"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/signup"
                className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
              >
                Join
              </Link>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-stone-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl px-4 py-2 text-stone-700 transition-colors hover:bg-stone-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="mt-2 border-t border-stone-200 px-4 pt-4 text-sm text-stone-500">
                  Signed in as {displayName}
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="block w-full rounded-2xl px-4 py-2 text-left text-stone-700 transition-colors hover:bg-stone-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/signup"
                className="block rounded-2xl bg-stone-950 px-4 py-3 text-center font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

