// Checkpoint (End-of-Day) Page
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayDay } from "@/lib/db/days";
import { CheckpointForm } from "./checkpoint-form";

export default async function CheckpointPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const todayData = await getTodayDay();

  if (!todayData) {
    redirect("/today");
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
