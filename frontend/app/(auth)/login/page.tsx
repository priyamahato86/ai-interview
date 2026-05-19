import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — InterviewAI",
  description: "Sign in to your InterviewAI account and continue your interview preparation.",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account to continue.
        </p>
      </div>
      <LoginForm />
    </>
  );
}
