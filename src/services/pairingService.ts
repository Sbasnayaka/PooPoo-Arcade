/**
 * Pairing Service
 * Handles partner matching logic and database operations
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface PairingResult {
    success: boolean;
    lobbyId?: string;
    error?: string;
}

/**
 * Initiates pairing process between two users
 * 
 * Flow:
 * 1. Validates partner code exists
 * 2. Checks neither user is already paired
 * 3. Creates pair record in database
 * 4. Updates both user sessions
 * 5. Sends realtime notification to partner
 * 
 * @param myCode - The current user's code
 * @param partnerCode - The partner's code to pair with
 * @returns Promise<PairingResult>
 */
export async function initiatePartnerPairing(
    myCode: string,
    partnerCode: string
): Promise<PairingResult> {
    try {
        // Mock mode for development without Supabase
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured - using mock pairing');
            return mockPairing(myCode, partnerCode);
        }

        // Validate: cannot pair with yourself
        if (myCode === partnerCode) {
            return { success: false, error: 'You cannot pair with yourself!' };
        }

        // 1. Validate partner code exists and is not already paired
        const { data: partnerSession, error: partnerError } = await supabase
            .from('user_sessions')
            .select('user_code, is_paired')
            .eq('user_code', partnerCode)
            .single();

        if (partnerError || !partnerSession) {
            return { success: false, error: 'Partner code not found. Please check and try again.' };
        }

        if (partnerSession.is_paired) {
            return { success: false, error: 'Partner is already in a game. Please try again later.' };
        }

        // 2. Validate my code is not already paired
        const { data: mySession } = await supabase
            .from('user_sessions')
            .select('is_paired')
            .eq('user_code', myCode)
            .single();

        if (mySession?.is_paired) {
            return { success: false, error: 'You are already paired with someone else.' };
        }

        // 3. Generate lobby ID
        const lobbyId = `lobby-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 4. Create pair record (atomic transaction)
        const { data: pairData, error: pairError } = await supabase
            .from('user_pairs')
            .insert({
                user_a_code: myCode,
                user_b_code: partnerCode,
                lobby_id: lobbyId,
                status: 'active'
            })
            .select()
            .single();

        if (pairError) {
            console.error('Failed to create pair:', pairError);
            return { success: false, error: 'Failed to create pair. Please try again.' };
        }

        // 5. Update both user sessions to mark as paired
        const { error: updateError } = await supabase
            .from('user_sessions')
            .update({ is_paired: true, pair_id: pairData.id })
            .in('user_code', [myCode, partnerCode]);

        if (updateError) {
            console.error('Failed to update sessions:', updateError);
            // Rollback pair creation if session update fails
            await supabase.from('user_pairs').delete().eq('id', pairData.id);
            return { success: false, error: 'Pairing failed. Please try again.' };
        }

        // 6. Send realtime notification to partner via broadcast
        const channel = supabase.channel(`pairing:${partnerCode}`);
        await channel.send({
            type: 'broadcast',
            event: 'paired',
            payload: { lobbyId, partnerCode: myCode }
        });

        return { success: true, lobbyId };

    } catch (error) {
        console.error('Pairing error:', error);
        return { success: false, error: 'Pairing failed. Please try again.' };
    }
}

/**
 * Mock pairing function for development without database
 */
function mockPairing(myCode: string, partnerCode: string): PairingResult {
    if (myCode === partnerCode) {
        return { success: false, error: 'You cannot pair with yourself!' };
    }

    if (!partnerCode || partnerCode.length < 5) {
        return { success: false, error: 'Partner code not found. Please check and try again.' };
    }

    // Simulate successful pairing with mock lobby ID
    const lobbyId = `mock-lobby-${Date.now()}`;

    // Store in localStorage for mock realtime simulation
    const mockPairingData = {
        myCode,
        partnerCode,
        lobbyId,
        timestamp: Date.now()
    };

    localStorage.setItem('mockPairing', JSON.stringify(mockPairingData));

    return { success: true, lobbyId };
}

/**
 * Cleanup expired sessions (utility function)
 * Should be called periodically or triggered by a cron job
 */
export async function cleanupExpiredSessions(): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
        const { error } = await supabase
            .from('user_sessions')
            .delete()
            .lt('expires_at', new Date().toISOString());

        if (error) {
            console.error('Failed to cleanup sessions:', error);
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}
