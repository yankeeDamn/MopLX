import Link from "next/link";
import type { Resource } from "@/types/database";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center relative">
        <div className="text-4xl font-bold text-indigo-300 dark:text-indigo-600">
          {resource.category}
        </div>
        {resource.type === "paid" && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PRO
          </span>
        )}
        {resource.type === "free" && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            FREE
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
            {resource.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {resource.read_time || (resource as any).readTime}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {resource.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          {resource.type === "paid" ? (
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${(resource as any).price || resource.price}
            </span>
          ) : (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Free Access
            </span>
          )}
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {resource.type === "paid" ? "Learn More" : "Read Now"}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
