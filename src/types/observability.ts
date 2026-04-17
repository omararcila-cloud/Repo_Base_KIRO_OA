/**
 * Tipos para observabilidad: logs estructurados y trazas distribuidas.
 */

export interface Span {
  spanId: string;
  name: string;
  correlationId: string;
  startTime: string;
  endTime?: string;
}

export interface StructuredLog {
  correlationId: string;
  timestamp: string;
  serviceName: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, unknown>;
}

export interface TracerService {
  startSpan(name: string, correlationId: string): Span;
  endSpan(span: Span): void;
  emitLog(entry: StructuredLog): void;
}
