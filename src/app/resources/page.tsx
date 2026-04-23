import { createSupabaseServerClient } from "@/lib/supabase/server";
import ResourceCard from "@/components/ResourceCard";
import Link from "next/link";
import type { Metadata } from "next";
import type { Resource } from "@/types/database";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources - MopLX",
  description:
    "Browse our collection of free and premium DevOps learning resources including tutorials on Kubernetes, CI/CD, Terraform, and more.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory } = await searchParams;

  let resources: ResourceWithFallback[];

  // Try to fetch from Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: allResources, error } = await supabase
        .from("resources")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && allResources) {
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

  // Extract unique categories
  const categories = Array.from(new Set(resources.map((r) => r.category))).sort();

  // Filter by active category
  const filtered = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : resources;

  const freeResources = filtered.filter((r) => r.type === "free");
  const paidResources = filtered.filter((r) => r.type === "paid");

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950">
            Learning Resources
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            Explore our collection of tutorials, courses, and guides. From
            beginner to advanced, we have something for every stage of your
            DevOps journey.
          </p>
        </div>

        {/* Category filter bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <Link
            href="/resources"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? "bg-stone-950 text-white"
                : "border border-stone-200 bg-white text-stone-700 hover:border-stone-950 hover:text-stone-950"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/resources?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-stone-950 text-white"
                  : "border border-stone-200 bg-white text-stone-700 hover:border-stone-950 hover:text-stone-950"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {freeResources.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-stone-950">Free Resources</h2>
              <span className="ml-3 bg-stone-100 text-stone-700 text-sm font-medium px-3 py-1 rounded-full">
                {freeResources.length} available
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {paidResources.length > 0 && (
          <div>
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-stone-950">Premium Courses</h2>
              <span className="ml-3 bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full">
                {paidResources.length} courses
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paidResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {freeResources.length === 0 && paidResources.length === 0 && (
          <p className="text-center text-stone-500 py-16">No resources found for this category.</p>
        )}
      </div>
    </div>
  );
}
