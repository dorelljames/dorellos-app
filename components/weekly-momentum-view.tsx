"use client";

import { MomentumDay } from "@/lib/types/database";

interface WeeklyMomentumViewProps {
  days: MomentumDay[];
  trend: 'gaining' | 'stable' | 'declining';
  activeDays: number;
  closedDays: number;
}

export function WeeklyMomentumView({ days, trend, activeDays, closedDays }: WeeklyMomentumViewProps) {
  const trendText = {
    gaining: 'Gaining momentum',
    stable: 'Steady progress',
    declining: 'Building back up',
  };

  const trendIcon = {
    gaining: '↗',
    stable: '→',
    declining: '↘',
  };

  return (
    <div className="py-2">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xs font-medium mb-0.5 text-muted-foreground">This Week</h2>
          <p className="text-xs text-muted-foreground/70">
            {trendIcon[trend]} {trendText[trend]}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-12 mb-2">
        {days.map((day) => {
          const height = day.hasCheckpoint ? 'h-full' : day.hasActivity ? 'h-2/3' : 'h-1/4';
          const bgColor = day.hasCheckpoint
            ? 'bg-primary'
            : day.hasActivity
              ? 'bg-primary/50'
              : 'bg-muted';

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center h-12">
                <div
                  className={`w-full rounded-sm transition-all ${height} ${bgColor}`}
                  title={`${day.dayOfWeek} - ${day.hasCheckpoint ? 'Closed' : day.hasActivity ? 'Active' : 'No activity'}`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{day.dayOfWeek}</span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <p className="text-xs text-muted-foreground">
        {activeDays > 0 ? (
          <>
            {activeDays} {activeDays === 1 ? 'day' : 'days'} with activity
            {closedDays > 0 && <>, {closedDays} closed</>}
          </>
        ) : (
          'Ready to build momentum'
        )}
      </p>
    </div>
  );
}
