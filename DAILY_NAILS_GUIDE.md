# Daily Nails Guide

## What Are "Daily Nails"?

**Daily Nails** are the **3 most important things** you commit to accomplishing today. Think of them as the "3 nails" you're driving into your day.

### Philosophy

- **Just 3 things** (not 30)
- Specific and actionable
- Can be completed in a single day
- Give you focus and closure

### Why 3?

- Small enough to be achievable
- Large enough to make real progress
- Forces prioritization
- Reduces overwhelm

---

## How It Works

### On the Today Screen

You'll see a "**Daily 3 Nails**" card with:

1. **Empty state** (when you have 0 nails):
   ```
   No daily nails set for today.
   Add up to 3 things you want to accomplish.

   [Add nail 1 of 3...] [Add]
   ```

2. **With nails** (1-2 nails):
   ```
   ☐ Write first draft of proposal
   ☐ Review pull request #234

   [Add nail 3 of 3...] [Add]
   ```

3. **All 3 set**:
   ```
   ☐ Write first draft of proposal
   ☐ Review pull request #234
   ☐ Schedule team sync for next week

   All 3 nails set! Focus on these today.
   ```

---

## User Actions

### ✅ Check off a nail
- Click the checkbox to mark it done
- It will show with a strikethrough
- Progress counter updates (e.g., "2 / 3 done")

### ➕ Add a nail
- Type the task in the input field
- Press "Add" or hit Enter
- Maximum of 3 nails per day

### ❌ Remove a nail
- Hover over a nail to see the "Remove" button
- Click to delete it
- This makes room to add a different nail

### 📝 No editing (by design)
- You can't edit a nail once created
- Instead: remove it and add a new one
- This keeps things simple and intentional

---

## Best Practices

### Good Daily Nails

✅ **Specific and actionable**
- "Write introduction section for docs"
- "Fix auth bug in login flow"
- "Call Sarah about Q1 budget"

✅ **Completable today**
- Can be finished in a single day
- Clear endpoint

✅ **Mix of types**
- Some from your Work Unit checklist
- Some standalone tasks
- Some communication/admin

### Avoid

❌ **Too vague**
- "Work on project" (what specifically?)
- "Think about strategy" (not actionable)

❌ **Too big**
- "Finish entire refactor" (probably multi-day)
- "Launch new feature" (breaks down into many tasks)

❌ **Too many**
- Don't add 10 things and call 3 of them "nails"
- The limit of 3 is intentional

---

## Connection to Work Units

Daily Nails can (but don't have to) connect to your active Work Unit:

- **Some nails** might be items from your Work Unit checklist
- **Other nails** might be unrelated daily tasks
- The Work Unit provides **context**, the Nails provide **daily focus**

### Example Day

**Work Unit**: "Refactor authentication system"

**Daily 3 Nails**:
1. ✅ Extract auth logic into separate service (from Work Unit)
2. ✅ Review security audit findings (from Work Unit)
3. ✅ Respond to urgent client email (standalone)

---

## Technical Details

### Database Structure

Each nail is stored in the `daily_nails` table:
```
- id: unique identifier
- day_id: links to today's "day" record
- label: the task description
- is_done: completion status
- position: 0, 1, or 2 (for ordering)
- work_unit_id: optional link to a Work Unit
```

### Daily Reset

- Nails are tied to a specific calendar date
- Each day gets its own set of up to 3 nails
- Yesterday's nails don't carry over
- Fresh start every morning

---

## User Flow Examples

### Morning Setup
1. Open the Today screen
2. See empty Daily Nails section
3. Add 3 specific things you want to accomplish
4. Get to work!

### During the Day
1. Check off nails as you complete them
2. See progress: "2 / 3 done"
3. If you realize a nail isn't relevant, remove it and add a better one

### End of Day
1. Check off any remaining completed nails
2. Click "Close Day" to go to Checkpoint
3. In the checkpoint, reflect on what you accomplished (including nails)

### Next Day
1. Fresh slate—no nails yet
2. Review yesterday's checkpoint to see where you left off
3. Set today's 3 nails based on your Work Unit and priorities

---

## FAQ

**Q: What if I finish all 3 nails early in the day?**
A: Great! You can't add more (3 is the limit), but you can:
- Work on your Work Unit checklist
- Get ahead on planning tomorrow
- Take a well-deserved break

**Q: What if I don't finish all 3 nails?**
A: That's okay! The Checkpoint flow asks "What did you complete?" and "Where did you stop?" You get closure either way.

**Q: Can I have different nails for different projects?**
A: The system is intentionally simple—one set of 3 nails per day, total. If you're context-switching between projects, choose the 3 most important things across all projects.

**Q: Why can't I edit a nail after creating it?**
A: Simplicity and intentionality. If you made a mistake or need to change it, just remove and re-add. This keeps the code simple and forces you to be thoughtful about what you commit to.

**Q: Do nails have to be work-related?**
A: Nope! If "Schedule dentist appointment" is one of your top 3 priorities today, make it a nail.

---

## Implementation Notes (for developers)

### Client Component
- `app/(app)/today/nails-toggle.tsx` handles add/delete/toggle
- Form submission for adding
- Optimistic UI updates via transitions
- Limit enforcement (max 3)

### Server Actions
- `addDailyNail(dayId, label)` - creates a new nail
- `toggleDailyNail(nailId, isDone)` - marks done/undone
- `deleteDailyNail(nailId)` - removes a nail

### UI Features
- Checkbox for completion
- Strikethrough styling when done
- "Remove" button appears on hover
- Input field appears when < 3 nails
- Success message when all 3 set
- Progress counter in header

---

## Summary

Daily Nails are your **daily commitment to yourself**:

- **What**: 3 specific, actionable tasks
- **Why**: Focus, closure, reduced overwhelm
- **How**: Add them in the morning, check them off during the day, reflect on them at checkpoint

**It's not about perfection. It's about showing up and making intentional progress.**
