"use client";

import { DailyIntent } from "@/components/daily-intent";
import { saveDailyIntent } from "@/app/actions/days";

interface TodayIntentSaveProps {
  dayId: string;
  initialIntent: string | null;
}

export function TodayIntentSave({ dayId, initialIntent }: TodayIntentSaveProps) {
  const handleSave = async (intent: string) => {
    await saveDailyIntent(dayId, intent);
  };

  return <DailyIntent dayId={dayId} initialIntent={initialIntent} onSave={handleSave} />;
}
