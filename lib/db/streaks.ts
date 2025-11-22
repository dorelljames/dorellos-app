// Streak calculations for Builder Streaks
import { createClient } from "@/lib/supabase/server";
import type { StreakData } from "@/lib/types/database";

/**
 * Calculate monthly streak data
 * - Presence Streak: days with a selected work unit this month
 * - Checkpoint Streak: days with a checkpoint this month
 */
export async function getMonthlyStreaks(): Promise<StreakData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get current month's start and end
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthStart = `${currentMonth}-01`;
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  // Count days with selected work units this month
  const { count: presenceCount, error: presenceError } = await supabase
    .from('days')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('date', monthStart)
    .lte('date', monthEnd)
    .not('selected_work_unit_id', 'is', null);

  if (presenceError) {
    console.error('Error calculating presence streak:', presenceError);
  }

  // Count days with checkpoints this month
  const { count: checkpointCount, error: checkpointError } = await supabase
    .from('checkpoints')
    .select('day_id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', `${monthStart}T00:00:00`)
    .lte('created_at', `${monthEnd}T23:59:59`);

  if (checkpointError) {
    console.error('Error calculating checkpoint streak:', checkpointError);
  }

  return {
    presenceStreak: presenceCount || 0,
    checkpointStreak: checkpointCount || 0,
    currentMonth,
  };
}

/**
 * Check if user has shown up today (selected a work unit)
 */
export async function hasShownUpToday(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('days')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)
    .not('selected_work_unit_id', 'is', null)
    .single();

  return !!data;
}

/**
 * Check if user has submitted checkpoint today
 */
export async function hasCheckpointedToday(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const today = new Date().toISOString().split('T')[0];

  // Get today's day record first
  const { data: dayData } = await supabase
    .from('days')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  if (!dayData) {
    return false;
  }

  // Check if checkpoint exists for today
  const { data: checkpointData } = await supabase
    .from('checkpoints')
    .select('id')
    .eq('day_id', dayData.id)
    .single();

  return !!checkpointData;
}
