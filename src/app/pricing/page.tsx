import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - MopLX",
  description:
    "Choose the plan that fits your learning goals. Free newsletter or premium access to all courses and resources.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with DevOps learning",
      features: [
        "Weekly newsletter delivery",
        "Access to free tutorials & guides",
        "Community forum access",
        "Monthly webinar invites",
        "Email support",
      ],
      cta: "Subscribe Free",
      ctaLink: "#subscribe",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious learners who want to accelerate their career",
      features: [
        "Everything in Free",
        "All premium courses included",
        "Hands-on lab environments",
        "Certificate of completion",
        "Priority email support",
        "Exclusive Slack community",
        "Monthly 1-on-1 office hours",
        "Early access to new content",
      ],
      cta: "Join the waitlist",
      ctaLink: "mailto:contact@moplx.com?subject=Pro%20Plan%20Interest",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "Best for teams looking to upskill together",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Team progress dashboard",
        "Custom learning paths",
        "Dedicated account manager",
        "Invoice billing",
        "SSO integration",
        "Custom content requests",
      ],
      cta: "Contact Sales",
      ctaLink: "mailto:contact@moplx.com?subject=Team%20Plan%20Inquiry",
      highlighted: false,
    },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            Start free and upgrade when you&apos;re ready. No hidden fees, no long-term
            commitments. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-stone-950 text-white ring-4 ring-stone-300 scale-105"
                  : "bg-white border border-stone-200"
              }`}
            >
              {plan.highlighted && (
                <div className="text-sm font-medium text-stone-400 mb-4">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-xl font-semibold ${
                  plan.highlighted
                    ? "text-white"
                    : "text-stone-950"
                }`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlighted
                      ? "text-white"
                      : "text-stone-950"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-1 text-sm ${
                    plan.highlighted
                      ? "text-stone-400"
                      : "text-stone-500"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`mt-4 text-sm ${
                  plan.highlighted
                    ? "text-stone-300"
                    : "text-stone-600"
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        plan.highlighted
                          ? "text-amber-400"
                          : "text-amber-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={`text-sm ${
                        plan.highlighted
                          ? "text-stone-300"
                          : "text-stone-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink}
                className={`mt-8 block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-white text-stone-950 hover:bg-stone-100"
                    : "bg-stone-950 text-white hover:bg-stone-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-950 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-950">
                Can I switch plans later?
              </h3>
              <p className="mt-2 text-stone-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. When
                upgrading, you&apos;ll get immediate access to premium content.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-950">
                Is there a money-back guarantee?
              </h3>
              <p className="mt-2 text-stone-600 text-sm">
                Absolutely! We offer a 30-day money-back guarantee on all paid
                plans. If you&apos;re not satisfied, we&apos;ll refund your payment in
                full.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-950">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-stone-600 text-sm">
                We accept all major credit cards (Visa, MasterCard, American
                Express), PayPal, and bank transfers for Team plans.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-950">
                Do I get lifetime access to courses?
              </h3>
              <p className="mt-2 text-stone-600 text-sm">
                Pro and Team subscribers get access to all courses as long as
                their subscription is active. Individual course purchases grant
                lifetime access to that specific course.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscribe */}
        <div className="mt-20 text-center" id="subscribe">
          <h2 className="text-2xl font-bold text-stone-950 mb-4">
            Start with our Free Newsletter
          </h2>
          <p className="text-stone-600 mb-6">
            Get weekly DevOps content delivered to your inbox. Upgrade to Pro anytime.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
