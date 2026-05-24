"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

/* ── tiny icon components ─────────────────────────────────────── */

const LogoIcon = () => (
  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);


const LogoutIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

const GridIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

/* ── navbar ───────────────────────────────────────────────────── */
export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ───────────────────────────────────────── */}
        <Link href="/" className="flex shrink-0 items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
            <LogoIcon />
          </div>
          <span
            className="text-base font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            InterviewAI
          </span>
        </Link>

        {/* ── Centre links — always the same ──────────────── */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-1">
          <a
            href="#features"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-indigo-200/75 hover:text-white hover:bg-white/5 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-indigo-200/75 hover:text-white hover:bg-white/5 transition-colors"
          >
            How it works
          </a>
        </div>

        {/* ── Right actions ────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3">

          {loading ? (
            /* skeleton */
            <>
              <div className="hidden sm:block w-32 h-8 rounded-xl animate-pulse bg-white/10" />
              <div className="w-8 h-8 rounded-full animate-pulse bg-white/10" />
            </>

          ) : user ? (
            /* ── logged-in right ── */
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm shadow-indigo-900/60"
              >
                <GridIcon />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-white/20 text-indigo-200 hover:bg-white/5 transition-colors"
              >
                <LogoutIcon />
                Logout
              </button>
            </>

          ) : (
            /* ── guest right ── */
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-indigo-200/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm shadow-indigo-900"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
