import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();

    //read the anon and supabase url
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


    //check if keys exist
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Next.js public environment variables for Supabase initialization in browser.ts.'
        );
    }
    
//server side client 
return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
        getAll() {
            return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({name, value, options}) => 
                    cookieStore.set(name, value, options)
                );
            } catch {
            }
        },
    },
});
}
