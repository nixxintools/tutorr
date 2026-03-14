"use client";

import clsx from "clsx";

type Role = "student" | "teacher" | "parent";

type RoleSelectorProps = {
  selectedRole: string | null;
  onSelect: (role: Role) => void;
};

const roleOptions: {
  value: Role;
  label: string;
  sublabel: string;
  iconBg: string;
  iconColor: string;
  selectedClass: string;
  hoverClass: string;
  icon: JSX.Element;
}[] = [
  {
    value: "student",
    label: "Student",
    sublabel: "I'm here to learn",
    iconBg: "bg-[rgba(255,255,255,0.08)]",
    iconColor: "text-violet-300",
    selectedClass: "border-violet-500 bg-[rgba(124,58,237,0.12)] shadow-sm scale-[1.02]",
    hoverClass: "hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        <path d="M20 21c0-4.42-3.58-8-8-8s-8 3.58-8 8" />
        <path d="M9 10h.01M15 10h.01" strokeLinecap="round" />
        <path d="M8 17s1 1 4 1 4-1 4-1" />
      </svg>
    ),
  },
  {
    value: "teacher",
    label: "Teacher",
    sublabel: "I teach students",
    iconBg: "bg-[rgba(255,255,255,0.08)]",
    iconColor: "text-emerald-300",
    selectedClass: "border-emerald-500 bg-[rgba(5,150,105,0.1)] shadow-sm scale-[1.02]",
    hoverClass: "hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="12" rx="2" />
        <path d="M8 21h8M12 15v6" />
        <path d="M7 8h3M7 11h5" strokeLinecap="round" />
        <circle cx="16" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "parent",
    label: "Parent",
    sublabel: "Monitoring my child",
    iconBg: "bg-[rgba(255,255,255,0.08)]",
    iconColor: "text-amber-200",
    selectedClass: "border-amber-500 bg-[rgba(217,119,6,0.1)] shadow-sm scale-[1.02]",
    hoverClass: "hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21c0-3.31 2.69-6 6-6s6 2.69 6 6" />
        <circle cx="18" cy="9" r="2" />
        <path d="M15 21c0-2.21 1.34-4 3-4s3 1.79 3 4" />
      </svg>
    ),
  },
];

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {roleOptions.map((role) => {
        const selected = selectedRole === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onSelect(role.value)}
            className={clsx(
              "cursor-pointer rounded-2xl border p-3 text-center transition-all duration-150",
              selected
                ? `border-2 ${role.selectedClass}`
                : `border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] ${role.hoverClass}`
            )}
          >
            <div
              className={clsx(
                "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl",
                role.iconBg,
                role.iconColor
              )}
            >
              {role.icon}
            </div>
            <p className="mt-2 text-sm font-semibold text-white/75">{role.label}</p>
            <p className="text-xs text-white/25">{role.sublabel}</p>
          </button>
        );
      })}
    </div>
  );
}
