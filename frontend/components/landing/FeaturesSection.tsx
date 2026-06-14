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
    desc: "Download a beautifully formatted, ATS-optimised resume tailored to the specific role — with tone and length customisation, exported as a polished PDF.",
    bullets: ["Inline-styled HTML → PDF", "Tone & length customisation", "ATS keyword coverage"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
    badge: "Interactive",
    title: "Mock Interview Chat",
    desc: "Turn your report into a live practice session. Chat with an AI interviewer that asks follow-up questions and gives real-time feedback on your answers.",
    bullets: ["Context-aware follow-ups", "Real-time answer feedback", "Built on your report's questions"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    badge: "One-click",
    title: "Cover Letter Generator",
    desc: "Generate a compelling, role-specific cover letter directly from your interview report — with customisable tone and length to match every application.",
    bullets: ["Tied to your match analysis", "Formal, friendly, or concise tone", "Copy or download instantly"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
    badge: "Shareable",
    title: "Report Sharing",
    desc: "Share your interview report with mentors, coaches, or recruiters via a secure public link — no login required for the recipient.",
    bullets: ["Unique share token per report", "Read-only public view", "No sign-up needed for viewers"],
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
            One upload. One job description. A complete personalised package — interview prep, resume, cover letter, and live practice.
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
