import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
}

const features: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    badge: "Instant",
    title: "Match Score Analysis",
    desc: "AI evaluates your resume against the job requirements and gives you a precise 0–100 compatibility score with clear reasoning.",
    bullets: ["Keyword & skill alignment", "Experience level check", "Gap prioritisation"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    badge: "Role-specific",
    title: "Tailored Interview Prep",
    desc: "Receive 5–15 technical and behavioural questions specific to your exact role, with expert-modelled answers and interviewer intent explained.",
    bullets: ["Technical deep-dives", "Behavioural STAR answers", "Why the interviewer asks"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    badge: "ATS-friendly",
    title: "AI Resume Builder",
    desc: "Download a beautifully formatted, ATS-optimised resume tailored to the specific role — generated and exported as a polished PDF in one click.",
    bullets: ["Inline-styled HTML → PDF", "ATS keyword coverage", "1–2 page concise format"],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-950 py-24 border-t border-gray-800/60">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            What you get
          </p>
          <h2
            className="text-4xl sm:text-5xl font-normal text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Everything to win
            <span className="text-indigo-300"> your next role</span>
          </h2>
          <p className="max-w-lg mx-auto text-base text-gray-400 leading-relaxed">
            One upload. One job description. A complete personalised package built in seconds.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="feat-card rounded-2xl p-7 flex flex-col gap-5 bg-gray-900 border border-gray-800"
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600/10 text-indigo-400">
                  {f.icon}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {f.badge}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>

              {/* Bullet list */}
              <ul className="space-y-2 mt-auto pt-4 border-t border-gray-800">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-none" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
