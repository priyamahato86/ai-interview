"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const DELIVERABLES = [
  { label: "Match Score", icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { label: "Technical Questions", icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" },
  { label: "Behavioral Questions", icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
  { label: "Skill Gap Analysis", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" },
  { label: "7-Day Prep Plan", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" },
  { label: "ATS Resume", icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
];

export default function GeneratePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PROGRESS_STEPS = [
    { label: "Analyzing job requirements", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" },
    { label: "Comparing with your profile", icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" },
    { label: "Generating questions", icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" },
    { label: "Building prep plan", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" },
  ];

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  const DRAFT_KEY = "generate-form-draft";

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as { jobDescription?: string; selfDescription?: string };
      if (draft.jobDescription) setJobDescription(draft.jobDescription);
      if (draft.selfDescription) setSelfDescription(draft.selfDescription);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (!jobDescription && !selfDescription) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ jobDescription, selfDescription }));
  }, [jobDescription, selfDescription]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
    else setError("Only PDF files are accepted.");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      setError("Please upload a resume or provide a self-description.");
      return;
    }

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    if (selfDescription.trim()) formData.append("selfDescription", selfDescription);
    if (resumeFile) formData.append("resume", resumeFile);

    setSubmitting(true);
    setProgressStep(0);

    // Animate progress steps
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => Math.min(prev + 1, PROGRESS_STEPS.length - 1));
    }, 3000);

    try {
      const res = await api.post<{
        message: string;
        interviewReport: { _id: string };
      }>("/interview-reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      clearInterval(progressInterval);
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/dashboard/report/${res.data.interviewReport._id}`);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to generate report. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
      setProgressStep(0);
    }
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

      {/* ── Sticky topbar ── */}
      <div className="sticky top-0 z-20 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-sm font-medium text-gray-300">Generate Report</span>
          </div>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">1</span>
            <span className="text-gray-400">Fill Details</span>
            <span className="h-px w-6 bg-gray-800" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-gray-600 text-[10px] font-bold">2</span>
            <span>AI Analysis</span>
            <span className="h-px w-6 bg-gray-800" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-gray-600 text-[10px] font-bold">3</span>
            <span>Your Report</span>
          </div>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-indigo-900/30 bg-linear-to-br from-indigo-950 via-indigo-900/60 to-gray-950">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 right-0 h-125 w-125 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="pointer-events-none absolute top-0 left-0 h-48 w-48 rounded-full bg-indigo-800/20 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 text-center">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-white/15 px-4 py-1.5 mb-6">
            <svg className="h-3.5 w-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">AI-Powered Interview Strategy</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Create Your Custom{" "}
            <span className="text-indigo-300">Interview Plan</span>
          </h1>

          <p className="mx-auto max-w-lg text-base text-indigo-200/60 leading-relaxed mb-8">
            Let our AI analyze the job requirements and your unique profile to build a winning, personalized strategy.
          </p>

          {/* Deliverables row */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {DELIVERABLES.map((d) => (
              <div
                key={d.label}
                className="flex items-center gap-2 rounded-xl bg-white/6 ring-1 ring-white/10 px-3.5 py-1.5"
              >
                <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={d.icon} />
                </svg>
                <span className="text-xs font-medium text-indigo-100/80">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-900/15 px-4 py-3.5 text-sm text-red-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── LEFT: Job Description ── */}
            <div className="flex flex-col rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-900/80 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-gray-800/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-600/30">
                    <svg className="h-4.5 w-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Target Job Description</p>
                    <p className="text-xs text-gray-600 mt-0.5">Paste the full JD for best results</p>
                  </div>
                </div>
                <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 ring-1 ring-rose-500/25">
                  Required
                </span>
              </div>

              {/* Textarea */}
              <div className="flex-1 p-5">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here…&#10;&#10;Include:&#10;• Responsibilities and day-to-day tasks&#10;• Required technical skills and tools&#10;• Years of experience needed&#10;• Team structure and culture notes"
                  className="h-full min-h-80 w-full resize-none rounded-xl border border-gray-700/80 bg-gray-800/50 px-4 py-3.5 text-sm leading-relaxed text-gray-200 placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>

              {/* Tips footer */}
              <div className="border-t border-gray-800/60 bg-gray-900/60 px-6 py-3">
                <p className="text-[11px] text-gray-600">
                  💡 <span className="text-gray-500">Tip:</span> Include the full JD — responsibilities, required skills, and any nice-to-haves for the highest match accuracy.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Your Profile ── */}
            <div className="flex flex-col rounded-2xl border border-gray-800 bg-linear-to-b from-gray-900 to-gray-900/80 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 border-b border-gray-800/80 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-600/30">
                  <svg className="h-4.5 w-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Your Profile</p>
                  <p className="text-xs text-gray-600 mt-0.5">Resume or quick description</p>
                </div>
              </div>

              <div className="flex-1 p-5 space-y-5">
                {/* Resume upload section */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Upload Resume</p>
                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/25">
                      Best Results
                    </span>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-9 transition-all duration-200 ${
                      dragOver
                        ? "border-indigo-500 bg-indigo-500/8 scale-[1.01]"
                        : resumeFile
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-gray-700 bg-gray-800/30 hover:border-indigo-500/40 hover:bg-gray-800/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />

                    {resumeFile ? (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
                          <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-400">{resumeFile.name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click to replace
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${dragOver ? "bg-indigo-500/20 ring-1 ring-indigo-500/40" : "bg-gray-800 ring-1 ring-gray-700"}`}>
                          <svg className={`h-6 w-6 transition-colors ${dragOver ? "text-indigo-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-400">
                            {dragOver ? "Drop it here!" : "Click to upload or drag & drop"}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">PDF only · Max 3 MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-800" />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-[10px] font-semibold text-gray-600">OR</span>
                  <div className="flex-1 border-t border-gray-800" />
                </div>

                {/* Self description */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Quick Self-Description</p>
                  <textarea
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Briefly describe yourself…&#10;&#10;e.g. 5 years of backend experience with Node.js and PostgreSQL. Led a team of 3. Strong in system design and REST APIs."
                    rows={6}
                    className="w-full resize-none rounded-xl border border-gray-700/80 bg-gray-800/50 px-4 py-3.5 text-sm leading-relaxed text-gray-200 placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Tips footer */}
              <div className="border-t border-gray-800/60 bg-gray-900/60 px-6 py-3">
                <p className="text-[11px] text-gray-600">
                  💡 <span className="text-gray-500">Tip:</span> Resume gives the most accurate analysis. Use self-description only if you don&apos;t have one handy.
                </p>
              </div>
            </div>
          </div>

          {/* ── Submit section ── */}
          <div className="mt-8 flex flex-col items-center gap-5">
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-12 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-900/60 transition-all hover:bg-indigo-500 hover:shadow-indigo-900/80 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {/* Shimmer effect */}
              {!submitting && (
                <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
              )}

              {submitting ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span className="flex items-center gap-2">
                      {PROGRESS_STEPS[progressStep].label}
                      <svg className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={PROGRESS_STEPS[progressStep].icon} />
                      </svg>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                  Generate My Interview Plan
                </>
              )}
            </button>

            {/* Trust row */}
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              {[
                { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", text: "Ready in ~60 seconds" },
                { icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", text: "Your data is private" },
                { icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z", text: "ATS-friendly resume included" },
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", text: "No credit card needed" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-xs text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
