export default function Card({ children, className = "", padded = true, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-[var(--shadow-card)] ${
        padded ? "p-5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
