"use client";

import { DailyIntent } from "@/components/daily-intent";
import { useUpdateDailyIntent } from "@/lib/hooks/use-today";

interface TodayIntentSaveProps {
  dayId: string;
  initialIntent: string | null;
}

export function TodayIntentSave({ dayId, initialIntent }: TodayIntentSaveProps) {
  const updateIntent = useUpdateDailyIntent();

  const handleSave = async (intent: string) => {
    updateIntent.mutate({ dayId, intent });
  };

  return <DailyIntent dayId={dayId} initialIntent={initialIntent} onSave={handleSave} />;
}
