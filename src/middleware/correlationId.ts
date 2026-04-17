/**
 * Middleware de Correlation-ID para trazabilidad end-to-end.
 */

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

export function extractCorrelationId(headers: Headers): string | undefined {
  const value = headers.get(CORRELATION_ID_HEADER);
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function correlationIdMiddleware(req: Request): string {
  const existing = extractCorrelationId(req.headers);
  if (existing) return existing;
  return crypto.randomUUID();
}
