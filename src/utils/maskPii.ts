/**
 * Enmascaramiento de datos PII.
 */

export function maskPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '****';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '****';
  return `****${digits.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '****';
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return '****';
  return `****${email.slice(atIndex)}`;
}
