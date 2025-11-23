// Data access layer for Horizon Timeline feature
// Horizons are time-bound goal snapshots (weekly, monthly, yearly, direction)
// that provide context and direction for daily work

import { createClient } from "@/lib/supabase/server";

export type HorizonType = 'weekly' | 'monthly' | 'yearly' | 'direction';

/**
 * Get current horizon values for today
 */
export async function getTodayHorizons(): Promise<{
  weekly: string | null;
  monthly: string | null;
  yearly: string | null;
  direction: string | null;
} | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('days')
    .select('weekly_horizon, monthly_horizon, yearly_horizon, direction_horizon')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    weekly: data.weekly_horizon,
    monthly: data.monthly_horizon,
    yearly: data.yearly_horizon,
    direction: data.direction_horizon,
  };
}

/**
 * Update a specific horizon for today
 */
export async function updateHorizon(
  dayId: string,
  horizonType: HorizonType,
  content: string
): Promise<void> {
  const supabase = await createClient();

  const fieldMap: Record<HorizonType, string> = {
    weekly: 'weekly_horizon',
    monthly: 'monthly_horizon',
    yearly: 'yearly_horizon',
    direction: 'direction_horizon',
  };

  const { error } = await supabase
    .from('days')
    .update({ [fieldMap[horizonType]]: content })
    .eq('id', dayId);

  if (error) {
    console.error(`Error updating ${horizonType} horizon:`, error);
    throw error;
  }
}

/**
 * Get horizon history for a specific type
 * Useful for seeing how horizons evolved over time
 */
export async function getHorizonHistory(
  horizonType: HorizonType,
  limit: number = 30
): Promise<Array<{ date: string; content: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const fieldMap: Record<HorizonType, string> = {
    weekly: 'weekly_horizon',
    monthly: 'monthly_horizon',
    yearly: 'yearly_horizon',
    direction: 'direction_horizon',
  };

  const field = fieldMap[horizonType];

  const { data, error } = await supabase
    .from('days')
    .select('date, weekly_horizon, monthly_horizon, yearly_horizon, direction_horizon')
    .eq('user_id', user.id)
    .not(field, 'is', null)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Error fetching ${horizonType} horizon history:`, error);
    throw error;
  }

  return data?.map(d => ({
    date: d.date,
    content: (d as any)[field] as string,
  })) || [];
}
