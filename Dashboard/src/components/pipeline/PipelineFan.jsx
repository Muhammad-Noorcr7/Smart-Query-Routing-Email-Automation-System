// Draws animated bezier connectors fanning a single node out to N nodes
// (direction="out") or converging N nodes into a single node (direction="in").
export default function PipelineFan({ rows, singleY, height, width = 56, direction = "out" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      style={{ overflow: "visible" }}
    >
      {rows.map((row, i) => {
        const [x1, y1] = direction === "out" ? [0, singleY] : [0, row.y];
        const [x2, y2] = direction === "out" ? [width, row.y] : [width, singleY];
        const cx1 = width * 0.42;
        const cx2 = width * 0.58;
        const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={row.color}
            strokeOpacity={0.55}
            strokeWidth={1.75}
            className="flow-line"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        );
      })}
    </svg>
  );
}
