/**
 * OAuth types (provider-agnostic).
 *
 * Providers will fill these from Google OAuth2 or Microsoft identity platform.
 */

import type { CalendarProviderId } from './provider';

export type OAuthAuthorizationUrlInput = {
  provider: CalendarProviderId;

  /**
   * Where the provider should redirect after auth.
   * Must match configured redirect URIs in Google/Microsoft apps.
   */
  redirectUri: string;

  /**
   * CSRF protection + request correlation.
   * Persist this server-side (or sign it) and validate on callback.
   */
  state: string;

  /**
   * Extra provider-specific scopes to request.
   * (Base scopes will be enforced by each provider module.)
   */
  scopes?: string[];

  /** Optional login hint (email) if your UI has it. */
  loginHint?: string;

  /** Optional: force consent prompt. */
  prompt?: 'consent' | 'select_account' | 'none';
};

export type OAuthTokenExchangeInput = {
  redirectUri: string;
  code: string;
};

export type RefreshAccessTokenInput = {
  refreshToken: string;
};

export type OAuthTokens = {
  provider: CalendarProviderId;

  /** Access token used for provider API calls. */
  accessToken: string;

  /** Refresh token (may be absent depending on consent + provider). */
  refreshToken?: string;

  /** Token type (usually 'Bearer'). */
  tokenType?: string;

  /** Provider-issued expiry timestamp (ms since epoch). */
  expiresAt?: number;

  /** Granted scopes, normalized. */
  scopes?: string[];

  /**
   * Provider account identifier when known (e.g., Google sub/email, Microsoft oid).
   * Useful for detecting account changes/reconnects.
   */
  providerAccountId?: string;

  /** Optional ID token when issued. */
  idToken?: string;
};
