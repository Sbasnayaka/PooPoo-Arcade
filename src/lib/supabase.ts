/**
 * Supabase Client Configuration
 * 
 * Note: For now, this uses mock/placeholder configuration.
 * To enable real-time features, set up:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Add environment variables to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=your_project_url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 * 3. Run database migrations (see partner_matching_plan.md)
 */

import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to mock values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
        !supabaseUrl.includes('placeholder')
    );
}

/**
 * Database type definitions
 */
export interface UserSession {
    id: string;
    user_code: string;
    created_at: string;
    expires_at: string;
    is_paired: boolean;
    pair_id: string | null;
}

export interface UserPair {
    id: string;
    user_a_code: string;
    user_b_code: string;
    lobby_id: string;
    status: 'active' | 'in_game' | 'completed';
    created_at: string;
    expires_at: string;
}
