// src/profile-loader.ts - Load and cache model profiles from DB or environment
import type { ModelProfileConfig } from './types.js';

export interface ProfileStore {
  findDefault(): Promise<ModelProfileConfig | null>;
  findByName(name: string): Promise<ModelProfileConfig | null>;
}

/**
 * In-memory profile store — used in tests / when no DB connection is available.
 */
export class InMemoryProfileStore implements ProfileStore {
  constructor(private readonly profiles: ModelProfileConfig[]) {}

  async findDefault(): Promise<ModelProfileConfig | null> {
    return this.profiles.find((p) => p.isDefault) ?? null;
  }

  async findByName(name: string): Promise<ModelProfileConfig | null> {
    return this.profiles.find((p) => p.name === name) ?? null;
  }
}

/**
 * Default profile derived from environment variables only (no DB needed).
 * Used as fallback when no ProfileStore is provided.
 */
export function envDefaultProfile(): ModelProfileConfig {
  return {
    id: 'env-default',
    name: 'env-default',
    provider: process.env['LLM_PROVIDER'] ?? 'ollama',
    model: process.env['LLM_MODEL'] ?? 'qwen2.5:3b',
    apiBase: process.env['LITELLM_BASE_URL'] ?? 'http://localhost:4000',
    config: {},
    isDefault: true,
  };
}
