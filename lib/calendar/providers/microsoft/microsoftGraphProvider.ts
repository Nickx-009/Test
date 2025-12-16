/**
 * Microsoft Graph Calendar provider implementation.
 *
 * This file will:
 * - Implement CalendarProvider
 * - Use Microsoft identity platform (v2) endpoints for auth/token refresh
 * - Call Microsoft Graph Calendar endpoints for calendars, events, availability
 *
 * NOTE: This is an empty stub by design (architecture only).
 */

import type { CalendarProvider } from '../../types';

export class MicrosoftGraphProvider implements CalendarProvider {
  readonly id = 'microsoft' as const;

  // TODO: add constructor for clientId/clientSecret/tenant/etc.

  async getAuthorizationUrl(): Promise<string> {
    throw new Error('Not implemented');
  }

  async exchangeCodeForTokens(): Promise<any> {
    throw new Error('Not implemented');
  }

  async refreshAccessToken(): Promise<any> {
    throw new Error('Not implemented');
  }

  async revokeTokens(): Promise<void> {
    throw new Error('Not implemented');
  }

  async listCalendars(): Promise<any> {
    throw new Error('Not implemented');
  }

  async getFreeBusy(): Promise<any> {
    throw new Error('Not implemented');
  }

  async createEvent(): Promise<any> {
    throw new Error('Not implemented');
  }

  async updateEvent(): Promise<any> {
    throw new Error('Not implemented');
  }

  async deleteEvent(): Promise<void> {
    throw new Error('Not implemented');
  }
}
