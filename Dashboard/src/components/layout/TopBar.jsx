import { useEffect, useState } from "react";
import { Menu, RefreshCw } from "lucide-react";

export default function TopBar({ title, subtitle, onMenuClick }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunken lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
            {title}
          </h1>
          {subtitle && <p className="text-[13px] text-ink-faint">{subtitle}</p>}
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-xs text-ink-muted sm:flex">
        <RefreshCw size={12} className="text-ink-faint" />
        <span className="font-mono tabular-nums">
          {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </header>
  );
}
