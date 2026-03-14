"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

type StudentShellProps = {
  children: ReactNode;
  fullName: string;
  gradeLevel: string;
  subscriptionTier: "free" | "pro";
  role: "student" | "teacher" | "parent";
  profile?: Record<string, unknown> | null;
};

type NavItem = {
  href: string;
  icon: string;
  label: string;
  locked?: boolean;
};

const LEARN_LINKS: NavItem[] = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/chat/math", icon: "📐", label: "Math" },
  { href: "/chat/reading", icon: "📖", label: "Reading" },
  { href: "/chat/science", icon: "🔬", label: "Science" },
  { href: "/chat/writing", icon: "✍️", label: "Writing", locked: true },
];

const PROGRESS_LINKS: NavItem[] = [
  { href: "/dashboard/progress", icon: "📊", label: "My Progress" },
  { href: "/dashboard/achievements", icon: "🏆", label: "Achievements", locked: true },
];

function NavLinks({ links, tier, onNavigate }: { links: NavItem[]; tier: "free" | "pro"; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-1 px-4">
      {links.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const isLocked = item.locked && tier === "free";

        if (isLocked) {
          return (
            <div
              key={item.href}
              className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <span>🔒</span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              ""
            )}
            style={
              isActive
                ? { background: "rgba(124,58,237,0.15)", color: "#C4B5FD" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function StudentShell({ children, fullName, gradeLevel, subscriptionTier, role }: StudentShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = useMemo(
    () =>
      fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U",
    [fullName]
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <aside className="hidden w-72 flex-col md:flex" style={{ background: "var(--bg-surface)", borderRight: "0.5px solid var(--border)" }}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🎓
            </div>
            <span style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>
              TutorAI
            </span>
          </Link>
        </div>

        <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: "#fff" }}>{fullName}</p>
              <p className="mb-1 mt-1 text-xs" style={{ color: "var(--text-faint)" }}>Logged in as</p>
              <RoleBadge role={role} size="sm" />
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(124,58,237,0.12)", color: "#C4B5FD" }}>
                  {gradeLevel}
                </span>
                {subscriptionTier === "pro" ? (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    PRO
                  </span>
                ) : (
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>FREE</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mb-2 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>LEARN</p>
        <NavLinks links={LEARN_LINKS} tier={subscriptionTier} />

        <p className="mb-2 mt-6 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>PROGRESS</p>
        <NavLinks links={PROGRESS_LINKS} tier={subscriptionTier} />

        <div className="mt-auto p-4" style={{ borderTop: "0.5px solid var(--border)" }}>
          {subscriptionTier === "free" ? (
            <div
              className="mb-4 rounded-2xl p-4 text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)" }}
            >
              <p className="font-semibold">⚡ Upgrade to Pro</p>
              <p className="mt-1 text-xs text-white/80">Unlock all subjects + unlimited chats</p>
              <Link
                href="/upgrade"
                className="mt-3 block w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Upgrade Now
              </Link>
            </div>
          ) : null}
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden" style={{ background: "var(--bg-surface)", borderBottom: "0.5px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5"
            style={{ color: "rgba(255,255,255,0.6)" }}
            aria-label="Open menu"
          >
            ☰
          </button>
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,#7C3AED,#2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🎓
            </div>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
              TutorAI
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <RoleBadge role={role} size="sm" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "rgba(124,58,237,0.15)", color: "#C4B5FD" }}>
              {initials}
            </div>
          </div>
        </header>

        <div className="md:hidden">
          <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} title="TutorAI">
            <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--border)" }}>
              <p className="text-sm font-semibold" style={{ color: "#fff" }}>{fullName}</p>
              <p className="mb-1 mt-2 text-xs" style={{ color: "var(--text-faint)" }}>Logged in as</p>
              <RoleBadge role={role} size="sm" />
            </div>
            <p className="mb-2 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>LEARN</p>
            <NavLinks links={LEARN_LINKS} tier={subscriptionTier} onNavigate={() => setMobileOpen(false)} />
            <p className="mb-2 mt-6 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>PROGRESS</p>
            <NavLinks
              links={PROGRESS_LINKS}
              tier={subscriptionTier}
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="mt-6 px-4 pt-4" style={{ borderTop: "0.5px solid var(--border)" }}>
              <SignOutButton />
            </div>
          </MobileNav>
        </div>

        <main className="flex-1 overflow-auto" style={{ background: "var(--bg-base)" }}>{children}</main>
      </div>
    </div>
  );
}
