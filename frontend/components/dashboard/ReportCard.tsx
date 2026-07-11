"use client";

import Link from "next/link";
import MatchScoreRing from "./MatchScoreRing";
import type { InterviewReportSummary } from "@/types/interview";

interface ReportCardProps {
  report: InterviewReportSummary;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectionDisabled?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportCard({
  report,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  selectionDisabled = false,
}: ReportCardProps) {
  const cardBody = (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gray-900/90 px-4 py-3.5 transition-all duration-200 ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500/60"
          : "border-gray-800/80 hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5"
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent" />

      {selectionMode && (
        <div
          className={`absolute top-3 right-3 z-10 flex h-5 w-5 items-center justify-center rounded-md border ${
            selected
              ? "border-indigo-500 bg-indigo-600"
              : "border-gray-600 bg-gray-800/80"
          }`}
        >
          {selected && (
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </div>
      )}

      {/* Header: Badge + Score */}
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Badge */}
        <span className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-400">
          Interview
        </span>

        {/* Score Ring */}
        {!selectionMode && <MatchScoreRing score={report.matchScore} size={52} />}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-white leading-snug mb-1.5 group-hover:text-indigo-200 transition-colors line-clamp-2">
        {report.title}
      </h3>

      {/* Date */}
      <p className="text-[11px] text-gray-500 mb-2.5">{formatDate(report.createdAt)}</p>

      {selectionMode ? (
        <div className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-800/60 border border-gray-700 px-3 py-2 text-xs font-medium text-gray-400">
          {selected ? "Selected" : "Select to compare"}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/25 px-3 py-2 text-xs font-medium text-indigo-400 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
          <span>View Report</span>
          <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  );

  if (!selectionMode) {
    return (
      <Link href={`/dashboard/report/${report._id}`} className="group block">
        {cardBody}
      </Link>
    );
  }

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-disabled={selectionDisabled}
      tabIndex={0}
      onClick={() => !selectionDisabled && onToggleSelect?.(report._id)}
      onKeyDown={(e) => {
        if (selectionDisabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleSelect?.(report._id);
        }
      }}
      className={`block cursor-pointer ${selectionDisabled ? "pointer-events-none opacity-50" : ""}`}
    >
      {cardBody}
    </div>
  );
}
