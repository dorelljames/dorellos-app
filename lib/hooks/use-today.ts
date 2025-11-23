import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Day, Checkpoint } from "@/lib/types/database";

type DayWithCheckpoint = Day & {
  checkpoint: Checkpoint | null;
};

// Query keys
export const todayKeys = {
  all: ["today"] as const,
  day: () => [...todayKeys.all, "day"] as const,
  horizons: () => [...todayKeys.all, "horizons"] as const,
  streaks: () => [...todayKeys.all, "streaks"] as const,
  momentum: () => [...todayKeys.all, "momentum"] as const,
};

// Fetch today's day record with checkpoint
export function useTodayDay() {
  return useQuery({
    queryKey: todayKeys.day(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];

      // Try to get existing day
      const { data: existingDay } = await supabase
        .from("days")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      let dayData: Day;

      if (existingDay) {
        dayData = existingDay as Day;
      } else {
        // Create new day record
        const { data: newDay, error } = await supabase
          .from("days")
          .insert({
            user_id: user.id,
            date: today,
          })
          .select()
          .single();

        if (error) throw error;
        dayData = newDay as Day;
      }

      // Fetch checkpoint for this day
      const { data: checkpoint } = await supabase
        .from("checkpoints")
        .select("*")
        .eq("day_id", dayData.id)
        .single();

      return {
        ...dayData,
        checkpoint: checkpoint || null,
      } as DayWithCheckpoint;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - today's data doesn't change often
  });
}

// Update daily intent
export function useUpdateDailyIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dayId, intent }: { dayId: string; intent: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("days")
        .update({ daily_intent: intent })
        .eq("id", dayId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ dayId, intent }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todayKeys.day() });

      // Snapshot previous value
      const previousDay = queryClient.getQueryData<DayWithCheckpoint>(todayKeys.day());

      // Optimistically update
      queryClient.setQueryData<DayWithCheckpoint>(todayKeys.day(), (old) => {
        if (!old) return old;
        return { ...old, daily_intent: intent };
      });

      return { previousDay };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDay) {
        queryClient.setQueryData(todayKeys.day(), context.previousDay);
      }
    },
  });
}

// Update horizon
export function useUpdateHorizon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dayId,
      horizonType,
      content,
    }: {
      dayId: string;
      horizonType: "weekly" | "monthly" | "yearly" | "direction";
      content: string;
    }) => {
      const supabase = createClient();
      const fieldMap = {
        weekly: "weekly_horizon",
        monthly: "monthly_horizon",
        yearly: "yearly_horizon",
        direction: "direction_horizon",
      };

      const { data, error } = await supabase
        .from("days")
        .update({ [fieldMap[horizonType]]: content })
        .eq("id", dayId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ dayId, horizonType, content }) => {
      await queryClient.cancelQueries({ queryKey: todayKeys.day() });

      const previousDay = queryClient.getQueryData<DayWithCheckpoint>(todayKeys.day());

      const fieldMap = {
        weekly: "weekly_horizon",
        monthly: "monthly_horizon",
        yearly: "yearly_horizon",
        direction: "direction_horizon",
      };

      queryClient.setQueryData<DayWithCheckpoint>(todayKeys.day(), (old) => {
        if (!old) return old;
        return { ...old, [fieldMap[horizonType]]: content };
      });

      return { previousDay };
    },
    onError: (err, variables, context) => {
      if (context?.previousDay) {
        queryClient.setQueryData(todayKeys.day(), context.previousDay);
      }
    },
  });
}

// Set today's work unit
export function useSetTodayWorkUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workUnitId: string) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("days")
        .upsert(
          {
            user_id: user.id,
            date: today,
            selected_work_unit_id: workUnitId,
          },
          {
            onConflict: "user_id,date",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (workUnitId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todayKeys.day() });

      // Snapshot previous value
      const previousDay = queryClient.getQueryData<DayWithCheckpoint>(todayKeys.day());

      // Optimistically update
      queryClient.setQueryData<DayWithCheckpoint>(todayKeys.day(), (old) => {
        if (!old) return old;
        return { ...old, selected_work_unit_id: workUnitId };
      });

      return { previousDay };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDay) {
        queryClient.setQueryData(todayKeys.day(), context.previousDay);
      }
    },
    onSuccess: () => {
      // Invalidate related queries to refetch
      queryClient.invalidateQueries({ queryKey: todayKeys.day() });
      // Also invalidate work units queries to update counts/checklists
      queryClient.invalidateQueries({ queryKey: ["work-units"] });
    },
  });
}

// Fetch monthly streaks
export function useMonthlyStreaks() {
  return useQuery({
    queryKey: todayKeys.streaks(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const startDate = `${currentMonth}-01`;
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      const { data: days } = await supabase
        .from("days")
        .select("date, selected_work_unit_id")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .lte("date", endDate);

      const { data: checkpoints } = await supabase
        .from("checkpoints")
        .select("day_id, days!inner(date)")
        .eq("user_id", user.id)
        .gte("days.date", startDate)
        .lte("days.date", endDate);

      const presenceStreak = days?.filter((d) => d.selected_work_unit_id).length || 0;
      const checkpointStreak = checkpoints?.length || 0;

      return {
        presenceStreak,
        checkpointStreak,
        currentMonth,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Fetch weekly momentum
export function useWeeklyMomentum() {
  return useQuery({
    queryKey: todayKeys.momentum(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return [];

      // Calculate date range: last 7 days including today
      const today = new Date();
      const dates: string[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }

      // Query days for the last 7 days
      const { data: days } = await supabase
        .from("days")
        .select("date, selected_work_unit_id")
        .eq("user_id", user.id)
        .in("date", dates)
        .order("date", { ascending: true });

      // Query checkpoints for the last 7 days
      const { data: checkpoints } = await supabase
        .from("checkpoints")
        .select("day_id, mood, days!inner(date)")
        .eq("user_id", user.id)
        .in("days.date", dates);

      // Create a map of checkpoints by date
      const checkpointsByDate = new Map<string, { mood?: string }>();
      if (checkpoints) {
        checkpoints.forEach((cp: any) => {
          const date = cp.days.date;
          checkpointsByDate.set(date, { mood: cp.mood });
        });
      }

      // Map each of the 7 days to momentum data
      const momentumDays = dates.map((date) => {
        const dayData = days?.find((d) => d.date === date);
        const checkpointData = checkpointsByDate.get(date);

        const dateObj = new Date(date + "T00:00:00");
        const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });

        return {
          date,
          dayOfWeek,
          hasActivity: !!dayData?.selected_work_unit_id || !!checkpointData,
          hasCheckpoint: !!checkpointData,
          mood: checkpointData?.mood,
        };
      });

      return momentumDays;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
