type Role = "student" | "teacher" | "parent";

const ROLE_CONFIG: Record<
  Role,
  { icon: string; label: string; color: string; bg: string; border: string }
> = {
  student: {
    icon: "🎒",
    label: "Student",
    color: "text-violet-200",
    bg: "bg-[rgba(124,58,237,0.12)]",
    border: "border-[rgba(124,58,237,0.32)]",
  },
  teacher: {
    icon: "👩‍🏫",
    label: "Teacher",
    color: "text-emerald-200",
    bg: "bg-[rgba(5,150,105,0.1)]",
    border: "border-[rgba(5,150,105,0.3)]",
  },
  parent: {
    icon: "👨‍👩‍👧",
    label: "Parent",
    color: "text-amber-200",
    bg: "bg-[rgba(217,119,6,0.1)]",
    border: "border-[rgba(217,119,6,0.3)]",
  },
};

export function RoleBadge({ role, size = "md" }: { role: Role; size?: "sm" | "md" | "lg" }) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.student;
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.color} ${config.border} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
