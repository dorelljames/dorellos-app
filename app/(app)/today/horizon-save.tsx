"use client";

import { HorizonBlock } from "@/components/horizon-block";
import { useUpdateHorizon } from "@/lib/hooks/use-today";

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
  const updateHorizon = useUpdateHorizon();

  const handleSave = async (horizonType: string, content: string) => {
    updateHorizon.mutate({
      dayId,
      horizonType: horizonType as "weekly" | "monthly" | "yearly" | "direction",
      content,
    });
  };

  return <HorizonBlock dayId={dayId} horizons={horizons} onSave={handleSave} />;
}
