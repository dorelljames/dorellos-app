"use client";

import Link from "next/link";
import { useSetTodayWorkUnit } from "@/lib/hooks/use-today";
import type { WorkUnit } from "@/lib/types/database";

interface WorkUnitSwitcherProps {
  workUnits: Array<WorkUnit & { completedCount: number; totalCount: number }>;
  currentWorkUnitId: string | null;
}

export function WorkUnitSwitcher({ workUnits, currentWorkUnitId }: WorkUnitSwitcherProps) {
  const setWorkUnit = useSetTodayWorkUnit();

  const handleSwitch = (workUnitId: string) => {
    // TanStack Query will automatically update the UI via cache invalidation
    setWorkUnit.mutate(workUnitId);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {workUnits.map((wu) => {
        const isActive = wu.id === currentWorkUnitId;
        return (
          <button
            key={wu.id}
            onClick={() => handleSwitch(wu.id)}
            disabled={setWorkUnit.isPending}
            className={`
              flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all min-w-[140px]
              ${isActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <div className="text-left">
              <p className={`font-medium text-sm truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {wu.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {wu.completedCount}/{wu.totalCount} {wu.completedCount === wu.totalCount ? '✓' : ''}
              </p>
            </div>
          </button>
        );
      })}

      <Link href="/work-units/new">
        <button className="flex-shrink-0 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-all min-w-[140px]">
          <p className="text-sm text-muted-foreground">+ New</p>
        </button>
      </Link>
    </div>
  );
}
