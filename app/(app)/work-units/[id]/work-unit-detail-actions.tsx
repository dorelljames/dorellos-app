"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChecklistItems } from "@/components/checklist-items";
import { setTodayWorkUnit } from "@/app/actions/days";
import {
  toggleChecklistItem,
  addChecklistItem,
} from "@/app/actions/work-units";
import type { ChecklistItem } from "@/lib/types/database";

interface WorkUnitDetailActionsProps {
  workUnitId: string;
  items: ChecklistItem[];
  showSetAsToday?: boolean;
}

export function WorkUnitDetailActions({
  workUnitId,
  items,
  showSetAsToday = false,
}: WorkUnitDetailActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [newItemLabel, setNewItemLabel] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleToggle = (itemId: string, isDone: boolean) => {
    startTransition(async () => {
      await toggleChecklistItem(itemId, isDone);
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    setIsAddingItem(true);
    await addChecklistItem(workUnitId, newItemLabel.trim());
    setNewItemLabel("");
    setIsAddingItem(false);
  };

  const handleSetAsToday = () => {
    startTransition(async () => {
      await setTodayWorkUnit(workUnitId);
    });
  };

  return (
    <div className="space-y-4">
      <ChecklistItems items={items} onToggle={handleToggle} />

      <form onSubmit={handleAddItem} className="flex gap-2">
        <Input
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          placeholder="Add checklist item..."
          disabled={isAddingItem}
        />
        <Button type="submit" disabled={isAddingItem || !newItemLabel.trim()}>
          Add
        </Button>
      </form>

      {showSetAsToday && (
        <div className="pt-4">
          <Button onClick={handleSetAsToday} disabled={isPending} size="lg">
            Set as Today's Work Unit
          </Button>
        </div>
      )}
    </div>
  );
}
