/**
 * Token storage (Supabase).
 *
 * This file defines:
 * - The token store interface used by the calendar layer
 * - The expected Supabase row shape
 *
 * Implementation lives in /lib/calendar/supabase.
 */

import type { CalendarProviderId } from './provider';
import type { OAuthTokens } from './oauth';

/**
 * The Supabase table row shape you should store.
 *
 * Suggested table: `calendar_oauth_tokens`
 * Suggested uniqueness: (user_id, provider, provider_account_id)
 */
export type CalendarOAuthTokenRow = {
  id: string;

  /** Supabase auth user id (UUID). */
  user_id: string;

  provider: CalendarProviderId;

  /**
   * Provider account identifier (email/sub/oid). Allows multiple connected accounts per provider.
   * Nullable until known.
   */
  provider_account_id: string | null;

  /** Encrypted access token blob (recommended). */
  access_token: string;

  /** Encrypted refresh token blob (recommended). */
  refresh_token: string | null;

  token_type: string | null;

  /** Expiry in ms since epoch (or null if unknown). */
  expires_at: number | null;

  /** Space-separated scopes or JSON array (choose one; keep consistent). */
  scopes: string[] | null;

  /** Optional raw provider payload for debugging/auditing (keep minimal). */
  raw: Record<string, unknown> | null;

  created_at: string;
  updated_at: string;
};

export type CalendarTokenKey = {
  userId: string;
  provider: CalendarProviderId;
  /** If you allow multiple accounts per provider, include this. */
  providerAccountId?: string;
};

export interface CalendarTokenStore {
  /** Fetch tokens for a connected calendar account. */
  get(key: CalendarTokenKey): Promise<OAuthTokens | null>;

  /** Upsert tokens (merge semantics handled by the store). */
  upsert(key: CalendarTokenKey, tokens: OAuthTokens): Promise<void>;

  /** Remove tokens when a user disconnects. */
  delete(key: CalendarTokenKey): Promise<void>;
}
