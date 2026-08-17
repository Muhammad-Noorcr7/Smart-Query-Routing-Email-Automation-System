import { useEffect, useState } from "react";
import { getPipelineStatus } from "../api";
import PipelineFlow from "../components/pipeline/PipelineFlow";
import PipelineLegend from "../components/pipeline/PipelineLegend";
import NodeDetailModal from "../components/pipeline/NodeDetailModal";
import { SkeletonBlock } from "../components/ui/Skeleton";

export default function PipelineFlowPage() {
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPipelineStatus().then((res) => {
      if (!active) return;
      setPipelineStatus(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading || !pipelineStatus) {
    return (
      <div className="space-y-4">
        <SkeletonBlock className="h-96" />
        <SkeletonBlock className="h-40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13px] text-ink-faint">
        Click any node to see its last-run status, throughput and detail pulled from the
        pipeline's execution log. Lines animate in the direction data actually flows.
      </p>
      <PipelineFlow pipelineStatus={pipelineStatus} onNodeClick={setSelectedNode} />
      <PipelineLegend />
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
