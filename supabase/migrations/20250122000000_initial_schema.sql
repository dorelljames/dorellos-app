-- Daily Execution OS - Initial Schema Migration
-- Single-user productivity app with Work Units, Daily Nails, and Checkpoints

-- Enable UUID extension (pgcrypto for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- WORK UNITS TABLE
-- =====================================================
-- Represents a coherent problem-space the user is working on
CREATE TABLE work_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  outcome TEXT, -- Markdown supported
  done_when TEXT, -- Markdown supported
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'parked', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for user queries
CREATE INDEX idx_work_units_user_id ON work_units(user_id);
CREATE INDEX idx_work_units_status ON work_units(user_id, status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_work_units_updated_at
  BEFORE UPDATE ON work_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CHECKLIST ITEMS TABLE
-- =====================================================
-- Individual items within a Work Unit
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_unit_id UUID NOT NULL REFERENCES work_units(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for work unit queries
CREATE INDEX idx_checklist_items_work_unit_id ON checklist_items(work_unit_id);
CREATE INDEX idx_checklist_items_position ON checklist_items(work_unit_id, position);

CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DAYS TABLE
-- =====================================================
-- Represents a single calendar day and the Work Unit selected for that day
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  selected_work_unit_id UUID REFERENCES work_units(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one day per user per date
  UNIQUE(user_id, date)
);

-- Index for user and date queries
CREATE INDEX idx_days_user_id ON days(user_id);
CREATE INDEX idx_days_date ON days(user_id, date DESC);

CREATE TRIGGER update_days_updated_at
  BEFORE UPDATE ON days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DAILY NAILS TABLE
-- =====================================================
-- The 3 things committed to for a specific day
CREATE TABLE daily_nails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  work_unit_id UUID REFERENCES work_units(id) ON DELETE SET NULL,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for day queries
CREATE INDEX idx_daily_nails_day_id ON daily_nails(day_id);
CREATE INDEX idx_daily_nails_position ON daily_nails(day_id, position);

-- =====================================================
-- CHECKPOINTS TABLE
-- =====================================================
-- End-of-day reflections
CREATE TABLE checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  work_unit_id UUID REFERENCES work_units(id) ON DELETE SET NULL,
  completed_summary TEXT,
  next_step TEXT,
  blockers TEXT,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Typically one checkpoint per day, but allow multiple
  UNIQUE(day_id)
);

-- Index for user queries
CREATE INDEX idx_checkpoints_user_id ON checkpoints(user_id);
CREATE INDEX idx_checkpoints_day_id ON checkpoints(day_id);
CREATE INDEX idx_checkpoints_created_at ON checkpoints(user_id, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE work_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nails ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;

-- Work Units Policies
CREATE POLICY "Users can view their own work units"
  ON work_units FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work units"
  ON work_units FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work units"
  ON work_units FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work units"
  ON work_units FOR DELETE
  USING (auth.uid() = user_id);

-- Checklist Items Policies (via work_unit ownership)
CREATE POLICY "Users can view checklist items for their work units"
  ON checklist_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM work_units
    WHERE work_units.id = checklist_items.work_unit_id
    AND work_units.user_id = auth.uid()
  ));

CREATE POLICY "Users can create checklist items for their work units"
  ON checklist_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM work_units
    WHERE work_units.id = checklist_items.work_unit_id
    AND work_units.user_id = auth.uid()
  ));

CREATE POLICY "Users can update checklist items for their work units"
  ON checklist_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM work_units
    WHERE work_units.id = checklist_items.work_unit_id
    AND work_units.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete checklist items for their work units"
  ON checklist_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM work_units
    WHERE work_units.id = checklist_items.work_unit_id
    AND work_units.user_id = auth.uid()
  ));

-- Days Policies
CREATE POLICY "Users can view their own days"
  ON days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own days"
  ON days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own days"
  ON days FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own days"
  ON days FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Nails Policies (via day ownership)
CREATE POLICY "Users can view daily nails for their days"
  ON daily_nails FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM days
    WHERE days.id = daily_nails.day_id
    AND days.user_id = auth.uid()
  ));

CREATE POLICY "Users can create daily nails for their days"
  ON daily_nails FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM days
    WHERE days.id = daily_nails.day_id
    AND days.user_id = auth.uid()
  ));

CREATE POLICY "Users can update daily nails for their days"
  ON daily_nails FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM days
    WHERE days.id = daily_nails.day_id
    AND days.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete daily nails for their days"
  ON daily_nails FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM days
    WHERE days.id = daily_nails.day_id
    AND days.user_id = auth.uid()
  ));

-- Checkpoints Policies
CREATE POLICY "Users can view their own checkpoints"
  ON checkpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkpoints"
  ON checkpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkpoints"
  ON checkpoints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkpoints"
  ON checkpoints FOR DELETE
  USING (auth.uid() = user_id);
