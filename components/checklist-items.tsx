"use client";

// Checklist items component for work units
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChecklistItem } from "@/lib/types/database";

interface ChecklistItemsProps {
  items: ChecklistItem[];
  onToggle: (itemId: string, isDone: boolean) => void;
  onEdit?: (itemId: string, newLabel: string) => void;
  onDelete?: (itemId: string) => void;
}

export function ChecklistItems({ items, onToggle, onEdit, onDelete }: ChecklistItemsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No checklist items yet.
      </div>
    );
  }

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditValue(item.label);
  };

  const handleSaveEdit = (itemId: string) => {
    if (editValue.trim() && onEdit) {
      onEdit(itemId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(itemId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (item: ChecklistItem, e: React.MouseEvent) => {
    // Skip confirmation if Shift key is held
    if (e.shiftKey) {
      if (onDelete) onDelete(item.id);
      return;
    }

    // Show confirmation dialog
    if (window.confirm(`Delete "${item.label}"?`)) {
      if (onDelete) onDelete(item.id);
    }
  };

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-border/30 group">
          <Checkbox
            id={item.id}
            checked={item.is_done}
            onCheckedChange={(checked) => onToggle(item.id, checked === true)}
            className="mt-0.5"
            disabled={editingId === item.id}
          />

          {editingId === item.id ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className="h-7 text-sm border-none shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSaveEdit(item.id)}
                className="h-7 px-2 text-xs opacity-60 hover:opacity-100"
              >
                ✓
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-7 px-2 text-xs opacity-60 hover:opacity-100"
              >
                ×
              </Button>
            </div>
          ) : (
            <>
              <div
                onClick={() => onEdit && handleStartEdit(item)}
                className={`flex-1 cursor-pointer text-sm ${
                  item.is_done ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.label}
              </div>

              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleDeleteClick(item, e)}
                  className="h-6 w-6 p-0 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete (hold Shift to skip confirmation)"
                >
                  <span className="text-sm">×</span>
                </Button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
