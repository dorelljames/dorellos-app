"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface SettingsGearClientProps {
  children: ReactNode;
}

export function SettingsGearClient({ children }: SettingsGearClientProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-30 hover:opacity-100 transition-opacity"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/today" className="cursor-pointer">
            Today
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/work-units" className="cursor-pointer">
            Work Units
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/guide" className="cursor-pointer">
            Guide
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeSwitcher />
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          {children}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
