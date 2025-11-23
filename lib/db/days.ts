// Data access layer for Days
import { createClient } from "@/lib/supabase/server";
import type { Day, DayWithDetails } from "@/lib/types/database";

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
// LEGACY: Daily Nails feature was removed and replaced with Daily Intent
// These functions are no longer used
// =====================================================
