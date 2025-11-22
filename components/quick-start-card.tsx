"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickStartCard() {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("quickstart_dismissed") === "true";
    }
    return false;
  });

  const handleDismiss = () => {
    localStorage.setItem("quickstart_dismissed", "true");
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">👋 Welcome to Daily Execution OS!</CardTitle>
            <CardDescription className="mt-1">
              New here? Here's how to get started
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs"
          >
            Dismiss
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
            <span>
              <Link href="/work-units/new" className="underline font-medium">
                Create a Work Unit
              </Link>{" "}
              - a problem you're solving (e.g., "Refactor auth system")
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
            <span>
              Set it as today's Work Unit (click ••• menu)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
            <span>
              Add your <strong>3 Nails</strong> - the 3 things you'll do today
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">4.</span>
            <span>
              End your day with a <strong>Checkpoint</strong> for closure
            </span>
          </li>
        </ol>
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <Link href="/guide">
            <Button variant="outline" size="sm" className="w-full">
              📖 Read Full Guide
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
