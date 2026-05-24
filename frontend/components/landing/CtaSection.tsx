import Link from "next/link";

export function CtaSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 py-28 overflow-hidden border-t border-white/10">

      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/5 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">

        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
          Start today — free
        </p>

        <h2
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-normal text-white leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Your next interview<br />
          <span className="text-indigo-200">starts here.</span>
        </h2>

        <p className="text-base text-indigo-200/70 mb-10 max-w-md mx-auto leading-relaxed">
          Join thousands of engineers who landed their dream offer with InterviewAI.
          Free to start — no credit card required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Inverted primary button (white on gradient) */}
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm bg-white text-indigo-950 hover:bg-indigo-100 transition-colors shadow-xl shadow-indigo-950/60"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Ghost */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-medium border border-white/20 text-indigo-200 hover:bg-white/5 transition-colors"
          >
            Already have an account
          </Link>
        </div>

        {/* Feature bullets under CTA */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10">
          {[
            "No credit card",
            "Report in 60 seconds",
            "PDF resume download",
            "Cancel anytime",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-indigo-300/60">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
