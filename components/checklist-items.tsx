"use client";

// Checklist items component for work units
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ChecklistItem } from "@/lib/types/database";

interface ChecklistItemsProps {
  items: ChecklistItem[];
  onToggle: (itemId: string, isDone: boolean) => void;
}

export function ChecklistItems({ items, onToggle }: ChecklistItemsProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No checklist items yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
          <Checkbox
            id={item.id}
            checked={item.is_done}
            onCheckedChange={(checked) => onToggle(item.id, checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor={item.id}
            className={`flex-1 cursor-pointer text-sm ${
              item.is_done ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
