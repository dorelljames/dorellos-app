"use client";

import { useState, useTransition, useEffect, useRef } from "react";

interface DailyIntentProps {
  dayId: string;
  initialIntent: string | null;
  onSave: (intent: string) => Promise<void>;
}

export function DailyIntent({ dayId, initialIntent, onSave }: DailyIntentProps) {
  const [intent, setIntent] = useState(initialIntent || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const isUserEditingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Only update local state from props if user is not actively editing
  useEffect(() => {
    if (!isUserEditingRef.current && initialIntent !== null) {
      setIntent(initialIntent);
    }
  }, [initialIntent]);

  // Auto-save after user stops typing for 1 second
  useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      if (intent !== initialIntent) {
        startTransition(async () => {
          await onSave(intent);
          setIsSaved(true);
          setIsEditing(false);
          setTimeout(() => setIsSaved(false), 2000);
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [intent, initialIntent, onSave, isEditing]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    isUserEditingRef.current = false;
    // Don't close immediately - let auto-save handle it
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-medium text-muted-foreground">Today's Intent</h2>
        {isSaved && (
          <span className="text-xs text-muted-foreground/60">Saved</span>
        )}
      </div>

      {!isEditing ? (
        <div
          onClick={handleClick}
          className="cursor-pointer text-sm py-2 min-h-[60px] hover:bg-muted/20 rounded-md px-2 -mx-2 transition-colors"
        >
          {intent || (
            <span className="text-muted-foreground/50">
              Click to add today's intent...
            </span>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={intent}
          onChange={(e) => {
            isUserEditingRef.current = true;
            setIntent(e.target.value);
          }}
          onBlur={handleBlur}
          placeholder="Today, I want to push the Payments PR forward..."
          className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isPending}
        />
      )}
    </div>
  );
}
