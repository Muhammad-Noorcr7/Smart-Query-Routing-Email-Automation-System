export default function Connector({ width = "w-10", color = "#3538CD", height = 420 }) {
  return (
    <div className="relative shrink-0" style={{ height }}>
      <div className={`relative ${width} shrink-0`} style={{ top: height / 2 }}>
        <div className="absolute left-0 right-0 top-0 h-px -translate-y-1/2 bg-border-strong" />
        <span
          className="travel-dot absolute top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
          style={{ animationDelay: "0s", backgroundColor: color }}
        />
        <span
          className="travel-dot absolute top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
          style={{ animationDelay: "1.1s", backgroundColor: color }}
        />
      </div>
    </div>
  );
}
