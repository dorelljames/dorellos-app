// Data access layer for Work Units
import { createClient } from "@/lib/supabase/server";
import type { WorkUnit, WorkUnitWithChecklist, ChecklistItem } from "@/lib/types/database";

/**
 * Get all work units for the current user
 */
export async function getWorkUnits(status?: string): Promise<WorkUnit[]> {
  const supabase = await createClient();

  let query = supabase
    .from('work_units')
    .select('*')
    .order('updated_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching work units:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single work unit with its checklist items
 */
export async function getWorkUnit(id: string): Promise<WorkUnitWithChecklist | null> {
  const supabase = await createClient();

  const { data: workUnit, error: workUnitError } = await supabase
    .from('work_units')
    .select('*')
    .eq('id', id)
    .single();

  if (workUnitError || !workUnit) {
    console.error('Error fetching work unit:', workUnitError);
    return null;
  }

  const { data: checklistItems, error: checklistError } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('work_unit_id', id)
    .order('position', { ascending: true });

  if (checklistError) {
    console.error('Error fetching checklist items:', checklistError);
  }

  return {
    ...workUnit,
    checklist_items: checklistItems || [],
  };
}

/**
 * Get active work units (not archived or completed)
 */
export async function getActiveWorkUnits(): Promise<WorkUnit[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('work_units')
    .select('*')
    .in('status', ['active', 'parked'])
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching active work units:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new work unit
 */
export async function createWorkUnit(workUnit: {
  title: string;
  outcome?: string;
  done_when?: string;
  status?: 'active' | 'parked' | 'completed' | 'archived';
}): Promise<WorkUnit> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('work_units')
    .insert({
      user_id: user.id,
      ...workUnit,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating work unit:', error);
    throw error;
  }

  return data;
}

/**
 * Update a work unit
 */
export async function updateWorkUnit(
  id: string,
  updates: {
    title?: string;
    outcome?: string;
    done_when?: string;
    status?: 'active' | 'parked' | 'completed' | 'archived';
  }
): Promise<WorkUnit> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('work_units')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating work unit:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a work unit
 */
export async function deleteWorkUnit(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('work_units')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting work unit:', error);
    throw error;
  }
}

/**
 * Mark work unit as completed
 */
export async function completeWorkUnit(id: string): Promise<WorkUnit> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('work_units')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error completing work unit:', error);
    throw error;
  }

  return data;
}

// =====================================================
// CHECKLIST ITEMS
// =====================================================

/**
 * Add a checklist item to a work unit
 */
export async function addChecklistItem(
  workUnitId: string,
  label: string,
  position?: number
): Promise<ChecklistItem> {
  const supabase = await createClient();

  // If no position provided, get the max position and add 1
  if (position === undefined) {
    const { data: items } = await supabase
      .from('checklist_items')
      .select('position')
      .eq('work_unit_id', workUnitId)
      .order('position', { ascending: false })
      .limit(1);

    position = items && items.length > 0 ? items[0].position + 1 : 0;
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      work_unit_id: workUnitId,
      label,
      position,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding checklist item:', error);
    throw error;
  }

  return data;
}

/**
 * Toggle checklist item done status
 */
export async function toggleChecklistItem(
  id: string,
  isDone: boolean
): Promise<ChecklistItem> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('checklist_items')
    .update({ is_done: isDone })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling checklist item:', error);
    throw error;
  }

  return data;
}

/**
 * Update checklist item label
 */
export async function updateChecklistItem(
  id: string,
  label: string
): Promise<ChecklistItem> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('checklist_items')
    .update({ label })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating checklist item:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a checklist item
 */
export async function deleteChecklistItem(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting checklist item:', error);
    throw error;
  }
}
