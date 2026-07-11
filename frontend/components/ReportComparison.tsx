"use client";

import { useState } from "react";
import Link from "next/link";
import MatchScoreRing from "@/components/dashboard/MatchScoreRing";
import { MIN_COMPARE_REPORTS } from "@/lib/compareConfig";
import type { InterviewReport, SkillGap } from "@/types/interview";

interface ReportComparisonProps {
  reports: InterviewReport[];
  onRemove: (id: string) => void;
}

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

const SEVERITY_ORDER: Record<SkillGap["severity"], number> = { high: 0, medium: 1, low: 2 };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function QuestionSummary({ questions }: { questions: InterviewReport["technicalQuestions"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (questions.length === 0) {
    return <p className="text-xs text-gray-600">None</p>;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-gray-300">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
      <div className="space-y-1">
        {questions.map((q, i) => (
          <div key={i} className="rounded-lg border border-gray-800/60 bg-gray-900/60">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-start justify-between gap-2 px-2.5 py-1.5 text-left"
            >
              <span className="min-w-0 text-xs text-gray-400 line-clamp-2">{q.question}</span>
              <svg
                className={`mt-0.5 h-3 w-3 shrink-0 text-gray-600 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="space-y-1.5 border-t border-gray-800/60 px-2.5 py-2 text-xs">
                <p><span className="text-indigo-400">Why they ask: </span><span className="text-gray-500">{q.intention}</span></p>
                <p><span className="text-emerald-400">How to answer: </span><span className="text-gray-500">{q.answer}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportComparison({ reports, onRemove }: ReportComparisonProps) {
  const canRemove = reports.length > MIN_COMPARE_REPORTS;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/60">
      <div
        className="grid"
        style={{ gridTemplateColumns: `180px repeat(${reports.length}, minmax(260px, 1fr))` }}
      >
        {/* Header row */}
        <div className="sticky left-0 z-10 border-r border-gray-800/60 bg-gray-950 px-4 py-4" />
        {reports.map((report) => (
          <div key={report._id} className="relative border-t border-gray-800/40 px-4 py-4">
            {canRemove && (
              <button
                onClick={() => onRemove(report._id)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                aria-label={`Remove ${report.title} from comparison`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <h3 className="mb-1 pr-6 text-sm font-semibold text-white line-clamp-2">{report.title}</h3>
            <p className="mb-3 text-[11px] text-gray-500">{formatDate(report.createdAt)}</p>
            <MatchScoreRing score={report.matchScore ?? 0} size={64} />
            <Link
              href={`/dashboard/report/${report._id}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              Open full report
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        ))}

        {/* Technical Questions row */}
        <div className="sticky left-0 z-10 border-r border-t border-gray-800/60 bg-gray-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Technical Questions
        </div>
        {reports.map((report) => (
          <div key={report._id} className="border-t border-gray-800/40 px-4 py-3">
            <QuestionSummary questions={report.technicalQuestions} />
          </div>
        ))}

        {/* Behavioral Questions row */}
        <div className="sticky left-0 z-10 border-r border-t border-gray-800/60 bg-gray-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Behavioral Questions
        </div>
        {reports.map((report) => (
          <div key={report._id} className="border-t border-gray-800/40 px-4 py-3">
            <QuestionSummary questions={report.behavioralQuestions} />
          </div>
        ))}

        {/* Skill Gaps row */}
        <div className="sticky left-0 z-10 border-r border-t border-gray-800/60 bg-gray-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Skill Gaps
        </div>
        {reports.map((report) => {
          const sorted = [...report.skillGaps].sort(
            (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
          );
          return (
            <div key={report._id} className="border-t border-gray-800/40 px-4 py-3">
              {sorted.length === 0 ? (
                <p className="text-xs text-gray-600">None</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {sorted.map((gap, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium ${SEVERITY_STYLES[gap.severity]}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[gap.severity]}`} />
                      {gap.skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Prep Plan row */}
        <div className="sticky left-0 z-10 border-r border-t border-gray-800/60 bg-gray-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Prep Plan
        </div>
        {reports.map((report) => (
          <div key={report._id} className="border-t border-gray-800/40 px-4 py-3">
            {report.preparationPlan.length === 0 ? (
              <p className="text-xs text-gray-600">None</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-gray-300">
                  {report.preparationPlan.length}-day plan
                </p>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  Day 1: {report.preparationPlan[0].focus}
                </p>
              </>
            )}
          </div>
        ))}

        {/* Created row */}
        <div className="sticky left-0 z-10 border-r border-t border-gray-800/60 bg-gray-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Created
        </div>
        {reports.map((report) => (
          <div key={report._id} className="border-t border-gray-800/40 px-4 py-3 text-xs text-gray-400">
            {formatDate(report.createdAt)}
          </div>
        ))}
      </div>
    </div>
  );
}
