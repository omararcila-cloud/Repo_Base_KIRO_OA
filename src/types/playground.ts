/**
 * Tipos para el módulo AI Playground.
 */

export interface AiLogEntry {
  interpretedIntent: string;
  selectedEndpoint: string;
  constructedPayload: unknown;
  rawResponse: unknown;
  correlationId: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  logEntry?: AiLogEntry;
}

export interface AiAgentResponse {
  humanReadableSummary: string;
  logEntry: AiLogEntry;
  suggestedPrompts?: string[];
  error?: { code: string; message: string; correlationId: string; };
}
