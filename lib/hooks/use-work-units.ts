import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { WorkUnit, WorkUnitWithChecklist } from "@/lib/types/database";

// Query keys
export const workUnitsKeys = {
  all: ["work-units"] as const,
  lists: () => [...workUnitsKeys.all, "list"] as const,
  list: (filters: string) => [...workUnitsKeys.lists(), { filters }] as const,
  details: () => [...workUnitsKeys.all, "detail"] as const,
  detail: (id: string) => [...workUnitsKeys.details(), id] as const,
  active: () => [...workUnitsKeys.all, "active"] as const,
  activeWithCounts: () => [...workUnitsKeys.all, "active-with-counts"] as const,
  activeWithChecklists: () => [...workUnitsKeys.all, "active-with-checklists"] as const,
};

// Fetch all work units
export function useWorkUnits() {
  return useQuery({
    queryKey: workUnitsKeys.lists(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("work_units")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WorkUnit[];
    },
  });
}

// Fetch active work units (active + parked)
export function useActiveWorkUnits() {
  return useQuery({
    queryKey: workUnitsKeys.active(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("work_units")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "parked"])
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as WorkUnit[];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Fetch active work units with completion counts
export function useActiveWorkUnitsWithCounts() {
  return useQuery({
    queryKey: workUnitsKeys.activeWithCounts(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // First get active work units
      const { data: workUnits, error: workUnitsError } = await supabase
        .from("work_units")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "parked"])
        .order("updated_at", { ascending: false });

      if (workUnitsError) throw workUnitsError;
      if (!workUnits) return [];

      // For each work unit, get checklist counts
      const workUnitsWithCounts = await Promise.all(
        workUnits.map(async (wu) => {
          const { data: items } = await supabase
            .from("checklist_items")
            .select("id, is_done")
            .eq("work_unit_id", wu.id);

          const totalCount = items?.length || 0;
          const completedCount = items?.filter((item) => item.is_done).length || 0;

          return {
            ...wu,
            totalCount,
            completedCount,
          };
        })
      );

      return workUnitsWithCounts;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Fetch active work units with full checklists
export function useActiveWorkUnitsWithChecklists() {
  return useQuery({
    queryKey: workUnitsKeys.activeWithChecklists(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // First get active work units
      const { data: workUnits, error: workUnitsError } = await supabase
        .from("work_units")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "parked"])
        .order("updated_at", { ascending: false });

      if (workUnitsError) throw workUnitsError;
      if (!workUnits) return [];

      // For each work unit, get full checklist
      const workUnitsWithChecklists = await Promise.all(
        workUnits.map(async (wu) => {
          const { data: checklistItems } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("work_unit_id", wu.id)
            .order("position", { ascending: true });

          return {
            ...wu,
            checklist_items: checklistItems || [],
          } as WorkUnitWithChecklist;
        })
      );

      return workUnitsWithChecklists.filter((wu) => wu !== null);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

// Fetch single work unit with checklist
export function useWorkUnit(id: string | undefined) {
  return useQuery({
    queryKey: workUnitsKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) return null;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: workUnit, error: workUnitError } = await supabase
        .from("work_units")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (workUnitError) throw workUnitError;

      const { data: checklistItems } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("work_unit_id", id)
        .order("position", { ascending: true });

      return {
        ...workUnit,
        checklist_items: checklistItems || [],
      } as WorkUnitWithChecklist;
    },
    enabled: !!id,
  });
}

// Toggle checklist item mutation with optimistic updates
export function useToggleChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      isDone,
    }: {
      itemId: string;
      isDone: boolean;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("checklist_items")
        .update({ is_done: isDone })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: workUnitsKeys.detail(data.work_unit_id),
      });
      queryClient.invalidateQueries({
        queryKey: workUnitsKeys.activeWithCounts(),
      });
      queryClient.invalidateQueries({
        queryKey: workUnitsKeys.activeWithChecklists(),
      });
    },
  });
}
