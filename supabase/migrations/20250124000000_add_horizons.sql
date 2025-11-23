-- Add horizon fields to days table for time-bound goal snapshots
-- These fields store the user's weekly, monthly, yearly, and long-term direction
-- Values persist day-to-day until explicitly updated by the user

ALTER TABLE days
  ADD COLUMN weekly_horizon TEXT,
  ADD COLUMN monthly_horizon TEXT,
  ADD COLUMN yearly_horizon TEXT,
  ADD COLUMN direction_horizon TEXT;
