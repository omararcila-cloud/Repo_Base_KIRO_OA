/**
 * Tipos para OpenAPI 3.1 parsing y serialización.
 */

export interface ApiInfo { title: string; description: string; version: string; }
export interface Components { schemas: Record<string, unknown>; }
export interface AiDescription { description: string; }
export interface SecurityScheme { type: string; name: string; description: string; }
export interface Parameter { name: string; in: string; required: boolean; description: string; schema: Record<string, unknown>; }
export interface RequestBody { description: string; required: boolean; content: Record<string, { schema: Record<string, unknown> }>; }
export interface ResponseDef { description: string; content?: Record<string, { schema: Record<string, unknown> }>; }
export type SecurityRequirement = Record<string, string[]>;

export interface InternalApiSpec {
  openApiVersion: string;
  info: ApiInfo;
  paths: Record<string, PathItem>;
  components: Components;
  securitySchemes: Record<string, SecurityScheme>;
  aiMetadata: Record<string, AiDescription>;
}

export interface PathItem { [method: string]: Operation; }

export interface Operation {
  operationId: string;
  summary: string;
  description: string;
  aiDescription?: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, ResponseDef>;
  security: SecurityRequirement[];
}

export interface ParseError { line: number; column: number; message: string; severity: 'error' | 'warning'; }
