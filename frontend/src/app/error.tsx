"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Try Again
      </button>
    </div>
  );
}
