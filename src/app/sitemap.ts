import type { MetadataRoute } from "next";
import { resources } from "@/lib/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mop-lx.vercel.app";

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
