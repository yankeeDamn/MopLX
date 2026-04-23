import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedResources from "@/components/FeaturedResources";
import Link from "next/link";

export default function Home() {
  const steps = [
    {
      title: "Join the newsletter",
      description: "Readers subscribe once and get the weekly briefing plus product and content updates.",
    },
    {
      title: "Read the latest stories",
      description: "The front page highlights fresh tutorials, handbooks, and opinionated operator notes.",
    },
    {
      title: "Go deeper when ready",
      description: "Premium resources remain available as the next step without overwhelming the main navigation.",
    },
  ];

  return (
    <>
      <Hero />
      <Features />
      <FeaturedResources />

      <section className="bg-[#f2ede4] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Publishing flow</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                A simpler front door for the whole site.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-stone-600">
                Instead of asking visitors to choose between sign in and sign up immediately, the site now guides them toward one clear action: Join. That keeps the homepage focused on the one thing that matters: getting you to great content fast.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-amber-700">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-stone-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.25rem] bg-stone-950 px-8 py-14 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-300">Join MopLX</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Replace account friction with one clear invitation.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-300">
            Visitors can still sign in when they need to, but the main experience now behaves like a modern learning publication with a single Join CTA.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-stone-100"
            >
              Join now
            </Link>
            <Link
              href="/resources"
              className="rounded-full border border-stone-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-stone-300"
            >
              Explore resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
