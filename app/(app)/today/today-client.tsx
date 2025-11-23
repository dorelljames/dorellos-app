"use client";

import Link from "next/link";
import { useTodayDay, useMonthlyStreaks } from "@/lib/hooks/use-today";
import { useActiveWorkUnitsWithCounts, useActiveWorkUnitsWithChecklists, useWorkUnit } from "@/lib/hooks/use-work-units";
import { StreakBadge } from "@/components/streak-badge";
import { WeeklyMomentum } from "@/components/weekly-momentum";
import { WorkUnitMultiView } from "@/components/work-unit-multi-view";
import { WorkUnitSummary } from "@/components/work-unit-summary";
import { CheckpointSummary } from "@/components/checkpoint-summary";
import { Button } from "@/components/ui/button";
import { TodayChecklistToggle } from "./checklist-toggle";
import { TodayIntentSave } from "./intent-save";
import { TodayHorizonSave } from "./horizon-save";

export function TodayClient() {
  // Fetch all data using TanStack Query
  const { data: todayData, isLoading: todayLoading } = useTodayDay();
  const { data: streaks, isLoading: streaksLoading } = useMonthlyStreaks();
  const { data: workUnitsWithCounts = [], isLoading: countsLoading } = useActiveWorkUnitsWithCounts();
  const { data: workUnitsWithChecklists = [], isLoading: checklistsLoading } = useActiveWorkUnitsWithChecklists();
  const { data: workUnitWithChecklist, isLoading: currentWorkUnitLoading } = useWorkUnit(
    todayData?.selected_work_unit_id || undefined
  );

  const hasWorkUnit = !!workUnitWithChecklist;
  const hasCheckpoint = !!todayData?.checkpoint;

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Show loading state while initial data loads
  if (todayLoading || streaksLoading || countsLoading || checklistsLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">{dateString}</h1>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-12">
      {/* Large Date Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">{dateString}</h1>
      </div>

      {/* Close Day Button - Top Right */}
      <div className="absolute top-6 right-20 z-40">
        <Link href="/checkpoint">
          <Button variant="ghost" size="sm" className="opacity-30 hover:opacity-100 transition-opacity">
            {hasCheckpoint ? "Update Checkpoint" : "Close Day"}
          </Button>
        </Link>
      </div>

      {/* Metrics Row - Weekly Momentum (left, full width) and Streaks (right, stacked) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start gap-6">
        {/* Left: Weekly Momentum - takes most space */}
        <div className="flex-1">
          <WeeklyMomentum />
        </div>

        {/* Right: Streaks - vertically stacked */}
        {streaks && (
          <div className="flex-shrink-0">
            <StreakBadge streaks={streaks} />
          </div>
        )}
      </div>

      {/* Daily Intent */}
      {todayData && (
        <div className="mb-12">
          <TodayIntentSave dayId={todayData.id} initialIntent={todayData.daily_intent} />
        </div>
      )}

      {/* Horizon Block */}
      {todayData && (
        <div className="mb-12">
          <TodayHorizonSave
            dayId={todayData.id}
            horizons={{
              weekly: todayData.weekly_horizon,
              monthly: todayData.monthly_horizon,
              yearly: todayData.yearly_horizon,
              direction: todayData.direction_horizon,
            }}
          />
        </div>
      )}

      {/* Work Unit Multi-View */}
      <div className="mb-12">
        {workUnitsWithCounts.length > 0 ? (
          <WorkUnitMultiView
            workUnits={workUnitsWithCounts}
            currentWorkUnitId={todayData?.selected_work_unit_id || null}
            workUnitsWithChecklists={workUnitsWithChecklists}
          />
        ) : (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No Work Units yet. Create one to get started.
            </p>
            <Link href="/work-units/new">
              <Button>Create Work Unit</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Current Work Unit Focus */}
      {hasWorkUnit && workUnitWithChecklist && (
        <div className="mt-6 space-y-8">
          {/* Work Unit Header */}
          <div>
            <WorkUnitSummary workUnit={workUnitWithChecklist} />
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              {workUnitWithChecklist.checklist_items.length > 0 && (
                <span className="text-xs text-muted-foreground/60">
                  {workUnitWithChecklist.checklist_items.filter((i) => i.is_done).length} /{" "}
                  {workUnitWithChecklist.checklist_items.length}
                </span>
              )}
            </div>
            <TodayChecklistToggle items={workUnitWithChecklist.checklist_items} />
          </div>

          {/* Yesterday's Checkpoint (Expandable) */}
          {hasCheckpoint && todayData.checkpoint && (
            <CheckpointSummary checkpoint={todayData.checkpoint} label="Today's Checkpoint" />
          )}
        </div>
      )}

      {/* Empty State - No Work Unit Selected */}
      {!hasWorkUnit && workUnitsWithCounts.length > 0 && (
        <div className="mt-6 border border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            Select a Work Unit above to get started
          </p>
        </div>
      )}
    </div>
  );
}
