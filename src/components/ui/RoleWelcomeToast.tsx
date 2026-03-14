"use client";

import { useEffect, useState } from "react";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

export function RoleWelcomeToast({ role, name }: { role: string; name: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("role_toast_shown");
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem("role_toast_shown", "true");
      setTimeout(() => setVisible(false), 4000);
    }
  }, []);

  if (!visible) return null;

  const roleConfig = {
    student: { icon: "🎒", border: "rgba(124,58,237,0.4)", bg: "rgba(124,58,237,0.1)" },
    teacher: { icon: "👩‍🏫", border: "rgba(5,150,105,0.4)", bg: "rgba(5,150,105,0.08)" },
    parent: { icon: "👨‍👩‍👧", border: "rgba(217,119,6,0.4)", bg: "rgba(217,119,6,0.08)" },
  };
  const key = role as keyof typeof roleConfig;
  const config = roleConfig[key] ?? roleConfig.student;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ background: config.bg, borderColor: config.border, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
    >
      <span className="text-2xl">{config.icon}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#fff" }}>Signed in as {role}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Welcome back, {name}!</p>
        <div className="mt-1"><RoleBadge role={(key === "student" || key === "teacher" || key === "parent" ? key : "student")} size="sm" /></div>
      </div>
      <button onClick={() => setVisible(false)} className="ml-2 text-lg leading-none" style={{ color: "rgba(255,255,255,0.3)" }}>
        ×
      </button>
    </div>
  );
}
