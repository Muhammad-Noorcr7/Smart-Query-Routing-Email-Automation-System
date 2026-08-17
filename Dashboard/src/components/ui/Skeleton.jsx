export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      <SkeletonLine className="h-3 w-24" />
      <SkeletonLine className="mt-4 h-7 w-16" />
      <SkeletonLine className="mt-3 h-3 w-32" />
    </div>
  );
}

export function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <SkeletonLine className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonBlock({ className = "h-64" }) {
  return (
    <div className={`skeleton rounded-lg ${className}`} />
  );
}
