/**
 * Input sanitization utilities for security
 * ConvertHub - All processing is client-side
 */

// Input limits by context
export const INPUT_LIMITS = {
  text: { maxLength: 500_000, maxLines: 50_000 },
  filename: { maxLength: 255, pattern: /^[a-zA-Z0-9_\-. ]+$/ },
  password: { minLength: 1, maxLength: 128 },
  regex: { maxLength: 10_000 },
  json: { maxLength: 10_000_000 },
  sql: { maxLength: 1_000_000 },
  url: { maxLength: 2048 },
} as const;

/**
 * Sanitize string for safe HTML rendering (prevents XSS)
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitize attribute values
 */
export function sanitizeAttribute(input: string): string {
  return input.replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    };
    return map[c];
  });
}

/**
 * Validate and sanitize URLs (blocks javascript: protocol XSS)
 */
export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(url.protocol)) {
      return '';
    }
    return url.toString();
  } catch {
    return '';
  }
}

/**
 * Check if URL is safe (no javascript: or data: protocol)
 */
export function isSafeUrl(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return false;
  }
  try {
    const url = new URL(input);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Detect potentially dangerous regex patterns (ReDoS protection)
 */
export function isSafeRegex(pattern: string): { safe: boolean; reason?: string } {
  if (pattern.length > 10_000) {
    return { safe: false, reason: 'Regex pattern too long (max 10,000 chars)' };
  }

  // Detect nested quantifiers that can cause catastrophic backtracking
  const dangerousPatterns = [
    /(\.\*)\1+/, // (a*)*
    /(\.\+)\1+/, // (a+)+
    /(\.\*\?)\1+/, // (a*?)*?
    /(\.\+\?)\1+/, // (a+?)+?
    /\([^)]*[*+][^)]*\)[*+]/, // ([a-z]+)*
  ];

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) {
      return {
        safe: false,
        reason: 'Pattern may cause catastrophic backtracking (ReDoS)',
      };
    }
  }

  return { safe: true };
}

/**
 * Validate filename for security
 */
export function validateFilename(filename: string): { valid: boolean; error?: string } {
  if (filename.length > INPUT_LIMITS.filename.maxLength) {
    return { valid: false, error: 'Filename too long' };
  }

  if (!INPUT_LIMITS.filename.pattern.test(filename)) {
    return { valid: false, error: 'Filename contains invalid characters' };
  }

  // Block executable extensions
  const blockedExtensions = [
    '.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.pif',
    '.sh', '.bash', '.csh', '.ksh',
    '.js', '.vbs', '.vbe', '.wsf', '.wsh',
  ];

  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (blockedExtensions.includes(ext)) {
    return { valid: false, error: 'File type not allowed' };
  }

  return { valid: true };
}

/**
 * Validate file for security
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File exceeds 2GB limit' };
  }

  const filenameValidation = validateFilename(file.name);
  if (!filenameValidation.valid) {
    return filenameValidation;
  }

  return { valid: true };
}

/**
 * Limit text length with truncation
 */
export function limitLength(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength);
}

/**
 * Sanitize for use in innerHTML (defense in depth)
 */
export function safeInnerHTML(input: string): string {
  return sanitizeText(input);
}
