// Database types for Daily Execution OS
// These types match the Supabase schema defined in migrations

export type WorkUnitStatus = 'active' | 'parked' | 'completed' | 'archived';

export type Database = {
  public: {
    Tables: {
      work_units: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          outcome: string | null;
          done_when: string | null;
          status: WorkUnitStatus;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          outcome?: string | null;
          done_when?: string | null;
          status?: WorkUnitStatus;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          outcome?: string | null;
          done_when?: string | null;
          status?: WorkUnitStatus;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          work_unit_id: string;
          label: string;
          position: number;
          is_done: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_unit_id: string;
          label: string;
          position?: number;
          is_done?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_unit_id?: string;
          label?: string;
          position?: number;
          is_done?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      days: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          selected_work_unit_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          selected_work_unit_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          selected_work_unit_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_nails: {
        Row: {
          id: string;
          day_id: string;
          label: string;
          work_unit_id: string | null;
          is_done: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_id: string;
          label: string;
          work_unit_id?: string | null;
          is_done?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_id?: string;
          label?: string;
          work_unit_id?: string | null;
          is_done?: boolean;
          position?: number;
          created_at?: string;
        };
      };
      checkpoints: {
        Row: {
          id: string;
          user_id: string;
          day_id: string;
          work_unit_id: string | null;
          completed_summary: string | null;
          next_step: string | null;
          blockers: string | null;
          mood: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_id: string;
          work_unit_id?: string | null;
          completed_summary?: string | null;
          next_step?: string | null;
          blockers?: string | null;
          mood?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          day_id?: string;
          work_unit_id?: string | null;
          completed_summary?: string | null;
          next_step?: string | null;
          blockers?: string | null;
          mood?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Helper types for application use
export type WorkUnit = Database['public']['Tables']['work_units']['Row'];
export type ChecklistItem = Database['public']['Tables']['checklist_items']['Row'];
export type Day = Database['public']['Tables']['days']['Row'];
export type DailyNail = Database['public']['Tables']['daily_nails']['Row'];
export type Checkpoint = Database['public']['Tables']['checkpoints']['Row'];

// Composite types with relationships
export type WorkUnitWithChecklist = WorkUnit & {
  checklist_items: ChecklistItem[];
};

export type DayWithDetails = Day & {
  daily_nails: DailyNail[];
  work_unit: WorkUnit | null;
  checkpoint: Checkpoint | null;
};

export type StreakData = {
  presenceStreak: number; // Days this month with a selected work unit
  checkpointStreak: number; // Days this month with a checkpoint
  currentMonth: string; // YYYY-MM format
};
