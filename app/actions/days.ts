"use server";

// Server actions for Days and Daily Nails
import { revalidatePath } from "next/cache";
import {
  setTodayWorkUnit as dbSetTodayWorkUnit,
  setDailyNails as dbSetDailyNails,
  toggleDailyNail as dbToggleDailyNail,
  addDailyNail as dbAddDailyNail,
  deleteDailyNail as dbDeleteDailyNail,
} from "@/lib/db/days";

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

export async function setDailyNails(
  dayId: string,
  nails: Array<{ label: string; work_unit_id?: string | null }>
) {
  try {
    const updatedNails = await dbSetDailyNails(dayId, nails);

    revalidatePath("/today");

    return { success: true, nails: updatedNails };
  } catch (error) {
    console.error("Error setting daily nails:", error);
    return { error: "Failed to set daily nails" };
  }
}

export async function toggleDailyNail(nailId: string, isDone: boolean) {
  try {
    await dbToggleDailyNail(nailId, isDone);

    revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error("Error toggling daily nail:", error);
    return { error: "Failed to toggle daily nail" };
  }
}

export async function addDailyNail(
  dayId: string,
  label: string,
  workUnitId?: string | null
) {
  try {
    const nail = await dbAddDailyNail(dayId, label, workUnitId);

    revalidatePath("/today");

    return { success: true, nail };
  } catch (error) {
    console.error("Error adding daily nail:", error);
    return { error: "Failed to add daily nail" };
  }
}

export async function deleteDailyNail(nailId: string) {
  try {
    await dbDeleteDailyNail(nailId);

    revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error("Error deleting daily nail:", error);
    return { error: "Failed to delete daily nail" };
  }
}
