"use server";

import { createClient } from "@/lib/supabase/server";

export type MomentumDay = {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 'Mon', 'Tue', etc.
  hasActivity: boolean; // Had a checkpoint or selected work unit
  hasCheckpoint: boolean; // Day was formally closed
  mood?: string; // From checkpoint
};

/**
 * Get the last 7 days of momentum data
 * Returns array of 7 days (today - 6 days to today)
 */
export async function getWeeklyMomentum(): Promise<MomentumDay[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Calculate date range: last 7 days including today
  const today = new Date();
  const dates: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Query days for the last 7 days
  const { data: days } = await supabase
    .from('days')
    .select('date, selected_work_unit_id')
    .eq('user_id', user.id)
    .in('date', dates)
    .order('date', { ascending: true });

  // Query checkpoints for the last 7 days
  const { data: checkpoints } = await supabase
    .from('checkpoints')
    .select('day_id, mood, days!inner(date)')
    .eq('user_id', user.id)
    .in('days.date', dates);

  // Create a map of checkpoints by date
  const checkpointsByDate = new Map<string, { mood?: string }>();
  if (checkpoints) {
    checkpoints.forEach((cp: any) => {
      const date = cp.days.date;
      checkpointsByDate.set(date, { mood: cp.mood });
    });
  }

  // Map each of the 7 days to momentum data
  const momentumDays: MomentumDay[] = dates.map((date) => {
    const dayData = days?.find((d) => d.date === date);
    const checkpointData = checkpointsByDate.get(date);

    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      date,
      dayOfWeek,
      hasActivity: !!dayData?.selected_work_unit_id || !!checkpointData,
      hasCheckpoint: !!checkpointData,
      mood: checkpointData?.mood,
    };
  });

  return momentumDays;
}
