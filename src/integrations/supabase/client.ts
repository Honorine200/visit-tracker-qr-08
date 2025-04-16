import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const subscribeToTable = (tableName: string, callback: () => void) => {
  // We're mocking this function since we're using local storage
  // In a real implementation with Supabase, we would use createClient().channel().on()
  console.log(`Subscribed to changes on ${tableName}`);
  
  // Add an event listener for storage events
  window.addEventListener('storage', callback);
  
  // Return a function to unsubscribe (remove the event listener)
  return () => {
    window.removeEventListener('storage', callback);
  };
};
