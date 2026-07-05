import type { ReactNode } from "react";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    text: "Real interview questions from top companies",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    text: "AI-powered feedback on every answer",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    text: "Track your progress over time",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden md:flex md:w-[46%] flex-col justify-between bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-800 p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-8 h-48 w-48 -translate-y-1/2 rounded-full bg-white/5" />

        <Link href="/" className="relative flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">InterviewAI</span>
        </Link>

        <div className="relative space-y-10">
          <div>
            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight">
              Ace your next<br />
              <span className="text-indigo-200">tech interview.</span>
            </h2>
            <p className="mt-4 text-lg text-indigo-200/80 leading-relaxed">
              Practice with AI, get instant feedback, and land the role you&apos;ve been working towards.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3.5 text-indigo-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  {f.icon}
                </span>
                <span className="text-sm leading-snug">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-300/60">
          © {new Date().getFullYear()} InterviewAI. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>

          {/* Mobile-only logo */}
          <Link href="/" className="mb-10 flex items-center gap-3 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">InterviewAI</span>
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
