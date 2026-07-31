"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function HeroSection() {
  const { user, loading } = useAuth();

  const ctaHref = user ? "/dashboard" : "/login";
  const ctaLabel = "Start for Free";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 overflow-hidden pt-16">

      {/* Decorative glow — centered, symmetric */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-white/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 w-full py-28 text-center">

        {/* Eyebrow */}
        <div className="anim-up d1 flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-8 bg-indigo-400/40" />
          <span className="text-xs font-medium tracking-[0.25em] text-indigo-300 uppercase">
            AI-Powered Career Tool
          </span>
          <span className="h-px w-8 bg-indigo-400/40" />
        </div>

        {/* Heading */}
        <h1
          className="anim-up d2 text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-white mb-7"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Ace your next<br />
          <span className="italic text-indigo-200">tech interview.</span>
        </h1>

        {/* Subtitle */}
        <p className="anim-up d3 text-lg text-indigo-200/75 leading-relaxed mb-10 max-w-xl mx-auto">
          Upload your resume, paste the job description, and receive a complete
          AI-generated report — match score, tailored questions, skill-gap
          analysis, and a 7-day prep plan — in seconds.
        </p>

        {/* CTAs */}
        <div className="anim-up d4 flex flex-wrap items-center justify-center gap-4 mb-6">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-white text-indigo-950 hover:bg-indigo-100 transition-colors shadow-lg shadow-indigo-950/60"
          >
            {ctaLabel}
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
          Trusted by engineers at Google, Meta, Stripe &amp; more · No credit card required
        </p>
      </div>
    </section>
  );
}
