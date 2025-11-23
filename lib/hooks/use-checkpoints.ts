import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Checkpoint } from "@/lib/types/database";

// Query keys
export const checkpointKeys = {
  all: ["checkpoints"] as const,
  latest: (workUnitId: string) => [...checkpointKeys.all, "latest", workUnitId] as const,
};

// Fetch latest checkpoint for a work unit
export function useLatestCheckpoint(workUnitId: string | null | undefined) {
  return useQuery({
    queryKey: checkpointKeys.latest(workUnitId || ""),
    queryFn: async () => {
      if (!workUnitId) return null;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("checkpoints")
        .select("*")
        .eq("work_unit_id", workUnitId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return null;
      }

      return data as Checkpoint;
    },
    enabled: !!workUnitId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
