"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { interviewApi } from "@/lib/interviewApi";
import ReportCard from "@/components/dashboard/ReportCard";
import type { InterviewReportSummary } from "@/types/interview";

const PREVIEW_FEATURES = [
  {
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    title: "Match Score",
    desc: "See how well your profile aligns with the role",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 ring-emerald-500/20",
  },
  {
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
    title: "Technical Questions",
    desc: "Role-specific questions with detailed answer guides",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 ring-indigo-500/20",
  },
  {
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
    title: "Behavioral Questions",
    desc: "STAR-method answers for soft-skill questions",
    color: "text-violet-400",
    bg: "bg-violet-500/10 ring-violet-500/20",
  },
  {
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
    title: "Skill Gap Analysis",
    desc: "Know exactly what to improve before the interview",
    color: "text-amber-400",
    bg: "bg-amber-500/10 ring-amber-500/20",
  },
  {
    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    title: "7-Day Prep Plan",
    desc: "A daily roadmap to get interview-ready fast",
    color: "text-sky-400",
    bg: "bg-sky-500/10 ring-sky-500/20",
  },
  {
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
    title: "ATS Resume",
    desc: "AI-tailored resume downloadable as a PDF",
    color: "text-rose-400",
    bg: "bg-rose-500/10 ring-rose-500/20",
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function avgScore(reports: InterviewReportSummary[]) {
  if (!reports.length) return 0;
  return Math.round(reports.reduce((s, r) => s + r.matchScore, 0) / reports.length);
}

function bestScore(reports: InterviewReportSummary[]) {
  return Math.max(...reports.map((r) => r.matchScore));
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<InterviewReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    interviewApi
      .getAllReports()
      .then((res) => setReports(res))
      .catch(() => setError("Failed to load reports."))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const hasReports = !loading && reports.length > 0;

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ── Sticky nav ── */}
      <div className="sticky top-0 z-20 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-500 transition-colors">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">InterviewAI</span>
          </Link>

          <Link
            href="/generate"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/50 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Generate New
          </Link>
        </div>
      </div>

      {/* ── Hero greeting banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-950 via-indigo-900/40 to-gray-950">
        {/* Decorative layer */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.07) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 h-56 w-80 rounded-full bg-violet-600/8 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Left: avatar + greeting */}
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/60 ring-1 ring-white/10">
                  <span
                    className="text-xl font-bold text-white uppercase"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {(user?.username ?? "U")[0]}
                  </span>
                </div>
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-950 ring-1 ring-gray-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                    {getGreeting()}
                  </span>
                  <span className="h-px w-4 bg-indigo-700/60" />
                  <span className="text-xs text-gray-400">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {user?.username ?? "Welcome back"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {loading
                    ? "Loading your interview history…"
                    : hasReports
                    ? `${reports.length} report${reports.length !== 1 ? "s" : ""} in your history — keep pushing!`
                    : "Ready to ace your next interview? Let's build your plan."}
                </p>
              </div>
            </div>

            {/* Right: always-visible stat cards */}
            {!loading && (
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
                {[
                  {
                    value: String(reports.length),
                    label: "Reports Generated",
                    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
                    iconAccent: "text-indigo-400",
                    iconBg: "bg-indigo-500/10 ring-indigo-500/20",
                    valueColor: "text-white",
                    empty: reports.length === 0,
                  },
                  {
                    value: hasReports ? `${avgScore(reports)}%` : "—",
                    label: "Avg Match Score",
                    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
                    iconAccent: "text-violet-400",
                    iconBg: "bg-violet-500/10 ring-violet-500/20",
                    valueColor: "text-violet-300",
                    empty: !hasReports,
                  },
                  {
                    value: hasReports ? `${bestScore(reports)}%` : "—",
                    label: "Best Score",
                    icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
                    iconAccent: "text-emerald-400",
                    iconBg: "bg-emerald-500/10 ring-emerald-500/20",
                    valueColor: "text-emerald-400",
                    empty: !hasReports,
                  },
                  {
                    value: hasReports
                      ? new Date(reports[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—",
                    label: "Latest Report",
                    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
                    iconAccent: "text-amber-400",
                    iconBg: "bg-amber-500/10 ring-amber-500/20",
                    valueColor: "text-amber-300",
                    empty: !hasReports,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 rounded-2xl border border-gray-800/80 bg-gray-900/60 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${s.iconBg}`}>
                      <svg className={`h-4 w-4 ${s.iconAccent}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`text-lg font-bold leading-none ${s.empty ? "text-gray-500" : s.valueColor}`}
                        style={{ fontFamily: "var(--font-fraunces)" }}
                      >
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading skeleton for stats */}
            {loading && (
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 w-36 rounded-2xl border border-gray-800 bg-gray-900 animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-indigo-800/40 to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-900/15 px-4 py-3 text-sm text-red-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="h-4 w-32 rounded-lg bg-gray-800 animate-pulse" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl border border-gray-800 bg-gray-900 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* ── Reports grid ── */}
        {hasReports && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Recent Reports
              </h2>
              <span className="text-xs font-medium text-indigo-400">{reports.length} total</span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && reports.length === 0 && (
          <div className="space-y-8">
            {/* Central CTA card */}
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-gray-800 bg-linear-to-b from-gray-900/80 to-gray-950 p-10 text-center">
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/6 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 right-1/4 h-40 w-48 rounded-full bg-violet-600/5 blur-2xl" />

              <div className="relative">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/15 ring-1 ring-indigo-600/25">
                  <svg className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>

                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  No reports yet
                </h2>
                <p className="mx-auto max-w-sm text-sm text-gray-500 leading-relaxed mb-8">
                  Generate your first AI-powered interview plan — get a personalized match score, tailored questions, and a 7-day prep roadmap in under a minute.
                </p>

                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/50 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                  Generate First Report
                </Link>

                <p className="mt-4 text-xs text-gray-500">Ready in ~60 seconds · No credit card needed</p>
              </div>
            </div>

            {/* What you'll get grid */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500 text-center">
                Your report will include
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {PREVIEW_FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-gray-800/80 bg-gray-900/60 p-4 text-center hover:border-gray-700 transition-colors"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${f.bg}`}>
                      <svg className={`h-5 w-5 ${f.color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-snug">{f.title}</p>
                      <p className="mt-1 text-[10px] text-gray-500 leading-relaxed hidden sm:block">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
