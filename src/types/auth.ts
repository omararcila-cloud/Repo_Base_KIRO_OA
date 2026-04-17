/**
 * Tipos e interfaces para autenticación y sesiones.
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface TokenValidationResult {
  valid: boolean;
  partnerNit: string;
  roles: string[];
  scopes: string[];
}
