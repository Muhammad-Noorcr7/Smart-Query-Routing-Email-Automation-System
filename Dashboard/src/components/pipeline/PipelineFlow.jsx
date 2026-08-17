import PipelineNode from "./PipelineNode";
import Connector from "./Connector";
import PipelineFan from "./PipelineFan";
import { DEPARTMENTS, DEPARTMENT_HEX, NODE_TYPE_HEX } from "../../utils/constants";

const TRUNK_HEIGHT = 420;
const CARD_H = 56;
const GAP = 12;

function rowCenters(count, containerHeight = TRUNK_HEIGHT, cardHeight = CARD_H, gap = GAP) {
  const totalContent = count * cardHeight + (count - 1) * gap;
  const top = (containerHeight - totalContent) / 2;
  return Array.from({ length: count }, (_, i) => top + i * (cardHeight + gap) + cardHeight / 2);
}

function Stage({ nodes, onNodeClick, containerHeight = TRUNK_HEIGHT }) {
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-center gap-3"
      style={{ height: containerHeight }}
    >
      {nodes.map((node) => (
        <PipelineNode key={node.id} node={node} onClick={onNodeClick} />
      ))}
    </div>
  );
}

function findNode(nodes, id) {
  return nodes.find((n) => n.id === id);
}

export default function PipelineFlow({ pipelineStatus, onNodeClick }) {
  const mainNodes = pipelineStatus.main.nodes;
  const escNodes = pipelineStatus.escalation.nodes;

  const branchIds = [
    "branch-exam",
    "branch-finance",
    "branch-registrar",
    "branch-it",
    "branch-instructor",
    "branch-admin",
  ];
  const branchNodes = branchIds.map((id) => findNode(mainNodes, id));
  const branchColors = DEPARTMENTS.map((d) => DEPARTMENT_HEX[d]);
  const branchRows = rowCenters(6);
  const singleY = rowCenters(1)[0];

  const parallelNodes = ["apply-label", "mark-read"].map((id) => findNode(mainNodes, id));
  const parallelRows = rowCenters(2);
  const actionColor = NODE_TYPE_HEX.action;
  const gmailColor = NODE_TYPE_HEX.gmail;

  return (
    <div className="space-y-10">
      {/* ---- Main pipeline ---- */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="font-display text-sm font-semibold text-ink">Main routing pipeline</h3>
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
            every 5 min
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface-sunken/40 p-6">
          <div className="flex w-max items-stretch">
            <Stage nodes={[findNode(mainNodes, "schedule")]} onNodeClick={onNodeClick} />
            <Connector color={NODE_TYPE_HEX.trigger} />
            <Stage nodes={[findNode(mainNodes, "read-inbox")]} onNodeClick={onNodeClick} />
            <Connector color={gmailColor} />
            <Stage nodes={[findNode(mainNodes, "emails-found")]} onNodeClick={onNodeClick} />
            <Connector color={NODE_TYPE_HEX.trigger} />
            <Stage nodes={[findNode(mainNodes, "gemini")]} onNodeClick={onNodeClick} />
            <Connector color={NODE_TYPE_HEX.ai} />
            <Stage nodes={[findNode(mainNodes, "parse")]} onNodeClick={onNodeClick} />
            <Connector color={NODE_TYPE_HEX.ai} />
            <Stage nodes={[findNode(mainNodes, "route")]} onNodeClick={onNodeClick} />

            <PipelineFan
              direction="out"
              singleY={singleY}
              height={TRUNK_HEIGHT}
              rows={branchRows.map((y, i) => ({ y, color: branchColors[i] }))}
            />
            <Stage nodes={branchNodes} onNodeClick={onNodeClick} />
            <PipelineFan
              direction="in"
              singleY={singleY}
              height={TRUNK_HEIGHT}
              rows={branchRows.map((y, i) => ({ y, color: branchColors[i] }))}
            />

            <Stage nodes={[findNode(mainNodes, "merge")]} onNodeClick={onNodeClick} />

            <PipelineFan
              direction="out"
              singleY={singleY}
              height={TRUNK_HEIGHT}
              rows={parallelRows.map((y) => ({ y, color: actionColor }))}
            />
            <Stage nodes={parallelNodes} onNodeClick={onNodeClick} />
            <PipelineFan
              direction="in"
              singleY={singleY}
              height={TRUNK_HEIGHT}
              rows={parallelRows.map((y) => ({ y, color: actionColor }))}
            />

            <Stage nodes={[findNode(mainNodes, "save-supabase")]} onNodeClick={onNodeClick} />
          </div>
        </div>
      </div>

      {/* ---- Escalation pipeline ---- */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="font-display text-sm font-semibold text-ink">Escalation pipeline</h3>
          <span className="rounded-full bg-status-escalated-soft px-2 py-0.5 text-[11px] font-medium text-status-escalated">
            every 24h
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface-sunken/40 p-6">
          <div className="flex w-max items-stretch">
            <Stage
              nodes={[findNode(escNodes, "schedule-24h")]}
              onNodeClick={onNodeClick}
              containerHeight={80}
            />
            <Connector color={NODE_TYPE_HEX.trigger} height={80} />
            <Stage
              nodes={[findNode(escNodes, "fetch-overdue")]}
              onNodeClick={onNodeClick}
              containerHeight={80}
            />
            <Connector color={NODE_TYPE_HEX.db} height={80} />
            <Stage
              nodes={[findNode(escNodes, "email-hod")]}
              onNodeClick={onNodeClick}
              containerHeight={80}
            />
            <Connector color={NODE_TYPE_HEX.escalation} height={80} />
            <Stage
              nodes={[findNode(escNodes, "update-status")]}
              onNodeClick={onNodeClick}
              containerHeight={80}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
