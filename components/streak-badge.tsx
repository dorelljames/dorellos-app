// Streak badge component for displaying builder streaks
import type { StreakData } from "@/lib/types/database";

interface StreakBadgeProps {
  streaks: StreakData;
}

export function StreakBadge({ streaks }: StreakBadgeProps) {
  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground/70 py-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">Presence:</span>
        <span>{streaks.presenceStreak}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Checkpoint:</span>
        <span>{streaks.checkpointStreak}</span>
      </div>
      <span className="text-muted-foreground/50 text-[10px]">this month</span>
    </div>
  );
}
