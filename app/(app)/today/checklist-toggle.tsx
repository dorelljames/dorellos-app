"use client";

import { useState, useTransition } from "react";
import { ChecklistItems } from "@/components/checklist-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleChecklistItem, addChecklistItem, updateChecklistItem, deleteChecklistItem } from "@/app/actions/work-units";
import type { ChecklistItem } from "@/lib/types/database";

interface TodayChecklistToggleProps {
  items: ChecklistItem[];
}

export function TodayChecklistToggle({ items }: TodayChecklistToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [newItemLabel, setNewItemLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (itemId: string, isDone: boolean) => {
    startTransition(async () => {
      await toggleChecklistItem(itemId, isDone);
    });
  };

  const handleEdit = (itemId: string, newLabel: string) => {
    startTransition(async () => {
      await updateChecklistItem(itemId, newLabel);
    });
  };

  const handleDelete = (itemId: string) => {
    startTransition(async () => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        await deleteChecklistItem(itemId, item.work_unit_id);
      }
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim() || items.length === 0) return;

    setIsAdding(true);
    const workUnitId = items[0].work_unit_id;
    await addChecklistItem(workUnitId, newItemLabel.trim());
    setNewItemLabel("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-0">
      <ChecklistItems
        items={items}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Empty line - click to add */}
      <form onSubmit={handleAdd} className="flex items-center gap-3 py-2.5 border-b border-border/20 hover:border-border/40 transition-colors">
        <div className="w-4 h-4" /> {/* Spacer for checkbox alignment */}
        <Input
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          placeholder="Click to add item..."
          disabled={isAdding}
          className="flex-1 text-sm h-7 border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/40"
        />
      </form>
    </div>
  );
}
