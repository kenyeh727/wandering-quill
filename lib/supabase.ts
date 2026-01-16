import { createClient } from '@supabase/supabase-js';

// Use a dummy URL if missing to prevent createClient from throwing an error at top-level
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Supabase URL or Anon Key is missing. Auth features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
