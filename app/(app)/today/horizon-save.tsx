"use client";

import { HorizonBlock } from "@/components/horizon-block";
import { saveHorizon } from "@/app/actions/horizons";

interface TodayHorizonSaveProps {
  dayId: string;
  horizons: {
    weekly: string | null;
    monthly: string | null;
    yearly: string | null;
    direction: string | null;
  };
}

export function TodayHorizonSave({ dayId, horizons }: TodayHorizonSaveProps) {
  const handleSave = async (horizonType: string, content: string) => {
    await saveHorizon(dayId, horizonType, content);
  };

  return <HorizonBlock dayId={dayId} horizons={horizons} onSave={handleSave} />;
}
