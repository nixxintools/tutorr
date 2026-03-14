"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/dashboard", label: "📊 Dashboard" },
  { href: "/chat/math", label: "📐 Math" },
  { href: "/chat/reading", label: "📖 Reading" },
  { href: "/chat/science", label: "🔬 Science" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-4">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
              isActive
                ? "bg-[rgba(124,58,237,0.15)] text-violet-200"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
