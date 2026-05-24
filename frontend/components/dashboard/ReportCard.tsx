"use client";

import Link from "next/link";
import MatchScoreRing from "./MatchScoreRing";
import type { InterviewReportSummary } from "@/types/interview";

interface ReportCardProps {
  report: InterviewReportSummary;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="feat-card group flex flex-col gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-indigo-500/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-400 mb-1.5">
            Interview Report
          </p>
          <h3 className="text-base font-semibold text-white leading-snug truncate">
            {report.title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500">{formatDate(report.createdAt)}</p>
        </div>
        <MatchScoreRing score={report.matchScore} size={80} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link
          href={`/dashboard/report/${report._id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/10 border border-indigo-600/30 px-4 py-2.5 text-sm font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
        >
          View Report
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
