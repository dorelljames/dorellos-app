/**
 * Run this script to apply the daily_intent migration
 * Usage: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Running migration: Add daily_intent column...');

  try {
    // Add daily_intent column
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE days ADD COLUMN IF NOT EXISTS daily_intent TEXT;'
    });

    if (error) {
      console.error('Migration failed:', error);
      console.log('\n⚠️  Please run this SQL manually in the Supabase SQL Editor:');
      console.log('ALTER TABLE days ADD COLUMN IF NOT EXISTS daily_intent TEXT;');
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    console.log('\n⚠️  Please run this SQL manually in the Supabase SQL Editor:');
    console.log('ALTER TABLE days ADD COLUMN IF NOT EXISTS daily_intent TEXT;');
    process.exit(1);
  }
}

runMigration();
