"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setTodayWorkUnit } from "@/app/actions/days";
import type { WorkUnit } from "@/lib/types/database";

interface WorkUnitActionsProps {
  workUnit: WorkUnit;
}

export function WorkUnitActions({ workUnit }: WorkUnitActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleSetAsToday = () => {
    startTransition(async () => {
      await setTodayWorkUnit(workUnit.id);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm">
          •••
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSetAsToday} disabled={isPending}>
          Set as Today's Unit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
