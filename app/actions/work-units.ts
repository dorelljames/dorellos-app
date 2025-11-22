"use server";

// Server actions for Work Units
import { revalidatePath } from "next/cache";
import {
  createWorkUnit as dbCreateWorkUnit,
  updateWorkUnit as dbUpdateWorkUnit,
  deleteWorkUnit as dbDeleteWorkUnit,
  completeWorkUnit as dbCompleteWorkUnit,
  addChecklistItem as dbAddChecklistItem,
  toggleChecklistItem as dbToggleChecklistItem,
  updateChecklistItem as dbUpdateChecklistItem,
  deleteChecklistItem as dbDeleteChecklistItem,
} from "@/lib/db/work-units";

export async function createWorkUnit(formData: FormData) {
  const title = formData.get("title") as string;
  const outcome = formData.get("outcome") as string;
  const doneWhen = formData.get("doneWhen") as string;
  const status = (formData.get("status") as string) || "active";

  if (!title) {
    return { error: "Title is required" };
  }

  try {
    const workUnit = await dbCreateWorkUnit({
      title,
      outcome: outcome || undefined,
      done_when: doneWhen || undefined,
      status: status as "active" | "parked" | "completed" | "archived",
    });

    revalidatePath("/work-units");
    revalidatePath("/today");

    return { success: true, workUnit };
  } catch (error) {
    console.error("Error creating work unit:", error);
    return { error: "Failed to create work unit" };
  }
}

export async function updateWorkUnit(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const outcome = formData.get("outcome") as string;
  const doneWhen = formData.get("doneWhen") as string;
  const status = formData.get("status") as string;

  try {
    const workUnit = await dbUpdateWorkUnit(id, {
      ...(title && { title }),
      ...(outcome !== undefined && { outcome: outcome || undefined }),
      ...(doneWhen !== undefined && { done_when: doneWhen || undefined }),
      ...(status && { status: status as "active" | "parked" | "completed" | "archived" }),
    });

    revalidatePath("/work-units");
    revalidatePath(`/work-units/${id}`);
    revalidatePath("/today");

    return { success: true, workUnit };
  } catch (error) {
    console.error("Error updating work unit:", error);
    return { error: "Failed to update work unit" };
  }
}

export async function deleteWorkUnit(id: string) {
  try {
    await dbDeleteWorkUnit(id);

    revalidatePath("/work-units");
    revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error("Error deleting work unit:", error);
    return { error: "Failed to delete work unit" };
  }
}

export async function completeWorkUnit(id: string) {
  try {
    const workUnit = await dbCompleteWorkUnit(id);

    revalidatePath("/work-units");
    revalidatePath(`/work-units/${id}`);
    revalidatePath("/today");

    return { success: true, workUnit };
  } catch (error) {
    console.error("Error completing work unit:", error);
    return { error: "Failed to complete work unit" };
  }
}

// Checklist actions
export async function addChecklistItem(workUnitId: string, label: string) {
  try {
    const item = await dbAddChecklistItem(workUnitId, label);

    revalidatePath(`/work-units/${workUnitId}`);
    revalidatePath("/today");

    return { success: true, item };
  } catch (error) {
    console.error("Error adding checklist item:", error);
    return { error: "Failed to add checklist item" };
  }
}

export async function toggleChecklistItem(itemId: string, isDone: boolean) {
  try {
    const item = await dbToggleChecklistItem(itemId, isDone);

    revalidatePath(`/work-units/${item.work_unit_id}`);
    revalidatePath("/today");

    return { success: true, item };
  } catch (error) {
    console.error("Error toggling checklist item:", error);
    return { error: "Failed to toggle checklist item" };
  }
}

export async function updateChecklistItem(itemId: string, label: string) {
  try {
    const item = await dbUpdateChecklistItem(itemId, label);

    revalidatePath(`/work-units/${item.work_unit_id}`);
    revalidatePath("/today");

    return { success: true, item };
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return { error: "Failed to update checklist item" };
  }
}

export async function deleteChecklistItem(itemId: string, workUnitId: string) {
  try {
    await dbDeleteChecklistItem(itemId);

    revalidatePath(`/work-units/${workUnitId}`);
    revalidatePath("/today");

    return { success: true };
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return { error: "Failed to delete checklist item" };
  }
}
