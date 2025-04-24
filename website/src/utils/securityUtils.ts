/**
 * Security utilities for CRED-ABILITY
 * Provides encryption, validation and security-related helper functions
 */

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const minLength = 12;
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < minLength) {
    feedback.push(`Password must be at least ${minLength} characters long`);
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password should include at least one uppercase letter');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password should include at least one lowercase letter');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Password should include at least one number');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Password should include at least one special character');
  
  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Password should not contain repeating characters');
    score -= 1;
  }
  
  if (/^(?:password|qwerty|12345|admin)/i.test(password)) {
    feedback.push('Password is too common or easily guessable');
    score -= 1;
  }
  
  // Normalize score (0-5 range)
  score = Math.max(0, Math.min(5, score));
  
  return {
    isValid: score >= 3 && password.length >= minLength,
    score,
    feedback
  };
};

// Generate a random secure token
export const generateSecureToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~';
  let token = '';
  
  // In a production environment, use a cryptographically secure random number generator
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return token;
};

// Validate URL safety (basic check)
export const isSafeUrl = (url: string): boolean => {
  // Allow only http/https protocols
  if (!/^https?:\/\//i.test(url)) {
    return false;
  }
  
  // Check for potential script injection in URLs
  if (/javascript:/i.test(url)) {
    return false;
  }
  
  // Check for data URLs (potential XSS vector)
  if (/^data:/i.test(url)) {
    return false;
  }
  
  return true;
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Generate a unique session identifier
export const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Mask sensitive data for display or logging
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data) return '';
  
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const masked = '*'.repeat(data.length - (visibleChars * 2));
  
  return `${start}${masked}${end}`;
};

// Detect if running in a secure context
export const isSecureContext = (): boolean => {
  // Check if in browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if context is secure (HTTPS)
  return window.isSecureContext;
};
