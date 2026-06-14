const steps = [
  {
    n: "01",
    title: "Upload & Describe",
    desc: "Upload your resume PDF, paste the job description, and add a short intro so the AI knows your background.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "AI Builds Your Package",
    desc: "The AI generates your match score, interview questions with answers, a 7-day prep plan, ATS resume, and cover letter.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Practice with AI Chat",
    desc: "Open the mock interview chat on your report and practice live with follow-up questions and real-time feedback.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Download, Share & Win",
    desc: "Download your resume and cover letter as PDFs, share your report with a mentor via a secure link, and walk in ready.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-indigo-950 py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            The process
          </p>
          <h2
            className="text-4xl sm:text-5xl font-normal text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            From upload to
            <span className="text-indigo-200"> offer-ready</span>
          </h2>
          <p className="max-w-md mx-auto text-base text-indigo-200/65 leading-relaxed">
            Four steps take you from a blank resume to a full interview package with live AI practice.
          </p>
        </div>

        {/* Steps — single row */}
        <div className="relative flex flex-col sm:flex-row items-start gap-8 sm:gap-0">

          {/* Connecting track line (desktop only) */}
          <div
            aria-hidden
            className="hidden sm:block absolute top-5.5 left-[calc(12.5%+22px)] right-[calc(12.5%+22px)] h-px bg-linear-to-r from-indigo-500/40 via-indigo-400/60 to-indigo-500/40"
          />

          {steps.map((step, i) => (
            <div key={step.n} className="relative flex-1 flex flex-col items-center text-center px-4">

              {/* Number badge above icon */}
              <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase mb-3">
                {step.n}
              </span>

              {/* Icon circle */}
              <div
                className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center mb-5 ring-1 transition-all ${
                  i === 0
                    ? "bg-indigo-600 ring-indigo-500 text-white shadow-lg shadow-indigo-700/50"
                    : "bg-indigo-950 ring-indigo-500/40 text-indigo-400"
                }`}
              >
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{step.title}</h3>
              <p className="text-xs text-indigo-200/55 leading-relaxed max-w-45 mx-auto">{step.desc}</p>

              {/* Arrow between steps (desktop) */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden sm:flex absolute top-5.5 -right-3 z-20 w-6 h-6 items-center justify-center"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-indigo-500/70">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
