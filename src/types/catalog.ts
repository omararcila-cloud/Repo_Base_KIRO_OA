/**
 * Tipos e interfaces para el catálogo y documentación de APIs.
 */

export type InsuranceLine = 'vida' | 'hogar' | 'autos' | 'salud';

export interface SchemaDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export type JsonSchema = Record<string, unknown>;

export interface SecurityScheme {
  type: string;
  name: string;
  description: string;
}

export interface ApiCatalogEntry {
  id: string;
  name: string;
  description: string;
  httpMethod: string;
  endpointPath: string;
  version: string;
  insuranceLine: InsuranceLine;
  hasAiMetadata: boolean;
}

export interface ApiDocumentation {
  apiId: string;
  endpointUrl: string;
  httpMethod: string;
  requestHeaders: SchemaDefinition[];
  requestBodySchema: JsonSchema;
  responseSchema: JsonSchema;
  exampleValues: Record<string, unknown>;
  securitySchemes: SecurityScheme[];
}

export interface SandboxRequest {
  headers: Record<string, string>;
  body: unknown;
  clientId: string;
  clientSecret: string;
}

export interface SandboxResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  correlationId: string;
  latencyMs: number;
}
