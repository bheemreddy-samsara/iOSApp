import {
  sanitizeString,
  escapeHtml,
  validateEmail,
  validatePassword,
  validateEventTitle,
  validateDateString,
  validateUUID,
  validateName,
  validateHexColor,
  validateUrl,
} from '@/utils/validation';

describe('validation utilities', () => {
  describe('sanitizeString', () => {
    it('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('removes null bytes', () => {
      expect(sanitizeString('hello\0world')).toBe('helloworld');
    });

    it('removes control characters', () => {
      expect(sanitizeString('hello\x00\x1Fworld')).toBe('helloworld');
    });

    it('respects maxLength', () => {
      expect(sanitizeString('hello world', 5)).toBe('hello');
    });

    it('returns empty string for non-string input', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
      expect(sanitizeString(123 as any)).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('escapes HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
      );
    });

    it('escapes ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('escapes quotes', () => {
      expect(escapeHtml('It\'s "quoted"')).toBe('It&#x27;s &quot;quoted&quot;');
    });
  });

  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid').isValid).toBe(false);
      expect(validateEmail('missing@domain').isValid).toBe(false);
      expect(validateEmail('@nodomain.com').isValid).toBe(false);
    });

    it('rejects empty email', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('   ').isValid).toBe(false);
    });

    it('lowercases and sanitizes email', () => {
      const result = validateEmail('  TEST@EXAMPLE.COM  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });
  });

  describe('validatePassword', () => {
    it('accepts valid passwords', () => {
      expect(validatePassword('password123').isValid).toBe(true);
      expect(validatePassword('12345678').isValid).toBe(true);
    });

    it('rejects short passwords', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });

    it('rejects empty passwords', () => {
      expect(validatePassword('').isValid).toBe(false);
    });

    it('rejects very long passwords', () => {
      const longPassword = 'a'.repeat(200);
      expect(validatePassword(longPassword).isValid).toBe(false);
    });
  });

  describe('validateEventTitle', () => {
    it('accepts valid titles', () => {
      expect(validateEventTitle('Team Meeting').isValid).toBe(true);
    });

    it('sanitizes and trims titles', () => {
      const result = validateEventTitle('  Meeting  ');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Meeting');
    });

    it('rejects empty titles', () => {
      expect(validateEventTitle('').isValid).toBe(false);
      expect(validateEventTitle('   ').isValid).toBe(false);
    });
  });

  describe('validateDateString', () => {
    it('accepts valid ISO dates', () => {
      expect(validateDateString('2024-01-15T10:30:00Z').isValid).toBe(true);
    });

    it('accepts valid date strings', () => {
      expect(validateDateString('2024-01-15').isValid).toBe(true);
    });

    it('rejects invalid dates', () => {
      expect(validateDateString('not-a-date').isValid).toBe(false);
      expect(validateDateString('').isValid).toBe(false);
    });

    it('returns ISO string', () => {
      const result = validateDateString('2024-01-15');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toContain('2024-01-15');
    });
  });

  describe('validateUUID', () => {
    it('accepts valid UUIDs', () => {
      expect(validateUUID('550e8400-e29b-41d4-a716-446655440000').isValid).toBe(
        true,
      );
    });

    it('rejects invalid UUIDs', () => {
      expect(validateUUID('invalid-uuid').isValid).toBe(false);
      expect(validateUUID('').isValid).toBe(false);
      expect(validateUUID('12345').isValid).toBe(false);
    });

    it('lowercases UUIDs', () => {
      const result = validateUUID('550E8400-E29B-41D4-A716-446655440000');
      expect(result.sanitized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('validateName', () => {
    it('accepts valid names', () => {
      expect(validateName('John Doe').isValid).toBe(true);
    });

    it('rejects empty names', () => {
      expect(validateName('').isValid).toBe(false);
    });

    it('uses custom field name in error', () => {
      const result = validateName('', 'Family name');
      expect(result.error).toContain('Family name');
    });
  });

  describe('validateHexColor', () => {
    it('accepts valid hex colors', () => {
      expect(validateHexColor('#FF0000').isValid).toBe(true);
      expect(validateHexColor('#fff').isValid).toBe(true);
      expect(validateHexColor('#5E6AD2').isValid).toBe(true);
    });

    it('rejects invalid colors', () => {
      expect(validateHexColor('red').isValid).toBe(false);
      expect(validateHexColor('#GGGGGG').isValid).toBe(false);
      expect(validateHexColor('').isValid).toBe(false);
    });

    it('uppercases colors', () => {
      const result = validateHexColor('#ff0000');
      expect(result.sanitized).toBe('#FF0000');
    });
  });

  describe('validateUrl', () => {
    it('accepts valid URLs', () => {
      expect(validateUrl('https://example.com').isValid).toBe(true);
      expect(validateUrl('http://localhost:3000').isValid).toBe(true);
    });

    it('rejects non-HTTP URLs', () => {
      expect(validateUrl('ftp://example.com').isValid).toBe(false);
      expect(validateUrl('javascript:alert(1)').isValid).toBe(false);
    });

    it('allows empty URLs (optional field)', () => {
      expect(validateUrl('').isValid).toBe(true);
    });

    it('rejects malformed URLs', () => {
      expect(validateUrl('not-a-url').isValid).toBe(false);
    });
  });
});
