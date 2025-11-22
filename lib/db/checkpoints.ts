// Data access layer for Checkpoints
import { createClient } from "@/lib/supabase/server";
import type { Checkpoint } from "@/lib/types/database";

/**
 * Create or update a checkpoint for a day
 */
export async function saveCheckpoint(params: {
  dayId: string;
  workUnitId?: string | null;
  completedSummary?: string;
  nextStep?: string;
  blockers?: string;
  mood?: string;
}): Promise<Checkpoint> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { dayId, ...checkpointData } = params;

  // Upsert checkpoint (one per day)
  const { data, error } = await supabase
    .from('checkpoints')
    .upsert({
      user_id: user.id,
      day_id: dayId,
      work_unit_id: checkpointData.workUnitId || null,
      completed_summary: checkpointData.completedSummary || null,
      next_step: checkpointData.nextStep || null,
      blockers: checkpointData.blockers || null,
      mood: checkpointData.mood || null,
    }, {
      onConflict: 'day_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving checkpoint:', error);
    throw error;
  }

  return data;
}

/**
 * Get checkpoint for a specific day
 */
export async function getCheckpointForDay(dayId: string): Promise<Checkpoint | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('checkpoints')
    .select('*')
    .eq('day_id', dayId)
    .single();

  if (error) {
    // Not found is okay
    return null;
  }

  return data;
}

/**
 * Get latest checkpoint for a work unit
 */
export async function getLatestCheckpointForWorkUnit(
  workUnitId: string
): Promise<Checkpoint | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('checkpoints')
    .select('*')
    .eq('work_unit_id', workUnitId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get recent checkpoints
 */
export async function getRecentCheckpoints(limit: number = 10): Promise<Checkpoint[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('checkpoints')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent checkpoints:', error);
    throw error;
  }

  return data || [];
}
