// Today Screen - Main daily interface
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayDay } from "@/lib/db/days";
import { getWorkUnit } from "@/lib/db/work-units";
import { getMonthlyStreaks } from "@/lib/db/streaks";
import { StreakBadge } from "@/components/streak-badge";
import { WorkUnitCard } from "@/components/work-unit-card";
import { DailyNailsList } from "@/components/daily-nails-list";
import { ChecklistItems } from "@/components/checklist-items";
import { QuickStartCard } from "@/components/quick-start-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownDisplay } from "@/components/markdown-display";
import { TodayNailsToggle } from "./nails-toggle";
import { TodayChecklistToggle } from "./checklist-toggle";

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

  // Get work unit with checklist if selected
  let workUnitWithChecklist = null;
  if (todayData?.selected_work_unit_id) {
    workUnitWithChecklist = await getWorkUnit(todayData.selected_work_unit_id);
  }

  const hasWorkUnit = !!workUnitWithChecklist;
  const hasNails = todayData && todayData.daily_nails.length > 0;
  const hasCheckpoint = !!todayData?.checkpoint;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Today</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/guide">
            <Button variant="ghost" size="sm">
              📖 Guide
            </Button>
          </Link>
          <Link href="/work-units">
            <Button variant="outline">All Work Units</Button>
          </Link>
        </div>
      </div>

      {/* Streaks */}
      <StreakBadge streaks={streaks} />

      {/* Quick Start Guide (for new users with no Work Unit) */}
      {!hasWorkUnit && (
        <QuickStartCard />
      )}

      {/* Current Work Unit */}
      {!hasWorkUnit && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Work Unit Selected</CardTitle>
            <CardDescription>
              Choose a Work Unit to focus on today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/work-units">
              <Button>Select Work Unit</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {hasWorkUnit && workUnitWithChecklist && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">Current Work Unit</CardTitle>
                <h2 className="text-2xl font-bold mt-2">
                  {workUnitWithChecklist.title}
                </h2>
              </div>
              <Link href="/work-units">
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </Link>
            </div>
          </CardHeader>

          {(workUnitWithChecklist.outcome || workUnitWithChecklist.done_when) && (
            <CardContent className="space-y-4">
              {workUnitWithChecklist.outcome && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Outcome</h3>
                  <MarkdownDisplay content={workUnitWithChecklist.outcome} />
                </div>
              )}
              {workUnitWithChecklist.done_when && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Done When</h3>
                  <MarkdownDisplay content={workUnitWithChecklist.done_when} />
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Daily Nails (3 Nails) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily 3 Nails</CardTitle>
              <CardDescription>
                Your 3 commitments for today
              </CardDescription>
            </div>
            {hasNails && todayData && (
              <span className="text-sm text-muted-foreground">
                {todayData.daily_nails.filter((n) => n.is_done).length} /{" "}
                {todayData.daily_nails.length} done
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {todayData && (
            <TodayNailsToggle
              nails={todayData.daily_nails}
              dayId={todayData.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Work Unit Checklist */}
      {hasWorkUnit && workUnitWithChecklist && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Work Unit Checklist</CardTitle>
                <CardDescription>
                  Track progress on {workUnitWithChecklist.title}
                </CardDescription>
              </div>
              {workUnitWithChecklist.checklist_items.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {workUnitWithChecklist.checklist_items.filter((i) => i.is_done).length} /{" "}
                  {workUnitWithChecklist.checklist_items.length} done
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <TodayChecklistToggle
              items={workUnitWithChecklist.checklist_items}
            />
          </CardContent>
        </Card>
      )}

      {/* Last Checkpoint */}
      {hasCheckpoint && todayData?.checkpoint && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Today's Checkpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {todayData.checkpoint.completed_summary && (
              <div>
                <p className="font-medium">Completed:</p>
                <p className="text-muted-foreground">
                  {todayData.checkpoint.completed_summary}
                </p>
              </div>
            )}
            {todayData.checkpoint.next_step && (
              <div>
                <p className="font-medium">Next Step:</p>
                <p className="text-muted-foreground">
                  {todayData.checkpoint.next_step}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Close Day Button */}
      <div className="flex justify-center pt-4">
        <Link href="/checkpoint">
          <Button size="lg" className="px-8">
            {hasCheckpoint ? "Update Checkpoint" : "Close Day"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
