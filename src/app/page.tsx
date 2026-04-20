import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedResources from "@/components/FeaturedResources";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedResources />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Level Up Your DevOps Skills?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of DevOps engineers who receive our weekly newsletter
            packed with tutorials, tips, and industry insights.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                10,000+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Newsletter Subscribers
              </div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                50+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                In-depth Tutorials
              </div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                100%
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                Practical & Hands-on
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
