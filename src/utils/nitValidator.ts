/**
 * Validador de NIT colombiano.
 */

export interface NitValidationResult { valid: boolean; error?: string; }

const NIT_WEIGHTS = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];

function calculateVerificationDigit(digits: string): number {
  const paddedDigits = digits.padStart(NIT_WEIGHTS.length, '0');
  let sum = 0;
  for (let i = 0; i < NIT_WEIGHTS.length; i++) {
    sum += parseInt(paddedDigits[i], 10) * NIT_WEIGHTS[i];
  }
  const remainder = sum % 11;
  if (remainder === 0 || remainder === 1) return remainder;
  return 11 - remainder;
}

export function validateNit(nit: string): NitValidationResult {
  if (!nit || typeof nit !== 'string') {
    return { valid: false, error: 'El NIT es requerido y debe ser una cadena de texto' };
  }
  if (!/^\d+$/.test(nit)) {
    return { valid: false, error: 'El NIT debe contener solo dígitos numéricos' };
  }
  if (nit.length < 9 || nit.length > 10) {
    return { valid: false, error: 'El NIT debe tener entre 9 y 10 dígitos' };
  }
  const baseDigits = nit.slice(0, -1);
  const providedVerificationDigit = parseInt(nit[nit.length - 1], 10);
  const calculatedVerificationDigit = calculateVerificationDigit(baseDigits);
  if (providedVerificationDigit !== calculatedVerificationDigit) {
    return { valid: false, error: `El dígito de verificación es incorrecto. Se esperaba ${calculatedVerificationDigit}` };
  }
  return { valid: true };
}
