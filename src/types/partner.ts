/**
 * Tipos e interfaces para el módulo de aliados (partners).
 */

export type PartnerStatus = 'pending' | 'validated' | 'active' | 'suspended';

export interface RegistrationError {
  code: string;
  message: string;
}

export interface Partner {
  id: string;
  organizationName: string;
  nit: string;
  camaraComercioNumber: string;
  legalRepName: string;
  legalRepEmail: string;
  legalRepPhone: string;
  status: PartnerStatus;
  rbacRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerRegistrationInput {
  organizationName: string;
  nit: string;
  camaraComercioNumber: string;
  legalRepName: string;
  legalRepEmail: string;
  legalRepPhone: string;
}

export interface PartnerRegistrationResult {
  success: boolean;
  partnerId: string;
  nextStep: 'identity_validation' | 'error';
  error?: RegistrationError;
}
