import { createClient } from '@supabase/supabase-js';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase Environment Variables are missing! Check Vercel Settings.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
