/**
 * The main interface BOTH providers (Google + Microsoft) must implement.
 *
 * Design goals:
 * - Avoid leaking provider-specific SDK types.
 * - Use simple inputs/outputs that map cleanly to both APIs.
 * - Make token handling explicit so we can store tokens in Supabase.
 */

import type {
  Calendar,
  CalendarEvent,
  CreateEventInput,
  DeleteEventInput,
  FreeBusyQuery,
  FreeBusyResponse,
  ListCalendarsResponse,
  OAuthAuthorizationUrlInput,
  OAuthTokenExchangeInput,
  OAuthTokens,
  RefreshAccessTokenInput,
  UpdateEventInput,
} from './index';

export type CalendarProviderId = 'google' | 'microsoft';

export interface CalendarProvider {
  /** Provider identifier used throughout the app + database. */
  readonly id: CalendarProviderId;

  /**
   * Build the provider's OAuth authorization URL.
   *
   * The UI will redirect the user here to connect their calendar.
   */
  getAuthorizationUrl(input: OAuthAuthorizationUrlInput): Promise<string>;

  /**
   * Exchange an OAuth authorization code for tokens.
   *
   * The returned tokens must be persisted via the token store (Supabase).
   */
  exchangeCodeForTokens(input: OAuthTokenExchangeInput): Promise<OAuthTokens>;

  /**
   * Refresh an access token using a refresh token.
   *
   * The returned tokens must replace/merge into persisted tokens.
   */
  refreshAccessToken(input: RefreshAccessTokenInput): Promise<OAuthTokens>;

  /**
   * Revoke access for this integration.
   *
   * Called when a user disconnects their calendar.
   */
  revokeTokens(tokens: OAuthTokens): Promise<void>;

  /**
   * List calendars available for the connected account.
   */
  listCalendars(tokens: OAuthTokens): Promise<ListCalendarsResponse>;

  /**
   * Run a Free/Busy query for one or more calendars.
   */
  getFreeBusy(tokens: OAuthTokens, query: FreeBusyQuery): Promise<FreeBusyResponse>;

  /**
   * Create an event in a calendar.
   */
  createEvent(tokens: OAuthTokens, input: CreateEventInput): Promise<CalendarEvent>;

  /**
   * Update an event in a calendar.
   */
  updateEvent(tokens: OAuthTokens, input: UpdateEventInput): Promise<CalendarEvent>;

  /**
   * Delete/cancel an event.
   */
  deleteEvent(tokens: OAuthTokens, input: DeleteEventInput): Promise<void>;

  /**
   * Optional: fetch a single calendar by id (handy for validation).
   */
  getCalendar?(tokens: OAuthTokens, calendarId: string): Promise<Calendar>;
}
