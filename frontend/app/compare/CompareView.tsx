"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { interviewApi } from "@/lib/interviewApi";
import { MIN_COMPARE_REPORTS } from "@/lib/compareConfig";
import ReportComparison from "@/components/ReportComparison";
import type { InterviewReport } from "@/types/interview";

interface CompareViewProps {
  ids: string[];
}

export default function CompareView({ ids }: CompareViewProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [notFoundCount, setNotFoundCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    if (ids.length < MIN_COMPARE_REPORTS) {
      setReports([]);
      setNotFoundCount(0);
      setLoading(false);
      setHasLoadedOnce(true);
      return;
    }

    setLoading(true);
    Promise.allSettled(ids.map((id) => interviewApi.getReportById(id))).then((results) => {
      const fulfilled: InterviewReport[] = [];
      let failed = 0;
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          fulfilled.push(result.value);
        } else {
          failed++;
        }
      });
      setReports(fulfilled);
      setNotFoundCount(failed);
      setLoading(false);
      setHasLoadedOnce(true);
    });
  }, [user, ids]);

  const handleRemove = (id: string) => {
    const remaining = reports.filter((r) => r._id !== id).map((r) => r._id);
    router.replace(`/compare?ids=${remaining.join(",")}`, { scroll: false });
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Sticky nav ── */}
      <div className="sticky top-0 z-20 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1
          className="mb-6 text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {reports.length > 0 ? `Comparing ${reports.length} Reports` : "Compare Reports"}
        </h1>

        {notFoundCount > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-900/15 px-4 py-3 text-sm text-red-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {notFoundCount} selected report{notFoundCount !== 1 ? "s" : ""} could not be loaded and were skipped.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}

        {!loading && hasLoadedOnce && reports.length < MIN_COMPARE_REPORTS && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
              <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-white">Select at least 2 reports</h2>
            <p className="mb-6 text-sm text-gray-500">Go back to your dashboard and pick 2 to 4 reports to compare.</p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        )}

        {!loading && reports.length >= MIN_COMPARE_REPORTS && (
          <ReportComparison reports={reports} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}
