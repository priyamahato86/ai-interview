const steps = [
  {
    n: "01",
    title: "Upload & Describe",
    desc: "Upload your resume PDF, paste the job description, and add a short self-introduction so the AI understands your background.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "AI Builds Your Report",
    desc: "In seconds, the AI analyses your profile, generates bespoke interview questions, maps skill gaps, and crafts a 7-day preparation plan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Practice & Get Hired",
    desc: "Study your custom questions and model answers, follow the prep plan, download your tailored resume, and walk in ready to win.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-6 h-6">
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
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            The process
          </p>
          <h2
            className="text-4xl sm:text-5xl font-normal text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Ready in under
            <span className="text-indigo-200"> 60 seconds</span>
          </h2>
          <p className="max-w-md mx-auto text-base text-indigo-200/65 leading-relaxed">
            Three steps are all that stand between you and your next interview offer.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`relative flex flex-col items-center text-center ${i < steps.length - 1 ? "step-line" : ""}`}
            >
              {/* Number bubble */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 z-10 ${
                  i === 0
                    ? "bg-indigo-600 shadow-lg shadow-indigo-900 text-white"
                    : "bg-indigo-600/10 ring-1 ring-indigo-500/30 text-indigo-400"
                }`}
              >
                {step.icon}
              </div>

              {/* Step number label */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">
                Step {step.n}
              </p>

              <h3 className="text-base font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-indigo-200/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
