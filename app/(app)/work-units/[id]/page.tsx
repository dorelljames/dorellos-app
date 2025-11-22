// Work Unit Detail Page
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkUnit } from "@/lib/db/work-units";
import { getLatestCheckpointForWorkUnit } from "@/lib/db/checkpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownDisplay } from "@/components/markdown-display";
import { ChecklistItems } from "@/components/checklist-items";
import { WorkUnitDetailActions } from "./work-unit-detail-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColors = {
  active: "bg-green-500",
  parked: "bg-yellow-500",
  completed: "bg-blue-500",
  archived: "bg-gray-500",
};

const statusLabels = {
  active: "Active",
  parked: "Parked",
  completed: "Completed",
  archived: "Archived",
};

export default async function WorkUnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const workUnit = await getWorkUnit(id);

  if (!workUnit) {
    notFound();
  }

  const latestCheckpoint = await getLatestCheckpointForWorkUnit(id);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className={`${statusColors[workUnit.status]} text-white`}
            >
              {statusLabels[workUnit.status]}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{workUnit.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/work-units">
            <Button variant="outline">Back</Button>
          </Link>
          <Link href={`/work-units/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </div>

      {/* Outcome and Done When */}
      {(workUnit.outcome || workUnit.done_when) && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {workUnit.outcome && (
              <div>
                <h3 className="font-semibold mb-2">Outcome</h3>
                <MarkdownDisplay content={workUnit.outcome} />
              </div>
            )}
            {workUnit.done_when && (
              <div>
                <h3 className="font-semibold mb-2">Done When</h3>
                <MarkdownDisplay content={workUnit.done_when} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist</CardTitle>
            {workUnit.checklist_items.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {workUnit.checklist_items.filter((i) => i.is_done).length} /{" "}
                {workUnit.checklist_items.length} done
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <WorkUnitDetailActions
            workUnitId={id}
            items={workUnit.checklist_items}
          />
        </CardContent>
      </Card>

      {/* Latest Checkpoint */}
      {latestCheckpoint && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Latest Checkpoint</CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(latestCheckpoint.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {latestCheckpoint.completed_summary && (
              <div>
                <p className="font-medium">Completed:</p>
                <p className="text-muted-foreground">
                  {latestCheckpoint.completed_summary}
                </p>
              </div>
            )}
            {latestCheckpoint.next_step && (
              <div>
                <p className="font-medium">Next Step:</p>
                <p className="text-muted-foreground">
                  {latestCheckpoint.next_step}
                </p>
              </div>
            )}
            {latestCheckpoint.blockers && (
              <div>
                <p className="font-medium">Blockers:</p>
                <p className="text-muted-foreground">
                  {latestCheckpoint.blockers}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <WorkUnitDetailActions workUnitId={id} items={[]} showSetAsToday />
      </div>
    </div>
  );
}
