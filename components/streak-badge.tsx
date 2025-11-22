// Streak badge component for displaying builder streaks
import { Badge } from "@/components/ui/badge";
import type { StreakData } from "@/lib/types/database";

interface StreakBadgeProps {
  streaks: StreakData;
}

export function StreakBadge({ streaks }: StreakBadgeProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <div className="flex-1">
          <p className="text-sm font-medium">Presence Streak</p>
          <p className="text-xs text-muted-foreground">
            {streaks.presenceStreak} {streaks.presenceStreak === 1 ? 'day' : 'days'} this month
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {streaks.presenceStreak}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-2xl">✅</span>
        <div className="flex-1">
          <p className="text-sm font-medium">Checkpoint Streak</p>
          <p className="text-xs text-muted-foreground">
            {streaks.checkpointStreak} {streaks.checkpointStreak === 1 ? 'day' : 'days'} this month
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {streaks.checkpointStreak}
        </Badge>
      </div>
    </div>
  );
}
