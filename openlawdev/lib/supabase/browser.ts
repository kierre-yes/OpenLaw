import {createClient} from '@supabase/supabase-js';

//read the anon and supabase url
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//check if keys exist
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Next.js public environment variables for Supabase initialization in browser.ts.'
    );
}

//supabase client
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
