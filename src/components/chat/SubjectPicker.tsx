import type { Subject } from "@/lib/supabase/types";
import clsx from "clsx";

type SubjectPickerProps = {
  subject: Subject;
  onSelect: (s: Subject) => void;
};

const SUBJECT_OPTIONS: {
  key: Subject;
  label: string;
  active: string;
  inactive: string;
}[] = [
  {
    key: "math",
    label: "📐 Math",
    active: "bg-blue-600 text-white",
    inactive: "bg-[rgba(255,255,255,0.05)] text-white/60 hover:bg-[rgba(255,255,255,0.08)]",
  },
  {
    key: "reading",
    label: "📖 Reading",
    active: "bg-emerald-600 text-white",
    inactive: "bg-[rgba(255,255,255,0.05)] text-white/60 hover:bg-[rgba(255,255,255,0.08)]",
  },
  {
    key: "science",
    label: "🔬 Science",
    active: "bg-amber-600 text-white",
    inactive: "bg-[rgba(255,255,255,0.05)] text-white/60 hover:bg-[rgba(255,255,255,0.08)]",
  },
];

export function SubjectPicker({ subject, onSelect }: SubjectPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {SUBJECT_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onSelect(option.key)}
          className={clsx(
            "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            subject === option.key ? option.active : option.inactive
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
