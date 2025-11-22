"use client";

import { useState, useTransition } from "react";
import { DailyNailsList } from "@/components/daily-nails-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleDailyNail, addDailyNail, deleteDailyNail } from "@/app/actions/days";
import type { DailyNail } from "@/lib/types/database";

interface TodayNailsToggleProps {
  nails: DailyNail[];
  dayId: string;
}

export function TodayNailsToggle({ nails, dayId }: TodayNailsToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [newNailLabel, setNewNailLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (nailId: string, isDone: boolean) => {
    startTransition(async () => {
      await toggleDailyNail(nailId, isDone);
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNailLabel.trim()) return;
    if (nails.length >= 3) {
      alert("You can only have 3 nails per day!");
      return;
    }

    setIsAdding(true);
    await addDailyNail(dayId, newNailLabel.trim());
    setNewNailLabel("");
    setIsAdding(false);
  };

  const handleDelete = (nailId: string) => {
    startTransition(async () => {
      await deleteDailyNail(nailId);
    });
  };

  return (
    <div className="space-y-4">
      <DailyNailsList
        nails={nails}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      {nails.length < 3 && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newNailLabel}
            onChange={(e) => setNewNailLabel(e.target.value)}
            placeholder={`Add nail ${nails.length + 1} of 3...`}
            disabled={isAdding}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isAdding || !newNailLabel.trim()}
            size="sm"
          >
            Add
          </Button>
        </form>
      )}

      {nails.length === 3 && (
        <p className="text-xs text-muted-foreground text-center">
          All 3 nails set! Focus on these today.
        </p>
      )}
    </div>
  );
}
