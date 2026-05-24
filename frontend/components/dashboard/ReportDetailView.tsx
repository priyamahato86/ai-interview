"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { interviewApi } from "@/lib/interviewApi";
import MatchScoreRing from "./MatchScoreRing";
import type { InterviewReport, SkillGap } from "@/types/interview";

type Section = "technical" | "behavioral" | "roadmap";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "7-Day Road Map",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
  },
];

const SEVERITY_STYLES: Record<SkillGap["severity"], string> = {
  high: "bg-red-950/60 text-red-300 border-red-800/60",
  medium: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  low: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
};

const SEVERITY_DOT: Record<SkillGap["severity"], string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function scoreLabel(score: number) {
  if (score >= 80) return { text: "Strong Match", color: "text-emerald-400" };
  if (score >= 60) return { text: "Good Match", color: "text-amber-400" };
  return { text: "Needs Work", color: "text-red-400" };
}

interface QuestionItemProps {
  index: number;
  question: string;
  intention: string;
  answer: string;
}

function QuestionItem({ index, question, intention, answer }: QuestionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group rounded-2xl border bg-gray-900/50 overflow-hidden transition-all duration-200 ${
        open ? "border-indigo-600/40 bg-gray-900/80" : "border-gray-800/80 hover:border-gray-700"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 px-6 py-5 text-left"
      >
        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30 mt-0.5">
          Q{index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-200 leading-relaxed pr-2">
          {question}
        </span>
        <div className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 mt-0.5 ${open ? "bg-indigo-600/20 text-indigo-400" : "text-gray-600 group-hover:text-gray-400"}`}>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-indigo-600/20 mx-6 mb-5">
          <div className="pt-5 grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl bg-indigo-950/30 border border-indigo-900/40 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400">
                  Why they ask this
                </p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{intention}</p>
            </div>
            <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
                  How to answer
                </p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportDetailView({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("technical");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    interviewApi
      .getReportById(id)
      .then((res) => setReport(res.data.interviewReport))
      .catch(() => setError("Failed to load report."))
      .finally(() => setLoading(false));
  }, [user, id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await interviewApi.downloadResume(id);
    } catch {
      // silently ignore
    } finally {
      setDownloading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Preparing your report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950">
        <p className="text-sm text-red-400">{error ?? "Report not found."}</p>
        <Link href="/dashboard" className="text-sm text-indigo-400 underline">Back to Dashboard</Link>
      </div>
    );
  }

  const label = scoreLabel(report.matchScore);
  const highGaps = report.skillGaps.filter((g) => g.severity === "high").length;
  const medGaps = report.skillGaps.filter((g) => g.severity === "medium").length;
  const lowGaps = report.skillGaps.filter((g) => g.severity === "low").length;

  const activeQuestions =
    activeSection === "technical"
      ? report.technicalQuestions
      : activeSection === "behavioral"
      ? report.behavioralQuestions
      : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Dashboard
            </Link>
            <span className="text-gray-700">/</span>
            <h1 className="text-sm font-semibold text-white truncate">{report.title}</h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden md:block text-xs text-gray-600">{formatDate(report.createdAt)}</span>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              {downloading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              )}
              Download Resume
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* ── Summary Strip ─────────────────────────────────────────────────── */}
        <div className="py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Match Score */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex items-center gap-5">
            <MatchScoreRing score={report.matchScore} size={72} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-0.5">Match Score</p>
              <p className={`text-lg font-bold ${label.color}`}>{label.text}</p>
              <p className="text-xs text-gray-600 mt-0.5">vs. job description</p>
            </div>
          </div>

          {/* Tech Questions */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Technical Qs</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/15 text-indigo-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{report.technicalQuestions.length}</p>
            <p className="text-xs text-gray-600 mt-1">questions to practice</p>
          </div>

          {/* Behavioral Questions */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Behavioral Qs</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{report.behavioralQuestions.length}</p>
            <p className="text-xs text-gray-600 mt-1">scenarios to prepare</p>
          </div>

          {/* Skill Gaps */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Skill Gaps</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/15 text-amber-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{report.skillGaps.length}</p>
            <div className="flex items-center gap-2 mt-1">
              {highGaps > 0 && <span className="text-xs text-red-400">{highGaps} high</span>}
              {medGaps > 0 && <span className="text-xs text-amber-400">{medGaps} medium</span>}
              {lowGaps > 0 && <span className="text-xs text-emerald-400">{lowGaps} low</span>}
            </div>
          </div>
        </div>

        {/* ── Skill Gaps Strip ──────────────────────────────────────────────── */}
        {report.skillGaps.length > 0 && (
          <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mr-2">Skill Gaps</p>
              {report.skillGaps.map((gap) => (
                <span
                  key={gap.skill}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${SEVERITY_STYLES[gap.severity]}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${SEVERITY_DOT[gap.severity]}`} />
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Two-Column Layout ────────────────────────────────────────── */}
        <div className="flex gap-8 pb-16">

          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-1.5 pt-1">
            <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              Sections
            </p>
            {SECTIONS.map((s) => {
              const count =
                s.id === "technical"
                  ? report.technicalQuestions.length
                  : s.id === "behavioral"
                  ? report.behavioralQuestions.length
                  : report.preparationPlan.length;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all text-left ${
                    activeSection === s.id
                      ? "bg-indigo-600/15 text-indigo-300 ring-1 ring-indigo-600/30"
                      : "text-gray-500 hover:bg-gray-900 hover:text-gray-300"
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${activeSection === s.id ? "text-indigo-400" : "text-gray-600 group-hover:text-gray-400"}`}>
                    {s.icon}
                  </span>
                  <span className="flex-1 leading-tight">{s.label}</span>
                  <span className={`shrink-0 text-[11px] font-semibold rounded-md px-1.5 py-0.5 tabular-nums transition-colors ${
                    activeSection === s.id ? "bg-indigo-600/20 text-indigo-400" : "bg-gray-800 text-gray-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 lg:hidden overflow-x-auto pb-4">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-900 text-gray-500 border border-gray-800"
                  }`}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-white">
                {SECTIONS.find((s) => s.id === activeSection)?.label}
              </h2>
              <span className="rounded-lg bg-gray-800/80 border border-gray-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                {activeSection === "roadmap"
                  ? `${report.preparationPlan.length} days`
                  : `${activeQuestions.length} questions`}
              </span>
            </div>

            {/* Questions */}
            {activeSection !== "roadmap" && (
              <div className="space-y-3">
                {activeQuestions.map((q, i) => (
                  <QuestionItem
                    key={i}
                    index={i}
                    question={q.question}
                    intention={q.intention}
                    answer={q.answer}
                  />
                ))}
              </div>
            )}

            {/* Roadmap */}
            {activeSection === "roadmap" && (
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-6.75 top-10 bottom-10 w-px bg-gray-800 hidden sm:block" />
                <div className="space-y-4">
                  {report.preparationPlan.map((plan, idx) => (
                    <div key={plan.day} className="relative flex gap-5">
                      {/* Day badge */}
                      <div className="shrink-0 flex flex-col items-center gap-1 z-10">
                        <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl text-center ring-1 ${
                          idx === 0
                            ? "bg-indigo-600 ring-indigo-500/50 text-white"
                            : "bg-gray-900 ring-gray-800 text-indigo-400"
                        }`}>
                          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Day</span>
                          <span className="text-lg font-bold leading-none">{plan.day}</span>
                        </div>
                      </div>
                      {/* Card */}
                      <div className="flex-1 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors p-5 mb-0">
                        <h3 className="text-base font-semibold text-white mb-3">{plan.focus}</h3>
                        <ul className="space-y-2.5">
                          {plan.tasks.map((task, ti) => (
                            <li key={ti} className="flex items-start gap-3 text-sm text-gray-400">
                              <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                              <span className="leading-relaxed">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
