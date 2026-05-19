import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account — InterviewAI",
  description: "Create your InterviewAI account and start preparing for your next interview.",
};

export default function SignupPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Start your interview preparation journey today.
        </p>
      </div>
      <SignupForm />
    </>
  );
}
