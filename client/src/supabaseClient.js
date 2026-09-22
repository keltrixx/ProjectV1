import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tfvooybzvbbekdpgullj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9ll44WvZMl9fMXhqRNY-Iw_uJXjZ7hh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


