"use server";

// Server actions for Checkpoints
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveCheckpoint as dbSaveCheckpoint } from "@/lib/db/checkpoints";

export async function saveCheckpoint(formData: FormData) {
  const dayId = formData.get("dayId") as string;
  const workUnitId = formData.get("workUnitId") as string;
  const completedSummary = formData.get("completedSummary") as string;
  const nextStep = formData.get("nextStep") as string;
  const blockers = formData.get("blockers") as string;
  const mood = formData.get("mood") as string;

  if (!dayId) {
    return { error: "Day ID is required" };
  }

  try {
    await dbSaveCheckpoint({
      dayId,
      workUnitId: workUnitId || null,
      completedSummary: completedSummary || undefined,
      nextStep: nextStep || undefined,
      blockers: blockers || undefined,
      mood: mood || undefined,
    });

    revalidatePath("/today");
    revalidatePath("/checkpoint");

    // Redirect to today page after successful checkpoint
    redirect("/today");
  } catch (error) {
    console.error("Error saving checkpoint:", error);
    return { error: "Failed to save checkpoint" };
  }
}
