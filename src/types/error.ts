/**
 * Tipos para manejo estandarizado de errores.
 */

export interface ApiError {
  code: string;
  message: string;
  correlationId: string;
  details?: Record<string, string>;
  retryable: boolean;
  timestamp: string;
}

export type ComponentState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: ApiError }
  | { status: 'empty'; message: string }
  | { status: 'success'; data: T };
