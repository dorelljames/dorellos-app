# Daily Execution OS

A personal productivity system focused on **showing up daily and making progress**. Not a generic task manager—this is a Daily Execution OS designed to:

- Reduce dread for large, messy tasks
- Give closure each day, even when big tasks are unfinished
- Keep you showing up consistently
- Avoid feature-bloat and toxic productivity

## Core Concepts

### 1. Work Units
A **Work Unit** is one coherent problem-space you're working on. It could span days or weeks. Each Work Unit has:
- Title
- Outcome (what success looks like)
- Done When (clear completion criteria)
- Checklist items
- Status (active, parked, completed, archived)

### 2. Daily Intent
A free-form intention for your day. Write naturally about what you want to focus on without rigid structure. Click to edit, auto-saves as you type.

### 3. Horizon Timeline
Time-bound goal snapshots that provide directional context for daily work:
- **This Week**: What you want to accomplish this week
- **This Month**: Your focus for the month
- **This Year**: What you're building toward this year
- **2-3 Year Direction**: Where you're headed in the long term

These horizons persist until you update them, creating a historical archive of your evolving goals.

### 4. Daily Checkpoints
End-of-day reflection that gives you **psychological closure** even when work is unfinished:
- What did you complete?
- Where did you stop? What's next?
- Any blockers?
- How are you feeling?

### 5. Weekly Momentum & Streaks
Metrics that track **showing up**, not perfection:
- **Weekly Momentum**: Bar chart showing this week's activity
- **Presence**: Days this month you engaged with a Work Unit
- **Checkpoint**: Days this month you submitted a checkpoint

Missing a day doesn't break your streak—it's a monthly count, not a consecutive chain.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Package Manager**: npm

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone and Install

```bash
cd dorellos-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API**
3. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env.local` file in the root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Click **New Query**
3. Run the migrations in order:
   - `supabase/migrations/20250122000000_initial_schema.sql` (initial schema)
   - `supabase/migrations/20250123000000_add_daily_intent.sql` (adds daily intent)
   - `supabase/migrations/20250124000000_add_horizons.sql` (adds horizon timeline)

This creates all tables, indexes, RLS policies, and triggers.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Sign Up

1. Click **Get Started** on the landing page
2. Create an account with email/password
3. Check your email for the confirmation link
4. Log in and start using the app!

---

## Usage Guide

### First Time Setup

1. **Create your first Work Unit**
   - Click "New Work Unit"
   - Add a title, outcome, and done-when criteria
   - Add checklist items to break it down

2. **Set Today's Work Unit**
   - From the Work Units list, click the menu (•••)
   - Select "Set as Today's Unit"

3. **Write Your Daily Intent**
   - On the Today screen, click the Daily Intent section
   - Write what you want to focus on today

4. **Set Your Horizons (Optional)**
   - Expand the "North Star / Horizon" section
   - Fill in your weekly, monthly, yearly, and long-term direction
   - These provide context for your daily work

5. **End Your Day**
   - Click "Close Day" when you're done
   - Fill out the checkpoint form
   - This updates your checkpoint streak!

### Daily Flow

**Morning:**
- Open the Today screen
- Set your Daily Intent
- Review or switch your Work Unit
- Check your horizons for context

**During the Day:**
- Use the Today screen as your command center
- Work on checklist items
- Switch between multiple Work Units if needed (use Multi-view)

**Evening:**
- Click "Close Day"
- Reflect on what you completed
- Note where you stopped and what's next
- Capture any blockers

---

## Project Structure

