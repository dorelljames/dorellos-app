"use client";

import { useWeeklyMomentum } from "@/lib/hooks/use-today";
import { WeeklyMomentumView } from "./weekly-momentum-view";
import { MomentumDay } from "@/lib/types/database";

/**
 * Calculate overall momentum trend for the week
 */
function calculateMomentumTrend(days: MomentumDay[]): 'gaining' | 'stable' | 'declining' {
  if (days.length === 0) return 'stable';

  // Split into first half and second half
  const midpoint = Math.floor(days.length / 2);
  const firstHalf = days.slice(0, midpoint);
  const secondHalf = days.slice(midpoint);

  const firstHalfActive = firstHalf.filter(d => d.hasActivity).length;
  const secondHalfActive = secondHalf.filter(d => d.hasActivity).length;

  // Compare activity levels
  if (secondHalfActive > firstHalfActive) {
    return 'gaining';
  } else if (secondHalfActive < firstHalfActive) {
    return 'declining';
  } else {
    return 'stable';
  }
}

export function WeeklyMomentum() {
  const { data: days = [], isLoading } = useWeeklyMomentum();

  if (isLoading) {
    return (
      <div className="animate-pulse h-24 bg-muted rounded-lg" />
    );
  }

  const trend = calculateMomentumTrend(days);
  const activeDays = days.filter(d => d.hasActivity).length;
  const closedDays = days.filter(d => d.hasCheckpoint).length;

  return (
    <WeeklyMomentumView
      days={days}
      trend={trend}
      activeDays={activeDays}
      closedDays={closedDays}
    />
  );
}
