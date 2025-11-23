"use client";

import { useState } from "react";
import { WorkUnitSwitcher } from "./work-unit-switcher";
import { WorkUnit, WorkUnitWithChecklist } from "@/lib/types/database";
import { ChecklistItems } from "./checklist-items";
import { toggleChecklistItem, updateChecklistItem, deleteChecklistItem } from "@/app/actions/work-units";
import { useTransition } from "react";

interface WorkUnitMultiViewProps {
  workUnits: Array<WorkUnit & { completedCount: number; totalCount: number }>;
  currentWorkUnitId: string | null;
  workUnitsWithChecklists: WorkUnitWithChecklist[];
}

export function WorkUnitMultiView({ workUnits, currentWorkUnitId, workUnitsWithChecklists }: WorkUnitMultiViewProps) {
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [isPending, startTransition] = useTransition();

  const handleToggle = (itemId: string, isDone: boolean) => {
    startTransition(async () => {
      await toggleChecklistItem(itemId, isDone);
    });
  };

  const handleEdit = (itemId: string, newLabel: string) => {
    startTransition(async () => {
      await updateChecklistItem(itemId, newLabel);
    });
  };

  const handleDelete = (itemId: string) => {
    startTransition(async () => {
      // Find the item across all work units to get the work_unit_id
      for (const unit of workUnitsWithChecklists) {
        const item = unit.checklist_items.find(i => i.id === itemId);
        if (item) {
          await deleteChecklistItem(itemId, item.work_unit_id);
          break;
        }
      }
    });
  };

  if (viewMode === 'single') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <WorkUnitSwitcher
              workUnits={workUnits}
              currentWorkUnitId={currentWorkUnitId}
            />
          </div>
          <button
            onClick={() => setViewMode('multi')}
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors ml-4"
          >
            Multi-view
          </button>
        </div>
      </div>
    );
  }

  // Multi-view: Show 2-3 work units in a grid
  const activeUnits = workUnitsWithChecklists.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-muted-foreground">Work Units</h2>
        <button
          onClick={() => setViewMode('single')}
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          Single view
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeUnits.map((unit) => (
          <div key={unit.id} className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-1">{unit.title}</h3>
              <p className="text-xs text-muted-foreground">
                {unit.checklist_items.filter(i => i.is_done).length} / {unit.checklist_items.length}
              </p>
            </div>

            <ChecklistItems
              items={unit.checklist_items}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
