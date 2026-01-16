/**
 * Code Generator Utility
 * Generates unique user codes for partner matching
 */

/**
 * Generates a unique user code in format: XXX-XXX-XXX
 * Uses alphanumeric characters excluding ambiguous ones (0, O, I, 1, l)
 * 
 * @returns A unique code string (e.g., "ABC-D3F-GH5")
 */
export function generateUserCode(): string {
    // Exclude ambiguous characters: 0, O, I, 1, l
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segments = 3;
    const segmentLength = 3;

    const code = Array.from({ length: segments }, () => {
        return Array.from({ length: segmentLength }, () => {
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
    }).join('-');

    return code;
}

/**
 * Validates that a code matches the expected format
 * 
 * @param code - The code to validate
 * @returns true if valid, false otherwise
 */
export function validateCodeFormat(code: string): boolean {
    const codeRegex = /^[A-Z2-9]{3}-[A-Z2-9]{3}-[A-Z2-9]{3}$/;
    return codeRegex.test(code);
}

/**
 * Formats a code string to uppercase with proper dashes
 * Useful for normalizing user input
 * 
 * @param input - Raw input string
 * @returns Formatted code or null if invalid
 */
export function formatCode(input: string): string | null {
    // Remove spaces and convert to uppercase
    const cleaned = input.replace(/\s/g, '').toUpperCase();

    // If it already has dashes in the right places
    if (validateCodeFormat(cleaned)) {
        return cleaned;
    }

    // Try to add dashes if it's 9 characters without them
    if (cleaned.length === 9 && /^[A-Z2-9]{9}$/.test(cleaned)) {
        const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`;
        return validateCodeFormat(formatted) ? formatted : null;
    }

    return null;
}
