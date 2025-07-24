// Security utilities for input validation and sanitization

/**
 * Sanitizes user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potential HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 200); // Limit length
}

/**
 * Validates Brazilian WhatsApp number format
 */
export function validateBrazilianPhone(phone: string): boolean {
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Brazilian mobile numbers: 11 digits (2-digit area code + 9-digit number starting with 9)
  // Format: (XX) 9XXXX-XXXX
  const brazilianMobileRegex = /^[1-9]{2}9[0-9]{8}$/;
  
  return cleanPhone.length === 11 && brazilianMobileRegex.test(cleanPhone);
}

/**
 * Validates name input
 */
export function validateName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 100) {
    return false;
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and common accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name);
}

/**
 * Rate limiting helper (simple client-side implementation)
 */
export class RateLimiter {
  private attempts: number[] = [];
  private readonly maxAttempts: number;
  private readonly timeWindow: number;

  constructor(maxAttempts: number = 3, timeWindowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMs;
  }

  canAttempt(): boolean {
    const now = Date.now();
    // Remove old attempts outside time window
    this.attempts = this.attempts.filter(time => now - time < this.timeWindow);
    
    return this.attempts.length < this.maxAttempts;
  }

  recordAttempt(): void {
    this.attempts.push(Date.now());
  }
}

/**
 * Encodes data for safe transmission
 */
export function encodeForTransmission(data: Record<string, any>): Record<string, any> {
  const encoded: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      encoded[key] = sanitizeInput(value);
    } else if (typeof value === 'number') {
      // Ensure numbers are within reasonable bounds
      encoded[key] = Math.max(0, Math.min(100, value));
    } else {
      encoded[key] = value;
    }
  }
  
  return encoded;
}