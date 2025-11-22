"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createWorkUnit, updateWorkUnit } from "@/app/actions/work-units";
import type { WorkUnit } from "@/lib/types/database";

interface WorkUnitFormProps {
  workUnit?: WorkUnit;
}

export function WorkUnitForm({ workUnit }: WorkUnitFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      let result;
      if (workUnit) {
        result = await updateWorkUnit(workUnit.id, formData);
      } else {
        result = await createWorkUnit(formData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/work-units");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{workUnit ? "Edit" : "Create"} Work Unit</CardTitle>
          <CardDescription>
            Define the problem space you're working on
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Refactor authentication system"
              defaultValue={workUnit?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome (Markdown supported)</Label>
            <textarea
              id="outcome"
              name="outcome"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              placeholder="What does success look like?"
              defaultValue={workUnit?.outcome || ""}
            />
            <p className="text-xs text-muted-foreground">
              Describe the desired outcome of this work unit
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doneWhen">Done When (Markdown supported)</Label>
            <textarea
              id="doneWhen"
              name="doneWhen"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              placeholder="Specific completion criteria..."
              defaultValue={workUnit?.done_when || ""}
            />
            <p className="text-xs text-muted-foreground">
              Define clear criteria for when this work unit is complete
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={workUnit?.status || "active"}
            >
              <option value="active">Active</option>
              <option value="parked">Parked</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : workUnit ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
