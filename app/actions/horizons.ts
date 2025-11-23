"use server";

import { updateHorizon, type HorizonType } from "@/lib/db/horizons";

/**
 * Save a horizon value for today's day
 * Does NOT revalidate path to prevent losing focus while typing
 * (matches the saveDailyIntent pattern)
 */
export async function saveHorizon(
  dayId: string,
  horizonType: string,
  content: string
) {
  try {
    await updateHorizon(dayId, horizonType as HorizonType, content);

    // Don't revalidate to prevent losing focus while typing
    // Similar to saveDailyIntent pattern
    // revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error(`Error saving ${horizonType} horizon:`, error);
    return { error: `Failed to save ${horizonType} horizon` };
  }
}
