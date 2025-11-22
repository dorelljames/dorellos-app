"use client";

import { useTransition } from "react";
import { ChecklistItems } from "@/components/checklist-items";
import { toggleChecklistItem } from "@/app/actions/work-units";
import type { ChecklistItem } from "@/lib/types/database";

interface TodayChecklistToggleProps {
  items: ChecklistItem[];
}

export function TodayChecklistToggle({ items }: TodayChecklistToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (itemId: string, isDone: boolean) => {
    startTransition(async () => {
      await toggleChecklistItem(itemId, isDone);
    });
  };

  return <ChecklistItems items={items} onToggle={handleToggle} />;
}
