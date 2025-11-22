// Data access layer for Days and Daily Nails
import { createClient } from "@/lib/supabase/server";
import type { Day, DayWithDetails, DailyNail } from "@/lib/types/database";

/**
 * Get or create today's day record
 */
export async function getTodayDay(): Promise<DayWithDetails | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Try to get existing day
  const { data: existingDay } = await supabase
    .from('days')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  let dayId: string;

  if (existingDay) {
    dayId = existingDay.id;
  } else {
    // Create new day record
    const { data: newDay, error } = await supabase
      .from('days')
      .insert({
        user_id: user.id,
        date: today,
      })
      .select()
      .single();

    if (error || !newDay) {
      console.error('Error creating day:', error);
      throw error;
    }

    dayId = newDay.id;
  }

  // Get full day details
  return getDayWithDetails(dayId);
}

/**
 * Get a day record with all related data
 */
export async function getDayWithDetails(dayId: string): Promise<DayWithDetails | null> {
  const supabase = await createClient();

  const { data: day, error: dayError } = await supabase
    .from('days')
    .select('*')
    .eq('id', dayId)
    .single();

  if (dayError || !day) {
    console.error('Error fetching day:', dayError);
    return null;
  }

  // Get daily nails
  const { data: nails } = await supabase
    .from('daily_nails')
    .select('*')
    .eq('day_id', dayId)
    .order('position', { ascending: true });

  // Get work unit if selected
  let workUnit = null;
  if (day.selected_work_unit_id) {
    const { data: wu } = await supabase
      .from('work_units')
      .select('*')
      .eq('id', day.selected_work_unit_id)
      .single();
    workUnit = wu;
  }

  // Get checkpoint if exists
  const { data: checkpoint } = await supabase
    .from('checkpoints')
    .select('*')
    .eq('day_id', dayId)
    .single();

  return {
    ...day,
    daily_nails: nails || [],
    work_unit: workUnit,
    checkpoint: checkpoint || null,
  };
}

/**
 * Set today's work unit
 */
export async function setTodayWorkUnit(workUnitId: string): Promise<Day> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = new Date().toISOString().split('T')[0];

  // Upsert the day record
  const { data, error } = await supabase
    .from('days')
    .upsert({
      user_id: user.id,
      date: today,
      selected_work_unit_id: workUnitId,
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();

  if (error) {
    console.error('Error setting today work unit:', error);
    throw error;
  }

  return data;
}

/**
 * Get day by date
 */
export async function getDayByDate(date: string): Promise<Day | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('days')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error) {
    console.error('Error fetching day by date:', error);
    return null;
  }

  return data;
}

// =====================================================
// DAILY NAILS
// =====================================================

/**
 * Set daily nails for a day (replaces existing)
 */
export async function setDailyNails(
  dayId: string,
  nails: Array<{ label: string; work_unit_id?: string | null }>
): Promise<DailyNail[]> {
  const supabase = await createClient();

  // Delete existing nails
  await supabase
    .from('daily_nails')
    .delete()
    .eq('day_id', dayId);

  // Insert new nails
  const nailsToInsert = nails.map((nail, index) => ({
    day_id: dayId,
    label: nail.label,
    work_unit_id: nail.work_unit_id || null,
    position: index,
    is_done: false,
  }));

  const { data, error } = await supabase
    .from('daily_nails')
    .insert(nailsToInsert)
    .select();

  if (error) {
    console.error('Error setting daily nails:', error);
    throw error;
  }

  return data || [];
}

/**
 * Toggle daily nail done status
 */
export async function toggleDailyNail(
  nailId: string,
  isDone: boolean
): Promise<DailyNail> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('daily_nails')
    .update({ is_done: isDone })
    .eq('id', nailId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling daily nail:', error);
    throw error;
  }

  return data;
}

/**
 * Add a single daily nail
 */
export async function addDailyNail(
  dayId: string,
  label: string,
  workUnitId?: string | null
): Promise<DailyNail> {
  const supabase = await createClient();

  // Get current max position
  const { data: existingNails } = await supabase
    .from('daily_nails')
    .select('position')
    .eq('day_id', dayId)
    .order('position', { ascending: false })
    .limit(1);

  const position = existingNails && existingNails.length > 0
    ? existingNails[0].position + 1
    : 0;

  const { data, error } = await supabase
    .from('daily_nails')
    .insert({
      day_id: dayId,
      label,
      work_unit_id: workUnitId || null,
      position,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding daily nail:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a daily nail
 */
export async function deleteDailyNail(nailId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('daily_nails')
    .delete()
    .eq('id', nailId);

  if (error) {
    console.error('Error deleting daily nail:', error);
    throw error;
  }
}
