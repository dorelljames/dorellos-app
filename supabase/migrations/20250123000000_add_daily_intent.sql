-- Add daily_intent field to days table and remove daily_nails

-- Add daily_intent to days table
ALTER TABLE days ADD COLUMN daily_intent TEXT;

-- Drop daily_nails table and related objects
DROP INDEX IF EXISTS idx_daily_nails_day_id;
DROP INDEX IF EXISTS idx_daily_nails_position;
DROP TABLE IF EXISTS daily_nails;
