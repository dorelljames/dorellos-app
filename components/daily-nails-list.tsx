"use client";

// Daily nails list component
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DailyNail } from "@/lib/types/database";

interface DailyNailsListProps {
  nails: DailyNail[];
  onToggle: (nailId: string, isDone: boolean) => void;
  onDelete?: (nailId: string) => void;
}

export function DailyNailsList({ nails, onToggle, onDelete }: DailyNailsListProps) {
  if (nails.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No daily nails set for today. Add up to 3 things you want to accomplish.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nails.map((nail) => (
        <div key={nail.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card group">
          <Checkbox
            id={nail.id}
            checked={nail.is_done}
            onCheckedChange={(checked) => onToggle(nail.id, checked === true)}
            className="mt-1"
          />
          <Label
            htmlFor={nail.id}
            className={`flex-1 cursor-pointer ${
              nail.is_done ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {nail.label}
          </Label>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-xs"
              onClick={() => onDelete(nail.id)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
