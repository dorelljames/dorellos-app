// Today Screen - Minimal notebook-style layout
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayDay } from "@/lib/db/days";
import { getWorkUnit, getActiveWorkUnits } from "@/lib/db/work-units";
import { getMonthlyStreaks } from "@/lib/db/streaks";
import { StreakBadge } from "@/components/streak-badge";
import { WeeklyMomentum } from "@/components/weekly-momentum";
import { WorkUnitMultiView } from "@/components/work-unit-multi-view";
import { WorkUnitSummary } from "@/components/work-unit-summary";
import { CheckpointSummary } from "@/components/checkpoint-summary";
import { Button } from "@/components/ui/button";
import { TodayChecklistToggle } from "./checklist-toggle";
import { TodayIntentSave } from "./intent-save";

export default async function TodayPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get today's data
  const todayData = await getTodayDay();
  const streaks = await getMonthlyStreaks();

  // Get all active work units for switcher
  const activeWorkUnits = await getActiveWorkUnits();

  // Add completion counts to work units
  const workUnitsWithCounts = await Promise.all(
    activeWorkUnits.map(async (wu) => {
      const fullWU = await getWorkUnit(wu.id);
      const totalCount = fullWU?.checklist_items.length || 0;
      const completedCount = fullWU?.checklist_items.filter(item => item.is_done).length || 0;
      return {
        ...wu,
        totalCount,
        completedCount,
      };
    })
  );

  // Get current work unit with checklist
  let workUnitWithChecklist = null;
  if (todayData?.selected_work_unit_id) {
    workUnitWithChecklist = await getWorkUnit(todayData.selected_work_unit_id);
  }

  // Get all work units with their checklists for multi-view
  const workUnitsWithChecklists = await Promise.all(
    activeWorkUnits.map(async (wu) => await getWorkUnit(wu.id))
  ).then(units => units.filter(u => u !== null));

  const hasWorkUnit = !!workUnitWithChecklist;
  const hasCheckpoint = !!todayData?.checkpoint;

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <div className="flex-shrink-0">
          <StreakBadge streaks={streaks} />
        </div>
      </div>

      {/* Daily Intent */}
      {todayData && (
        <div className="mb-12">
          <TodayIntentSave dayId={todayData.id} initialIntent={todayData.daily_intent} />
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
          {hasCheckpoint && (
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
