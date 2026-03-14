"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import clsx from "clsx";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function MobileNav({ open, onClose, title, children }: MobileNavProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close mobile navigation overlay"
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <p className="text-base font-bold" style={{ color: "#fff" }}>{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-3">{children}</div>
      </aside>
    </>
  );
}
