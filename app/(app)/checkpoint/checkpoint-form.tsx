"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveCheckpoint } from "@/app/actions/checkpoints";
import type { Checkpoint } from "@/lib/types/database";

interface CheckpointFormProps {
  dayId: string;
  workUnitId: string | null;
  existingCheckpoint: Checkpoint | null;
}

export function CheckpointForm({
  dayId,
  workUnitId,
  existingCheckpoint,
}: CheckpointFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("dayId", dayId);
    if (workUnitId) {
      formData.append("workUnitId", workUnitId);
    }

    try {
      const result = await saveCheckpoint(formData);

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
      // If successful, the server action will redirect to /today
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Daily Checkpoint</CardTitle>
          <CardDescription>
            Take a moment to reflect on your day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="completedSummary">
              What did you complete today?
            </Label>
            <textarea
              id="completedSummary"
              name="completedSummary"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              placeholder="Summarize what you got done..."
              defaultValue={existingCheckpoint?.completed_summary || ""}
            />
            <p className="text-xs text-muted-foreground">
              Even small progress counts. What moved forward today?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextStep">
              Where did you stop? What's the next step?
            </Label>
            <textarea
              id="nextStep"
              name="nextStep"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              placeholder="What should you pick up tomorrow?"
              defaultValue={existingCheckpoint?.next_step || ""}
            />
            <p className="text-xs text-muted-foreground">
              Make it easy to resume tomorrow by capturing context
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockers">
              Any blockers or challenges?
            </Label>
            <textarea
              id="blockers"
              name="blockers"
              className="w-full min-h-[80px] px-3 py-2 border rounded-md"
              placeholder="What's getting in the way? (optional)"
              defaultValue={existingCheckpoint?.blockers || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">How are you feeling? (optional)</Label>
            <select
              id="mood"
              name="mood"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={existingCheckpoint?.mood || ""}
            >
              <option value="">Not specified</option>
              <option value="great">Great - feeling energized</option>
              <option value="good">Good - making progress</option>
              <option value="okay">Okay - steady state</option>
              <option value="tired">Tired - need rest</option>
              <option value="stuck">Stuck - need help</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting
                ? "Saving..."
                : existingCheckpoint
                ? "Update Checkpoint"
                : "Save Checkpoint"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/today")}
            disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
