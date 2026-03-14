"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: "var(--bg-base)" }}
    >
      <h1 className="text-2xl font-semibold" style={{ color: "#fff" }}>Something went wrong</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: 560 }}>
        {error.message || "An unexpected error occurred while rendering this page."}
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl px-4 py-2 text-sm font-medium"
          style={{ background: "var(--grad)", color: "#fff" }}
        >
          Try again
        </button>
        <Link href="/dashboard" className="text-sm font-medium" style={{ color: "#A78BFA" }}>
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
