"use client";

import { useEffect } from "react";
import clsx from "clsx";

type ToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export function Toast({ open, message, onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <div
      className={clsx(
        "fixed bottom-4 right-4 z-[60] rounded-2xl px-4 py-3 text-sm shadow-xl transition-all duration-200",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
      style={{
        background: "var(--bg-card)",
        color: "var(--text)",
        border: "0.5px solid var(--border-md)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
