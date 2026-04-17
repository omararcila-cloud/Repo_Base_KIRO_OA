/**
 * Middleware de autenticación JWT.
 */

import * as jose from 'jose';
import type { TokenValidationResult } from '@/types/auth';

export const ACCESS_TOKEN_COOKIE = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE = 'sb_refresh_token';

let jwtSecret: Uint8Array = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'default-dev-secret-do-not-use-in-production'
);

let refreshTokenHandler: (refreshToken: string) => Promise<string | null> = async () => null;

export function setJwtSecret(secret: string): void {
  jwtSecret = new TextEncoder().encode(secret);
}

export function getJwtSecret(): Uint8Array { return jwtSecret; }

export function setRefreshTokenHandler(handler: (refreshToken: string) => Promise<string | null>): void {
  refreshTokenHandler = handler;
}

export function extractCookieValue(req: Request, cookieName: string): string | undefined {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.split('=');
    if (name.trim() === cookieName) {
      const value = valueParts.join('=').trim();
      return value.length > 0 ? value : undefined;
    }
  }
  return undefined;
}

export async function validateJwt(token: string): Promise<TokenValidationResult> {
  const { payload } = await jose.jwtVerify(token, jwtSecret, { algorithms: ['HS256'] });
  return {
    valid: true,
    partnerNit: (payload.partnerNit as string) ?? '',
    roles: (payload.roles as string[]) ?? [],
    scopes: (payload.scopes as string[]) ?? [],
  };
}

export class AuthError extends Error {
  public readonly code: string;
  public readonly correlationId: string;
  constructor(message: string, code: string, correlationId: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.correlationId = correlationId;
  }
}

export async function authMiddleware(req: Request, correlationId: string): Promise<TokenValidationResult> {
  const accessToken = extractCookieValue(req, ACCESS_TOKEN_COOKIE);
  if (!accessToken) {
    throw new AuthError('Token de acceso no encontrado en cookies', 'AUTH_TOKEN_MISSING', correlationId);
  }
  try {
    return await validateJwt(accessToken);
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return await attemptTokenRefresh(req, correlationId);
    }
    throw new AuthError('Token de acceso inválido', 'AUTH_TOKEN_INVALID', correlationId);
  }
}

async function attemptTokenRefresh(req: Request, correlationId: string): Promise<TokenValidationResult> {
  const refreshToken = extractCookieValue(req, REFRESH_TOKEN_COOKIE);
  if (!refreshToken) {
    throw new AuthError('Refresh token no encontrado. Inicie sesión nuevamente.', 'AUTH_REFRESH_TOKEN_MISSING', correlationId);
  }
  const newAccessToken = await refreshTokenHandler(refreshToken);
  if (!newAccessToken) {
    throw new AuthError('Sesión expirada. Inicie sesión nuevamente.', 'AUTH_SESSION_EXPIRED', correlationId);
  }
  try {
    return await validateJwt(newAccessToken);
  } catch {
    throw new AuthError('Error al validar el nuevo token de acceso', 'AUTH_REFRESH_FAILED', correlationId);
  }
}

export function hasRequiredAccess(result: TokenValidationResult, requiredRole: string, requiredScope: string): boolean {
  if (!result.valid) return false;
  return result.roles.includes(requiredRole) && result.scopes.includes(requiredScope);
}
