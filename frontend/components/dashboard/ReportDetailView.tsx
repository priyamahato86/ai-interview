"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { interviewApi } from "@/lib/interviewApi";
import MatchScoreRing from "./MatchScoreRing";
import ResumeCustomizationModal from "@/components/resume/ResumeCustomizationModal";
import ChatInterface from "./ChatInterface";
import CoverLetterModal from "@/components/CoverLetterModal";
import type { InterviewReport, SkillGap } from "@/types/interview";
import type { ResumeCustomization } from "@/types/resume";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareToken: string;
}

function ShareModal({ isOpen, onClose, shareUrl, shareToken }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${shareUrl}`
    : shareUrl;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share Report</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-indigo-950/50 border border-indigo-900/50 p-4">
          <p className="text-sm text-indigo-300">
            Anyone with this link can view your report (read-only). Your personal information is not shared.
          </p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fullUrl}
              readOnly
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-300 outline-none"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl px-6 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

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
  practiced: boolean;
  onTogglePracticed: () => void;
}

function QuestionItem({ index, question, intention, answer, practiced, onTogglePracticed }: QuestionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group rounded-2xl border bg-gray-900/50 overflow-hidden transition-all duration-200 ${
        open ? "border-indigo-600/40 bg-gray-900/80" : "border-gray-800/80 hover:border-gray-700"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="flex w-full cursor-pointer items-start gap-4 px-6 py-5 text-left"
      >
        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30 mt-0.5">
          Q{index + 1}
        </span>
        <span className={`flex-1 text-sm font-medium leading-relaxed pr-2 ${practiced ? "text-gray-500 line-through decoration-gray-600" : "text-gray-200"}`}>
          {question}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePracticed();
          }}
          title={practiced ? "Mark as not practiced" : "Mark as practiced"}
          className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 mt-0.5 ring-1 ${
            practiced
              ? "bg-emerald-600/20 text-emerald-400 ring-emerald-500/40"
              : "text-gray-600 ring-gray-700 hover:text-gray-400 hover:ring-gray-500"
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
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
      </div>

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
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{ shareUrl: string; shareToken: string } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [doneDays, setDoneDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    interviewApi
      .getReportById(id)
      .then((res) => {
        setReport(res);
        setPracticed(new Set(res.practicedQuestions ?? []));
        setDoneDays(new Set(res.completedDays ?? []));
      })
      .catch(() => setError("Failed to load report."))
      .finally(() => setLoading(false));
  }, [user, id]);

  const togglePracticed = (key: string) => {
    const previous = practiced;
    const next = new Set(previous);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setPracticed(next);
    interviewApi
      .updateProgress(id, { practicedQuestions: Array.from(next) })
      .catch(() => setPracticed(previous));
  };

  const toggleDay = (day: number) => {
    const previous = doneDays;
    const next = new Set(previous);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setDoneDays(next);
    interviewApi
      .updateProgress(id, { completedDays: Array.from(next) })
      .catch(() => setDoneDays(previous));
  };

  const handleDownload = async (customization: ResumeCustomization) => {
    setShowCustomizationModal(false);
    setDownloading(true);
    try {
      await interviewApi.downloadResume(id, customization);
    } catch {
      // silently ignore
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const data = await interviewApi.shareReport(id);
      setShareData(data);
      setShowShareModal(true);
    } catch {
      setError("Failed to share report.");
    } finally {
      setSharing(false);
    }
  };

  const handleUnshare = async () => {
    try {
      await interviewApi.unshareReport(id);
      if (report) {
        setReport({ ...report, isShared: false, shareToken: undefined });
      }
    } catch {
      setError("Failed to unshare report.");
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
  const totalProgressItems =
    report.technicalQuestions.length +
    report.behavioralQuestions.length +
    report.preparationPlan.length;
  const completedProgressItems = practiced.size + doneDays.size;
  const completionPercentage = totalProgressItems
    ? Math.round((completedProgressItems / totalProgressItems) * 100)
    : 0;
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
            {report.isShared ? (
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-600/30 disabled:opacity-50 px-4 py-2 text-sm font-medium transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                Shared
              </button>
            ) : (
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200 disabled:opacity-50 px-4 py-2 text-sm font-medium transition-colors"
              >
                {sharing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400/30 border-t-gray-400" />
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                )}
                Share
              </button>
            )}
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 1 0-.697.972.972 0 0 1-.537-.086 5 5 0 0 1-.99-.21c-.2-.082-.392-.163-.583-.243a5.998 5.998 0 0 1-.45-.721c-.038-.181-.07-.362-.105-.543a1 1 0 0 0-.122-.516A1 1 0 0 0 3 12" />
              </svg>
              Practice Interview
            </button>
            <button
              onClick={() => setShowCoverLetter(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200 px-4 py-2 text-sm font-medium transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              Cover Letter
            </button>
            <button
              onClick={() => setShowCustomizationModal(true)}
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
              Generate Resume
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

        {/* ── Prep Progress ─────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
              Prep Progress
            </p>
            <span className={`text-sm font-bold ${completionPercentage === 100 ? "text-emerald-400" : "text-indigo-400"}`}>
              {completionPercentage}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                completionPercentage === 100
                  ? "bg-emerald-500"
                  : "bg-linear-to-r from-indigo-500 to-violet-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-600">
            {completedProgressItems} of {totalProgressItems} items done · {practiced.size} question
            {practiced.size !== 1 ? "s" : ""} practiced · {doneDays.size} day
            {doneDays.size !== 1 ? "s" : ""} completed
          </p>
        </div>

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
                    key={`${activeSection}-${i}`}
                    index={i}
                    question={q.question}
                    intention={q.intention}
                    answer={q.answer}
                    practiced={practiced.has(`${activeSection}-${i}`)}
                    onTogglePracticed={() => togglePracticed(`${activeSection}-${i}`)}
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
                  {report.preparationPlan.map((plan, idx) => {
                    const dayDone = doneDays.has(plan.day);
                    return (
                    <div key={plan.day} className="relative flex gap-5">
                      {/* Day badge */}
                      <div className="shrink-0 flex flex-col items-center gap-1 z-10">
                        <div className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl text-center ring-1 ${
                          dayDone
                            ? "bg-emerald-600/20 ring-emerald-500/50 text-emerald-400"
                            : idx === 0
                            ? "bg-indigo-600 ring-indigo-500/50 text-white"
                            : "bg-gray-900 ring-gray-800 text-indigo-400"
                        }`}>
                          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Day</span>
                          <span className="text-lg font-bold leading-none">{plan.day}</span>
                        </div>
                      </div>
                      {/* Card */}
                      <div className={`flex-1 rounded-2xl border bg-gray-900/50 transition-colors p-5 mb-0 ${
                        dayDone ? "border-emerald-800/50" : "border-gray-800 hover:border-gray-700"
                      }`}>
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className={`text-base font-semibold ${dayDone ? "text-gray-400" : "text-white"}`}>{plan.focus}</h3>
                          <button
                            onClick={() => toggleDay(plan.day)}
                            className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 transition-colors ${
                              dayDone
                                ? "bg-emerald-600/15 text-emerald-400 ring-emerald-600/40 hover:bg-emerald-600/25"
                                : "text-gray-500 ring-gray-700 hover:bg-gray-800 hover:text-gray-300"
                            }`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            {dayDone ? "Completed" : "Mark done"}
                          </button>
                        </div>
                        <ul className="space-y-2.5">
                          {plan.tasks.map((task, ti) => (
                            <li key={ti} className={`flex items-start gap-3 text-sm ${dayDone ? "text-gray-600" : "text-gray-400"}`}>
                              <svg
                                className={`mt-0.5 h-4 w-4 shrink-0 ${dayDone ? "text-emerald-600" : "text-emerald-500"}`}
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
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <ResumeCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        onDownload={handleDownload}
        loading={downloading}
      />

      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareUrl={shareData.shareUrl}
          shareToken={shareData.shareToken}
        />
      )}

      {showChat && (
        <ChatInterface
          reportId={id}
          onClose={() => setShowChat(false)}
        />
      )}

      {showCoverLetter && (
        <CoverLetterModal
          isOpen={showCoverLetter}
          onClose={() => setShowCoverLetter(false)}
          reportId={id}
        />
      )}
    </div>
  );
}
