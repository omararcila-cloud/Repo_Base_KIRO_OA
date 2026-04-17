/**
 * Tipos para resiliencia: Rate Limiter y Circuit Breaker.
 */

export interface RateLimitConfig {
  maxRequestsPerSecond: number;
  windowMs: number;
}

export interface CircuitBreakerState {
  status: 'closed' | 'open' | 'half-open';
  failureCount: number;
  cooldownMs: number;
  lastFailureAt?: string;
}