```
dorellos-app/
├── app/
│   ├── (app)/                    # Main app routes (authenticated)
│   │   ├── today/                # Today screen
│   │   ├── work-units/           # Work Units CRUD
│   │   ├── checkpoint/           # End-of-day checkpoint
│   │   ├── guide/                # User guide
│   │   └── layout.tsx            # App navigation layout
│   ├── actions/                  # Server actions
│   │   ├── work-units.ts         # Work Unit mutations
│   │   ├── days.ts               # Daily Intent mutations
│   │   ├── horizons.ts           # Horizon Timeline mutations
│   │   └── checkpoints.ts        # Checkpoint mutations
│   ├── auth/                     # Auth pages (login, signup, etc.)
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── work-unit-card.tsx
│   ├── work-unit-multi-view.tsx
│   ├── daily-intent.tsx
│   ├── horizon-block.tsx
│   ├── weekly-momentum.tsx
│   ├── streak-badge.tsx
│   ├── checklist-items.tsx
│   └── markdown-display.tsx
├── lib/
│   ├── db/                       # Data access layer
│   │   ├── work-units.ts
│   │   ├── days.ts
│   │   ├── horizons.ts
│   │   ├── checkpoints.ts
│   │   ├── streaks.ts
│   │   └── momentum.ts
│   ├── types/                    # TypeScript types
│   │   └── database.ts
│   └── supabase/                 # Supabase clients
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client
└── supabase/
    └── migrations/               # SQL migrations
        ├── 20250122000000_initial_schema.sql
        ├── 20250123000000_add_daily_intent.sql
        └── 20250124000000_add_horizons.sql
```

---

## Database Schema

### Tables

**work_units**
- Stores Work Units with title, outcome, done_when, status
- Tracks creation, update, and completion timestamps

**checklist_items**
- Items within a Work Unit
- Position-ordered, with is_done flag

**days**
- One record per calendar day per user
- Links to selected Work Unit
- Stores daily_intent (free-form text)
- Stores horizon snapshots (weekly, monthly, yearly, direction)

**checkpoints**
- End-of-day reflections
- One per day, with completion summary, next step, blockers, mood

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data. Auth is handled via Supabase's `auth.uid()` function.

---

## Key Features

### Markdown Support
- Work Unit outcome and done_when fields support markdown
- Rendered with `react-markdown` and GitHub-flavored markdown

### Server Actions
- All mutations use Next.js 16 Server Actions
- Automatic revalidation of affected pages
- Auto-save with debouncing for Daily Intent and Horizons

### Responsive Design
- Mobile-friendly interface
- Dark mode support (via next-themes)
- Minimal, notebook-style UI

### Multi-View Support
- Work on multiple Work Units simultaneously
- Toggle between single and multi-view modes
- See 2-3 Work Units side-by-side with their checklists

### Minimal Complexity
- No ORM (uses Supabase SDK directly)
- No projects, labels, or tags
- No team features
- Single-user focused

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Other Platforms

Works on any platform that supports Next.js 16:
- Netlify
- Railway
- Fly.io
- Self-hosted with Docker

---

## Customization

### Adding Prose Styling for Markdown

Install Tailwind Typography:

```bash
npm add @tailwindcss/typography
```

Add to `tailwind.config.ts`:

```ts
plugins: [require("@tailwindcss/typography")],
```

The markdown display component already uses `.prose` classes.

### Changing Streak Calculation

Edit `lib/db/streaks.ts` to customize how streaks are calculated (e.g., change from monthly to weekly).

---

## Troubleshooting

### "User not authenticated" errors
- Make sure you're logged in
- Check that Supabase environment variables are correct
- Verify RLS policies are applied (run the migration)

### Database connection issues
- Verify `.env.local` has correct Supabase credentials
- Check Supabase project is active
- Ensure database migration ran successfully

### TypeScript errors
- Run `npm install` to ensure all deps are installed
- Check that `lib/types/database.ts` matches your schema

---

## Philosophy

This app is intentionally minimal. It's designed around specific behavioral principles:

1. **Closure over Completion**: You can feel good about your day even if big tasks aren't done
2. **Presence over Perfection**: Showing up counts, missing a day doesn't reset your progress
3. **Focus over Volume**: One Work Unit at a time, not scattered across 30 tasks
4. **Context over Memory**: Checkpoints capture where you stopped so you can resume easily
5. **Direction over Drift**: Horizons provide north star context to keep you aligned with long-term goals

**It's not trying to be everything. It's trying to be enough.**

---

## License

MIT

---

## Support

For issues or questions, please open an issue on GitHub.
