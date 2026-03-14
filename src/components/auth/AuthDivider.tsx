type AuthDividerProps = {
  text: string;
  className?: string;
  variant?: "default" | "dark";
};

export function AuthDivider({ text, className = "", variant = "default" }: AuthDividerProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={
        isDark
          ? `flex items-center gap-3 my-5 ${className}`.trim()
          : `my-6 flex items-center gap-4 ${className}`.trim()
      }
    >
      {isDark ? (
        <>
          <div className="flex-1 shrink-0" style={{ height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[11px] uppercase whitespace-nowrap text-white/30" style={{ letterSpacing: "0.8px" }}>
            {text}
          </span>
          <div className="flex-1 shrink-0" style={{ height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
        </>
      ) : (
        <>
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-white/30">{text}</span>
          <div className="h-px flex-1 bg-white/10" />
        </>
      )}
    </div>
  );
}
