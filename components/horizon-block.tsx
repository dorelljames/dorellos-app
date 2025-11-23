"use client";

import { useState, useEffect, useRef } from "react";

interface HorizonBlockProps {
  dayId: string;
  horizons: {
    weekly: string | null;
    monthly: string | null;
    yearly: string | null;
    direction: string | null;
  };
  onSave: (horizonType: string, content: string) => Promise<void>;
}

export function HorizonBlock({ dayId, horizons, onSave }: HorizonBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-l-2 border-muted/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left group flex items-center gap-2 mb-3"
      >
        <span className="text-muted-foreground/50 text-xs transition-all group-hover:text-muted-foreground">
          {isExpanded ? "▼" : "▶"}
        </span>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          North Star / Horizon
        </h2>
      </button>

      {isExpanded && (
        <div className="space-y-6 pl-6">
          <HorizonField
            dayId={dayId}
            label="This Week"
            type="weekly"
            initialValue={horizons.weekly}
            placeholder="What do you want to accomplish this week?"
            onSave={onSave}
          />
          <HorizonField
            dayId={dayId}
            label="This Month"
            type="monthly"
            initialValue={horizons.monthly}
            placeholder="What's your focus for this month?"
            onSave={onSave}
          />
          <HorizonField
            dayId={dayId}
            label="This Year"
            type="yearly"
            initialValue={horizons.yearly}
            placeholder="What are you building toward this year?"
            onSave={onSave}
          />
          <HorizonField
            dayId={dayId}
            label="2-3 Year Direction"
            type="direction"
            initialValue={horizons.direction}
            placeholder="Where are you headed in the long term?"
            onSave={onSave}
          />
        </div>
      )}
    </div>
  );
}

interface HorizonFieldProps {
  dayId: string;
  label: string;
  type: string;
  initialValue: string | null;
  placeholder: string;
  onSave: (type: string, content: string) => Promise<void>;
}

function HorizonField({
  dayId,
  label,
  type,
  initialValue,
  placeholder,
  onSave,
}: HorizonFieldProps) {
  const [value, setValue] = useState(initialValue || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save with debounce (similar to DailyIntent)
  useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      if (value !== initialValue) {
        setIsPending(true);
        onSave(type, value)
          .then(() => {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
          })
          .finally(() => {
            setIsPending(false);
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [value, initialValue, type, onSave, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  // Auto-resize on value change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground/80">
          {label}
        </label>
        {isSaved && (
          <span className="text-xs text-muted-foreground/60">Saved</span>
        )}
      </div>

      {!isEditing ? (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer text-sm py-2 min-h-[40px] hover:bg-muted/20 rounded-md px-2 -mx-2 transition-colors"
        >
          {value || (
            <span className="text-muted-foreground/50 italic">
              {placeholder}
            </span>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          className="w-full min-h-[60px] px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
          disabled={isPending}
          rows={1}
        />
      )}
    </div>
  );
}
