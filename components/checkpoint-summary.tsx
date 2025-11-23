"use client";

import { useState } from "react";
import type { Checkpoint } from "@/lib/types/database";

interface CheckpointSummaryProps {
  checkpoint: Checkpoint | null;
  label?: string;
}

export function CheckpointSummary({ checkpoint, label = "Yesterday's Checkpoint" }: CheckpointSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!checkpoint) {
    return null;
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group flex items-center gap-2"
      >
        <span className="text-muted-foreground/50 text-xs transition-transform group-hover:text-foreground">
          {isExpanded ? "▼" : "▶"}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 pl-6 space-y-3 text-sm">
          {checkpoint.completed_summary && (
            <div>
              <p className="font-medium text-xs uppercase text-muted-foreground mb-1">
                Completed
              </p>
              <p className="text-sm">{checkpoint.completed_summary}</p>
            </div>
          )}
          {checkpoint.next_step && (
            <div>
              <p className="font-medium text-xs uppercase text-muted-foreground mb-1">
                Next Step
              </p>
              <p className="text-sm">{checkpoint.next_step}</p>
            </div>
          )}
          {checkpoint.blockers && (
            <div>
              <p className="font-medium text-xs uppercase text-muted-foreground mb-1">
                Blockers
              </p>
              <p className="text-sm">{checkpoint.blockers}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
