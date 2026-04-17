/**
 * Tipos para el manifiesto AI compatible con GPT-4 Tools.
 */

export interface AiParameterDef {
  type: string;
  description: string;
  enum?: string[];
  example?: unknown;
}

export interface AiManifest {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, AiParameterDef>;
      required: string[];
    };
  };
}
