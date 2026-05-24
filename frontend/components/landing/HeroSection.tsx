import Link from "next/link";

const ScoreRing = () => (
  <div className="relative flex-none">
    <svg viewBox="0 0 120 120" className="w-24 h-24 -rotate-90">
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="9"
      />
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="9"
        strokeLinecap="round"
        className="score-ring"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span
        className="text-2xl font-bold text-violet-300 leading-none"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        94
      </span>
      <span className="text-[10px] text-indigo-400/70 mt-0.5">/100</span>
    </div>
  </div>
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 overflow-hidden pt-16">

      {/* Decorative circles — same pattern as auth layout */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 right-8 h-48 w-48 -translate-y-1/2 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/[0.03] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 w-full py-24">
        <div className="flex flex-col lg:flex-row items-center gap-14 xl:gap-20">

          {/* ── Left copy ── */}
          <div className="flex-1 min-w-0">

            {/* Badge */}
            <div className="anim-up d1 inline-flex items-center gap-2 mb-7">
              <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 text-indigo-200 uppercase tracking-widest">
                ✦ AI-Powered Career Tool
              </span>
            </div>

            {/* Heading — mirrors auth layout copy */}
            <h1
              className="anim-up d2 text-5xl sm:text-6xl lg:text-[4.25rem] font-normal leading-[1.06] tracking-tight text-white mb-6"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Ace your next<br />
              <span className="text-indigo-200">tech interview.</span>
            </h1>

            {/* Subtitle */}
            <p className="anim-up d3 text-lg text-indigo-200/75 leading-relaxed mb-9 max-w-[520px]">
              Upload your resume, paste the job description, and receive a complete
              AI-generated report — match score, tailored questions, skill-gap
              analysis, and a 7-day prep plan — in seconds.
            </p>

            {/* CTAs */}
            <div className="anim-up d4 flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-white text-indigo-950 hover:bg-indigo-100 transition-colors shadow-lg shadow-indigo-950/60"
              >
                Start for Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border border-white/20 text-indigo-200 hover:bg-white/5 transition-colors"
              >
                See how it works
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </a>
            </div>

            {/* Trust line */}
            <p className="anim-up d5 text-xs text-indigo-300/60">
              Trusted by{" "}
              <span className="text-indigo-200">2,000+ engineers</span>{" "}
              at Google, Meta, Stripe &amp; more · No credit card required
            </p>
          </div>

          {/* ── Right: floating mock report card ── */}
          <div className="anim-up d4 w-full max-w-[370px] lg:max-w-[390px] flex-none">
            <div
              className="card-float rounded-2xl p-6 border border-white/10 shadow-2xl shadow-indigo-950"
              style={{
                background: "rgba(15, 10, 60, 0.75)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mb-1">
                    Interview Report
                  </p>
                  <p className="text-sm font-semibold text-white">Senior Frontend Engineer</p>
                  <p className="text-xs text-indigo-300/60 mt-0.5">Stripe · San Francisco</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-5 mb-5 p-4 rounded-xl bg-white/[0.04] border border-white/8">
                <ScoreRing />
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">Match Score</p>
                  <p className="text-xs text-indigo-300/70 mb-3">Excellent fit for this role</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Node.js"].map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/15 text-indigo-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5 mb-5">
                {[
                  "8 Technical Questions Ready",
                  "5 Behavioral Questions Ready",
                  "3 Skill Gaps Identified",
                  "7-Day Prep Plan Generated",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 flex-none text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-indigo-200/70">{item}</span>
                  </div>
                ))}
              </div>

              {/* Card CTA */}
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Generate My Report
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
