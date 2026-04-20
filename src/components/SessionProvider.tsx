"use client";

// Supabase manages auth state via cookies and onAuthStateChange.
// No global provider wrapper is needed — each component calls
// createSupabaseBrowserClient() directly.
// This component is kept as a passthrough to avoid updating the layout.
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return <>{children}</>;
}
