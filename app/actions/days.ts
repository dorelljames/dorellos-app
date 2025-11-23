"use server";

// Server actions for Days
import { revalidatePath } from "next/cache";
import { setTodayWorkUnit as dbSetTodayWorkUnit } from "@/lib/db/days";
import { createClient } from "@/lib/supabase/server";

export async function setTodayWorkUnit(workUnitId: string) {
  try {
    await dbSetTodayWorkUnit(workUnitId);

    revalidatePath("/today");
    revalidatePath("/work-units");

    return { success: true };
  } catch (error) {
    console.error("Error setting today's work unit:", error);
    return { error: "Failed to set today's work unit" };
  }
}

export async function saveDailyIntent(dayId: string, intent: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('days')
      .update({ daily_intent: intent })
      .eq('id', dayId);

    if (error) {
      console.error("Error saving daily intent:", error);
      throw error;
    }

    // Don't revalidate to prevent losing focus while typing
    // revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error("Error saving daily intent:", error);
    return { error: "Failed to save daily intent" };
  }
}
