"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

type ParentChild = {
  id: string;
  fullName: string;
};

type ParentShellProps = {
  children: ReactNode;
  fullName: string;
  subscriptionTier: "free" | "pro";
  childrenNav: ParentChild[];
  role: "student" | "teacher" | "parent";
  profile?: Record<string, unknown> | null;
};

const REPORT_LINKS = [
  { href: "/dashboard", icon: "🏠", label: "Overview" },
  { href: "/dashboard/reports/weekly", icon: "📊", label: "Weekly Report" },
  { href: "/dashboard/conversations", icon: "💬", label: "Conversation Log" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

function ChildLinks({ items, onNavigate }: { items: ParentChild[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-1 px-4">
      {items.map((child, index) => {
        const href = `/dashboard/child/${child.id}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        const colorStyle = [
          { background: "rgba(217,119,6,0.15)", color: "#FDE68A" },
          { background: "rgba(249,115,22,0.15)", color: "#FDBA74" },
          { background: "rgba(234,179,8,0.15)", color: "#FDE047" },
        ][index % 3];

        return (
          <Link
            key={child.id}
            href={href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              ""
            )}
            style={
              active
                ? { background: "rgba(217,119,6,0.1)", color: "#FDE68A" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
              style={colorStyle}
            >
              {child.fullName.charAt(0).toUpperCase()}
            </span>
            <span className="truncate">{child.fullName}</span>
          </Link>
        );
      })}

      <Link
        href="/dashboard/children"
        onClick={onNavigate}
        className="mt-1 block rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
        style={{ color: "#FDE68A" }}
      >
        ➕ Add Child
      </Link>
    </div>
  );
}

function ReportLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-1 px-4">
      {REPORT_LINKS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
              active
                ? { background: "rgba(217,119,6,0.1)", color: "#FDE68A" }
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

export function ParentShell({ children, fullName, subscriptionTier, childrenNav, role }: ParentShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = useMemo(
    () =>
      fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "P",
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: "#fff" }}>{fullName}</p>
              <p className="mb-1 mt-1 text-xs" style={{ color: "var(--text-faint)" }}>Logged in as</p>
              <RoleBadge role={role} size="sm" />
            </div>
          </div>
        </div>

        <p className="mb-2 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>MY CHILDREN</p>
        <ChildLinks items={childrenNav} />

        <p className="mb-2 mt-6 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>REPORTS</p>
        <ReportLinks />

        <div className="mt-auto p-4" style={{ borderTop: "0.5px solid var(--border)" }}>
          <div className="mb-4 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>Current Plan</p>
            <p className="text-sm font-semibold uppercase" style={{ color: "#fff" }}>{subscriptionTier}</p>
          </div>
          {subscriptionTier === "free" ? (
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
              <p className="font-semibold">⚡ Upgrade for Family Pro</p>
              <p className="mt-1 text-xs text-white/80">Unlock detailed reports and unlimited sessions</p>
              <Link
                href="/upgrade"
                className="mt-3 block rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white"
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold" style={{ background: "rgba(217,119,6,0.15)", color: "#FDE68A" }}>
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

            <p className="mb-2 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>MY CHILDREN</p>
            <ChildLinks items={childrenNav} onNavigate={() => setMobileOpen(false)} />

            <p className="mb-2 mt-6 px-4 text-xs font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>REPORTS</p>
            <ReportLinks onNavigate={() => setMobileOpen(false)} />

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
