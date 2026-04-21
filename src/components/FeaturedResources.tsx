import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Resource } from "@/types/database";
import ResourceCard from "./ResourceCard";
import { resources as fallbackResources } from "@/lib/resources";

// Extended type to handle both Supabase and fallback resource formats
type ResourceWithFallback = Resource | {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "free" | "paid";
  image: string;
  content: string;
  publishedAt: string;
  readTime: string;
  price?: number;
};

export default async function FeaturedResources() {
  let resources: ResourceWithFallback[];

  // Try to fetch from Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: allResources } = await supabase
        .from("resources")
        .select("*")
        .order("published_at", { ascending: false });

      if (allResources) {
        resources = (allResources as Resource[]).map(r => ({
          ...r,
          publishedAt: r.published_at, // Convert snake_case to camelCase for compatibility
          readTime: r.read_time,
        }));
      } else {
        resources = fallbackResources;
      }
    } catch (error) {
      console.error("Supabase error, falling back to static resources:", error);
      resources = fallbackResources;
    }
  } else {
    resources = fallbackResources;
  }

  const sortedResources = [...resources].sort((left, right) => {
    const leftDate = "publishedAt" in left ? left.publishedAt : left.published_at;
    const rightDate = "publishedAt" in right ? right.publishedAt : right.published_at;

    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

  const highlightedResources = sortedResources.slice(0, 4);
  const freeResources = sortedResources.filter((r) => r.type === "free");
  const paidResources = sortedResources.filter((r) => r.type === "paid");

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col gap-4 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Get started with the best stories
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Featured stories and premium handbooks.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 sm:mx-0">
                The home page now leads with recent content, the same way LearnXops prioritizes articles over generic feature slabs.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
            >
              View all resources
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {highlightedResources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-green-200 bg-green-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Free library</p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-950">Open resources for readers who just joined.</h3>
            <p className="mt-3 text-stone-600">
              {freeResources.length} free tutorials, walkthroughs, and references are already available in the catalog.
            </p>
            <Link
              href="/resources"
              className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
            >
              Explore free content
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Premium track</p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-950">Deep dives and paid handbooks for advanced readers.</h3>
            <p className="mt-3 text-stone-600">
              {paidResources.length} premium resources are positioned as the next step after readers sample the free material.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center text-sm font-semibold text-amber-700 transition-colors hover:text-amber-800"
            >
              See premium options
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
