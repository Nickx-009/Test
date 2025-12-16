/**
 * Microsoft identity platform scopes needed for ClayTime.
 *
 * For delegated user access to calendars via Microsoft Graph.
 */

export const MICROSOFT_BASE_SCOPES = [
  // Basic profile (often useful for account identification).
  'openid',
  'profile',
  'email',

  // Read calendars + free/busy-ish via event queries.
  'Calendars.Read',

  // Create/update/delete events.
  'Calendars.ReadWrite',

  // Required for refresh tokens in many flows.
  'offline_access',
] as const;
