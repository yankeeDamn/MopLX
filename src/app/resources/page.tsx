import { resources } from "@/lib/resources";
import ResourceCard from "@/components/ResourceCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources - LearnXOps",
  description:
    "Browse our collection of free and premium DevOps learning resources including tutorials on Kubernetes, CI/CD, Terraform, and more.",
};

export default function ResourcesPage() {
  const freeResources = resources.filter((r) => r.type === "free");
  const paidResources = resources.filter((r) => r.type === "paid");

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Learning Resources
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our collection of tutorials, courses, and guides. From
            beginner to advanced, we have something for every stage of your
            DevOps journey.
          </p>
        </div>

        {/* Free Resources */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Free Resources
            </h2>
            <span className="ml-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium px-3 py-1 rounded-full">
              {freeResources.length} available
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeResources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>

        {/* Premium Resources */}
        <div>
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Premium Courses
            </h2>
            <span className="ml-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium px-3 py-1 rounded-full">
              {paidResources.length} courses
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paidResources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
