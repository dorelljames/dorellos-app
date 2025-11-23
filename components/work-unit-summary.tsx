"use client";

// Collapsible Work Unit summary for Today page
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MarkdownDisplay } from "@/components/markdown-display";
import type { WorkUnit } from "@/lib/types/database";

interface WorkUnitSummaryProps {
  workUnit: WorkUnit;
}

const statusLabels = {
  active: "Active",
  parked: "Parked",
  completed: "Completed",
  archived: "Archived",
};

export function WorkUnitSummary({ workUnit }: WorkUnitSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group"
      >
        <div className="flex items-start gap-3">
          <span className="text-muted-foreground/40 text-xs mt-0.5 transition-all group-hover:text-muted-foreground">
            {isExpanded ? "▼" : "▶"}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg break-words">{workUnit.title}</h2>
            {!isExpanded && (
              <Badge variant="outline" className="mt-1.5 text-xs opacity-60">
                {statusLabels[workUnit.status]}
              </Badge>
            )}
          </div>
        </div>
      </button>

      {isExpanded && (workUnit.outcome || workUnit.done_when) && (
        <div className="pl-6 space-y-4 text-sm">
          {workUnit.outcome && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground/60">Outcome</p>
              <MarkdownDisplay content={workUnit.outcome} />
            </div>
          )}
          {workUnit.done_when && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground/60">Done when</p>
              <MarkdownDisplay content={workUnit.done_when} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
