"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { interviewApi } from "@/lib/interviewApi";
import type { InterviewReport, SkillGap } from "@/types/interview";

type Section = "technical" | "behavioral" | "roadmap";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "7-Day Road Map" },
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

function scoreLabel(score: number) {
  if (score >= 80) return { text: "Strong Match", color: "text-emerald-400", ring: "stroke-emerald-500" };
  if (score >= 60) return { text: "Good Match", color: "text-amber-400", ring: "stroke-amber-500" };
  return { text: "Needs Work", color: "text-red-400", ring: "stroke-red-500" };
}

function scoreToDasharray(score: number) {
  const circumference = 2 * Math.PI * 36;
  const filled = (score / 100) * circumference;
  return `${filled} ${circumference}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MatchScoreRing({ score }: { score: number }) {
  const label = scoreLabel(score);
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-800" />
        <circle
          cx="36" cy="36" r="36" fill="none"
          strokeWidth="6"
          strokeDasharray={scoreToDasharray(score)}
          strokeLinecap="round"
          className={label.ring}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-fraunces)" }}>
          {score}
        </span>
        <span className="text-[9px] font-semibold text-gray-500">/100</span>
      </div>
    </div>
  );
}

function QuestionItem({ index, question, intention, answer }: { index: number; question: string; intention: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border bg-gray-900/50 overflow-hidden transition-all duration-200 ${open ? "border-indigo-600/40 bg-gray-900/80" : "border-gray-800/80 hover:border-gray-700"}`}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-start gap-4 px-6 py-5 text-left">
        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30 mt-0.5">
          Q{index + 1}
        </span>
        <span className="flex-1 text-sm font-medium text-gray-200 leading-relaxed pr-2">{question}</span>
        <div className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 mt-0.5 ${open ? "bg-indigo-600/20 text-indigo-400" : "text-gray-600"}`}>
          <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-indigo-600/20 mx-6 mb-5">
          <div className="pt-5 grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl bg-indigo-950/30 border border-indigo-900/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-2.5">Why they ask this</p>
              <p className="text-sm text-gray-300 leading-relaxed">{intention}</p>
            </div>
            <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 mb-2.5">How to answer</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SharedReportPage() {
  const params = useParams();
  const token = params.token as string;
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("technical");

  useEffect(() => {
    if (!token) return;
    interviewApi
      .getSharedReport(token)
      .then((res) => setReport(res))
      .catch(() => setError("Report not found or no longer available."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading shared report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
          <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-white">Report Not Found</h1>
        <p className="text-sm text-gray-500">This shared report may have been removed or the link is invalid.</p>
        <a href="/" className="mt-4 text-sm text-indigo-400 underline">Go to InterviewAI</a>
      </div>
    );
  }

  const label = scoreLabel(report.matchScore);
  const activeQuestions =
    activeSection === "technical"
      ? report.technicalQuestions
      : activeSection === "behavioral"
      ? report.behavioralQuestions
      : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/80 bg-gray-900/90">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">InterviewAI</span>
          </div>
          <a href="/" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Create Your Report
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Summary Strip */}
        <div className="py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex items-center gap-5">
            <MatchScoreRing score={report.matchScore} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mb-0.5">Match Score</p>
              <p className={`text-lg font-bold ${label.color}`}>{label.text}</p>
              <p className="text-xs text-gray-600 mt-0.5">vs. job description</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Technical Qs</p>
            <p className="text-3xl font-bold text-white">{report.technicalQuestions.length}</p>
            <p className="text-xs text-gray-600 mt-1">questions</p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Behavioral Qs</p>
            <p className="text-3xl font-bold text-white">{report.behavioralQuestions.length}</p>
            <p className="text-xs text-gray-600 mt-1">questions</p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Report Date</p>
            <p className="text-lg font-bold text-white">{formatDate(report.createdAt)}</p>
            <p className="text-xs text-gray-600 mt-1">{report.title}</p>
          </div>
        </div>

        {/* Skill Gaps */}
        {report.skillGaps.length > 0 && (
          <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mr-2">Skill Gaps</p>
              {report.skillGaps.map((gap) => (
                <span key={gap.skill} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${SEVERITY_STYLES[gap.severity]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[gap.severity]}`} />
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8 pb-16">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-1.5 pt-1">
            <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Sections</p>
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
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-indigo-600/15 text-indigo-300 ring-1 ring-indigo-600/30"
                      : "text-gray-500 hover:bg-gray-900 hover:text-gray-300"
                  }`}
                >
                  <span>{s.label}</span>
                  <span className={`text-[11px] font-semibold rounded-md px-1.5 py-0.5 ${
                    activeSection === s.id ? "bg-indigo-600/20 text-indigo-400" : "bg-gray-800 text-gray-600"
                  }`}>{count}</span>
                </button>
              );
            })}
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 lg:hidden overflow-x-auto pb-4">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    activeSection === s.id ? "bg-indigo-600 text-white" : "bg-gray-900 text-gray-500 border border-gray-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-white">
                {SECTIONS.find((s) => s.id === activeSection)?.label}
              </h2>
              <span className="rounded-lg bg-gray-800/80 border border-gray-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                {activeSection === "roadmap" ? `${report.preparationPlan.length} days` : `${activeQuestions.length} questions`}
              </span>
            </div>

            {/* Questions */}
            {activeSection !== "roadmap" && (
              <div className="space-y-3">
                {activeQuestions.map((q, i) => (
                  <QuestionItem key={i} index={i} question={q.question} intention={q.intention} answer={q.answer} />
                ))}
              </div>
            )}

            {/* Roadmap */}
            {activeSection === "roadmap" && (
              <div className="relative">
                <div className="absolute left-6.75 top-10 bottom-10 w-px bg-gray-800 hidden sm:block" />
                <div className="space-y-4">
                  {report.preparationPlan.map((plan, idx) => (
                    <div key={plan.day} className="relative flex gap-5">
                      <div className="shrink-0 flex flex-col items-center gap-1 z-10">
                        <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl text-center ring-1 ${
                          idx === 0 ? "bg-indigo-600 ring-indigo-500/50 text-white" : "bg-gray-900 ring-gray-800 text-indigo-400"
                        }`}>
                          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Day</span>
                          <span className="text-lg font-bold leading-none">{plan.day}</span>
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
                        <h3 className="text-base font-semibold text-white mb-3">{plan.focus}</h3>
                        <ul className="space-y-2.5">
                          {plan.tasks.map((task, ti) => (
                            <li key={ti} className="flex items-start gap-3 text-sm text-gray-400">
                              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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