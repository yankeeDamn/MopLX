import type { MetadataRoute } from "next";
import { resources } from "@/lib/resources";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://mop-lx.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/resources`, lastModified: new Date() },
    { url: `${baseUrl}/pricing`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${baseUrl}/resources/${r.slug}`,
    lastModified: new Date(r.publishedAt),
  }));

  return [...staticPages, ...resourcePages];
}
