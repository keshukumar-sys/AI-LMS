"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { WorkflowNode, WorkflowEdge } from "@/lib/mock-data";

const nodeStyles: Record<WorkflowNode["type"], { bg: string; border: string }> = {
  trigger: { bg: "#eef2ff", border: "#6366f1" },
  ai: { bg: "#f5f3ff", border: "#8b5cf6" },
  action: { bg: "#ecfdf5", border: "#10b981" },
  output: { bg: "#fff7ed", border: "#f59e0b" },
};

export function WorkflowViewer({
  nodes: rawNodes,
  edges: rawEdges,
  activeNodeIds,
  height = 320,
}: {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  activeNodeIds?: string[];
  height?: number;
}) {
  const nodes: Node[] = useMemo(
    () =>
      rawNodes.map((n) => {
        const style = nodeStyles[n.type];
        const active = activeNodeIds?.includes(n.id);
        return {
          id: n.id,
          position: { x: n.x, y: n.y },
          data: { label: n.label },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            background: style.bg,
            border: `2px solid ${active ? "#111827" : style.border}`,
            borderRadius: 8,
            padding: 8,
            fontSize: 12,
            fontWeight: 500,
            width: 180,
            boxShadow: active ? "0 0 0 3px rgba(17,24,39,0.15)" : "none",
          },
        };
      }),
    [rawNodes, activeNodeIds]
  );

  const edges: Edge[] = useMemo(
    () =>
      rawEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: activeNodeIds?.includes(e.target),
        markerEnd: { type: MarkerType.ArrowClosed },
      })),
    [rawEdges, activeNodeIds]
  );

  return (
    <div style={{ height }} className="overflow-hidden rounded-lg border bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
