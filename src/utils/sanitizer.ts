/**
 * Sanitización de inputs del usuario.
 */

import type { JsonSchema } from '@/types/catalog';

const SQL_INJECTION_PATTERNS: RegExp[] = [
  /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b\s/gi,
  /\bUNION\b\s+(ALL\s+)?SELECT\b/gi,
  /\bSELECT\b\s+.*\bFROM\b/gi,
  /--/g,
  /;(?=\s*(?:DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE|SELECT|EXEC|EXECUTE)\b)/gi,
  /\/\*[\s\S]*?\*\//g,
  /\b(OR|AND)\b\s+\d+\s*=\s*\d+/gi,
  /'\s*(OR|AND)\s+'/gi,
];

const XSS_PATTERNS: RegExp[] = [
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /<script\b[^>]*>/gi,
  /\bon\w+\s*=/gi,
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<img\b[^>]*\bon\w+\s*=/gi,
  /<svg\b[^>]*\bon\w+\s*=/gi,
];

const COMMAND_INJECTION_PATTERNS: RegExp[] = [
  /\$\([^)]*\)/g,
  /`[^`]*`/g,
  /\|(?!\|)/g,
  /&&/g,
  /;\s*(?:rm|cat|ls|wget|curl|chmod|chown|kill|sudo|bash|sh|cmd|powershell)\b/gi,
  />\s*\/\w/g,
];

function sanitizeString(value: string): string {
  let sanitized = value;
  for (const pattern of SQL_INJECTION_PATTERNS) sanitized = sanitized.replace(pattern, '');
  for (const pattern of XSS_PATTERNS) sanitized = sanitized.replace(pattern, '');
  for (const pattern of COMMAND_INJECTION_PATTERNS) sanitized = sanitized.replace(pattern, '');
  return sanitized.trim();
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return sanitizeString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitizedObj[sanitizeString(key)] = sanitizeValue(val);
    }
    return sanitizedObj;
  }
  return value;
}

export function sanitizeInput<T>(input: unknown, _schema: JsonSchema): T {
  if (input === undefined) throw new Error('El input no puede ser undefined');
  return sanitizeValue(input) as T;
}
