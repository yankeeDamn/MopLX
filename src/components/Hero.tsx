import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { resources } from "@/lib/resources";

export default function Hero() {
  const resourceCount = resources.length;
  const briefingPoints = [
    "One practical XOps briefing each week",
    "Free tutorials plus premium deep dives",
    "Real-world examples instead of generic theory",
  ];

  const topics = ["DevOps", "CloudOps", "Kubernetes", "CI/CD", "Terraform", "MLOps"];

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_32%),linear-gradient(180deg,_#fffaf1_0%,_#fff_55%,_#f7f4ed_100%)]" />
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-white/85 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
            A learning hub for modern XOps engineers
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            Learn DevOps, CloudOps, MLOps, and the rest of the XOps stack without the fluff.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
            MopLX is a publication-style learning hub for operators and builders who want sharp weekly briefings,
            practical tutorials, and premium deep dives they can actually apply.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Create account
            </Link>
            <Link
              href="/resources"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
            >
              Browse Stories
            </Link>
          </div>

          <div className="mt-8 max-w-xl" id="join">
            <p className="mb-3 text-sm font-medium text-stone-700">Get the free weekly briefing — no account required:</p>
            <NewsletterForm />
            <p className="mt-3 text-sm text-stone-500">
              Get the email newsletter and unlock access to new stories, guides, and member updates.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-[0_24px_80px_rgba(41,37,36,0.08)] backdrop-blur">
          <div className="rounded-[1.5rem] bg-stone-950 p-6 text-stone-50">
            <p className="text-sm uppercase tracking-[0.2em] text-stone-300">Inside the briefing</p>
            <ul className="mt-5 space-y-4">
              {briefingPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-stone-200">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-100 p-4">
              <p className="text-2xl font-semibold text-stone-950">{resourceCount}</p>
              <p className="mt-1 text-sm text-stone-600">resources available</p>
            </div>
            <div className="rounded-2xl bg-stone-100 p-4">
              <p className="text-2xl font-semibold text-stone-950">Free &amp; Pro</p>
              <p className="mt-1 text-sm text-stone-600">content tracks</p>
            </div>
            <div className="rounded-2xl bg-stone-100 p-4">
              <p className="text-2xl font-semibold text-stone-950">100%</p>
              <p className="mt-1 text-sm text-stone-600">practical use cases</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
