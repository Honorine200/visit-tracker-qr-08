
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pyqjutnotpiyyopoteqo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cWp1dG5vdHBpeXlvcG90ZXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDQ2NzEsImV4cCI6MjA2MDI4MDY3MX0.E2Y_82zFVEYMNgZVuLCYNKWXDElcHmz9gv-LhfXolBA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to set up realtime subscriptions
export const subscribeToTable = (
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: any) => void
) => {
  return supabase
    .channel('table-changes')
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: tableName
      },
      callback
    )
    .subscribe();
};
