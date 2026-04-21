export default function Features() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Weekly briefing",
      description:
        "A publication-style digest that keeps the front page focused on new stories, useful links, and operator-grade takeaways.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Story-first learning",
      description:
        "The home page surfaces featured articles and topic clusters instead of product marketing blocks, closer to LearnXops' structure.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Free and premium tracks",
      description:
        "Readers can start with open resources and move into premium handbooks and longer deep dives when they want more depth.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Single Join CTA",
      description:
        "The public nav now removes separate Sign In and Sign Up links in favor of a cleaner Join entry point for new readers.",
    },
  ];

  const topics = [
    "DevOps",
    "DevSecOps",
    "CloudOps",
    "MLOps",
    "AIOps",
    "Kubernetes",
    "CI/CD",
    "Observability",
  ];

  return (
    <section className="bg-[#f7f4ed] px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Built like a learning publication, not a SaaS landing page.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            The reference site leans into topic coverage, featured stories, and a single subscription path. These are the same shifts applied here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-stone-950">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-stone-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Topic coverage</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
