import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: "var(--bg-base)" }}
    >
      <h1 className="text-2xl font-semibold" style={{ color: "#fff" }}>404 · Page not found</h1>
      <p style={{ color: "var(--text-muted)" }}>The page you were looking for does not exist.</p>
      <Link href="/dashboard" className="text-sm font-medium" style={{ color: "#A78BFA" }}>
        Back to dashboard
      </Link>
    </main>
  );
}
