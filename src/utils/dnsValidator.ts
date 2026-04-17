/**
 * Validador de configuraciones solo-DNS.
 */

export interface DnsValidationResult { valid: boolean; error?: string; }

const IPV4_PATTERN = /(?:^|\b|\/\/)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?:\b|:|\/|$)/;
const IPV6_PATTERN = /(?:^|\b|\/\/)\[?(?:::(?:\d{1,3}\.){3}\d{1,3}|::[\da-fA-F]*|[\da-fA-F]{1,4}:[\da-fA-F:]*(?:::[\da-fA-F:]*)?(?::[\da-fA-F]{1,4})*)\]?(?:\/|$|:|\b)/;
const DNS_HOSTNAME_PATTERN = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function validateDnsConfig(config: string): DnsValidationResult {
  if (!config || typeof config !== 'string') {
    return { valid: false, error: 'La configuración es requerida y debe ser una cadena de texto' };
  }
  const trimmed = config.trim();
  if (trimmed.length === 0) return { valid: false, error: 'La configuración no puede estar vacía' };
  if (IPV4_PATTERN.test(trimmed)) return { valid: false, error: 'Se detectó una dirección IPv4 hardcodeada. Use un nombre DNS en su lugar' };
  if (IPV6_PATTERN.test(trimmed)) return { valid: false, error: 'Se detectó una dirección IPv6 hardcodeada. Use un nombre DNS en su lugar' };
  let hostname = trimmed;
  const protocolMatch = trimmed.match(/^https?:\/\/([^/:]+)/);
  if (protocolMatch) hostname = protocolMatch[1];
  const pathIndex = hostname.indexOf('/');
  if (pathIndex !== -1) hostname = hostname.slice(0, pathIndex);
  const portIndex = hostname.indexOf(':');
  if (portIndex !== -1) hostname = hostname.slice(0, portIndex);
  if (!DNS_HOSTNAME_PATTERN.test(hostname)) {
    return { valid: false, error: 'El hostname no es un nombre DNS válido. Debe ser un dominio como "api.ejemplo.com"' };
  }
  return { valid: true };
}
