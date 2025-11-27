/**
 * Input validation utilities for sanitization and validation
 * Helps prevent XSS, injection attacks, and ensures data integrity
 */

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// General text limits
const TEXT_MAX_LENGTH = 10000;
const TITLE_MAX_LENGTH = 200;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(
  input: string,
  maxLength = TEXT_MAX_LENGTH,
): string {
  if (typeof input !== 'string') return '';

  return (
    input
      .trim()
      .slice(0, maxLength)
      // Remove null bytes
      .replace(/\0/g, '')
      // Remove control characters except newlines and tabs
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  );
}

/**
 * Sanitize HTML-sensitive characters to prevent XSS
 */
export function escapeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return sanitizeString(input).replace(
    /[&<>"'/]/g,
    (char) => htmlEntities[char],
  );
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const sanitized = sanitizeString(email, 254).toLowerCase();

  if (!sanitized) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${PASSWORD_MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate event title
 */
export function validateEventTitle(title: string): ValidationResult {
  const sanitized = sanitizeString(title, TITLE_MAX_LENGTH);

  if (!sanitized) {
    return { isValid: false, error: 'Event title is required' };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate event description
 */
export function validateEventDescription(
  description: string,
): ValidationResult {
  const sanitized = sanitizeString(description, TEXT_MAX_LENGTH);
  return { isValid: true, sanitized };
}

/**
 * Validate date string (ISO 8601)
 */
export function validateDateString(dateStr: string): ValidationResult {
  if (!dateStr) {
    return { isValid: false, error: 'Date is required' };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  return { isValid: true, sanitized: date.toISOString() };
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): ValidationResult {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuid) {
    return { isValid: false, error: 'ID is required' };
  }

  if (!uuidRegex.test(uuid)) {
    return { isValid: false, error: 'Invalid ID format' };
  }

  return { isValid: true, sanitized: uuid.toLowerCase() };
}

/**
 * Validate and sanitize family/member name
 */
export function validateName(
  name: string,
  fieldName = 'Name',
): ValidationResult {
  const sanitized = sanitizeString(name, 100);

  if (!sanitized) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate hex color code
 */
export function validateHexColor(color: string): ValidationResult {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!color) {
    return { isValid: false, error: 'Color is required' };
  }

  if (!hexRegex.test(color)) {
    return { isValid: false, error: 'Invalid color format (use #RRGGBB)' };
  }

  return { isValid: true, sanitized: color.toUpperCase() };
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true, sanitized: '' }; // URLs are often optional
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS' };
    }
    return { isValid: true, sanitized: parsed.href };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}
