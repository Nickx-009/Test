/**
 * Supabase-backed token store.
 *
 * This file will:
 * - Read/write OAuth tokens to a Supabase table (e.g. calendar_oauth_tokens)
 * - Optionally encrypt tokens before storing (recommended)
 * - Handle upsert semantics and providerAccountId discovery
 *
 * NOTE: This is an empty stub by design (architecture only).
 */

import type { CalendarTokenKey, CalendarTokenStore, OAuthTokens } from '../types';

export type SupabaseTokenStoreConfig = {
  /**
   * A Supabase client instance (either service role on server, or user session client).
   *
   * Type intentionally kept as unknown here to avoid coupling this layer to a specific
   * Supabase client import path until your app wiring is decided.
   */
  supabase: unknown;

  /**
   * Table name override (default: 'calendar_oauth_tokens').
   */
  tableName?: string;
};

export class SupabaseCalendarTokenStore implements CalendarTokenStore {
  constructor(private readonly _config: SupabaseTokenStoreConfig) {}

  async get(_key: CalendarTokenKey): Promise<OAuthTokens | null> {
    throw new Error('Not implemented');
  }

  async upsert(_key: CalendarTokenKey, _tokens: OAuthTokens): Promise<void> {
    throw new Error('Not implemented');
  }

  async delete(_key: CalendarTokenKey): Promise<void> {
    throw new Error('Not implemented');
  }
}
