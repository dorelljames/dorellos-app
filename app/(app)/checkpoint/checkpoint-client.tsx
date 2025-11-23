"use client";

import { useRouter } from "next/navigation";
import { useTodayDay } from "@/lib/hooks/use-today";
import { CheckpointForm } from "./checkpoint-form";

export function CheckpointClient() {
  const router = useRouter();
  const { data: todayData, isLoading } = useTodayDay();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!todayData) {
    router.push("/today");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Close Your Day</h1>
        <p className="text-muted-foreground">
          Reflect on what you accomplished and where you're headed next
        </p>
      </div>

      <CheckpointForm
        dayId={todayData.id}
        workUnitId={todayData.selected_work_unit_id}
        existingCheckpoint={todayData.checkpoint}
      />
    </div>
  );
}
