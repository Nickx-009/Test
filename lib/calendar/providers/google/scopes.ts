/**
 * Google OAuth scopes needed for ClayTime.
 *
 * Keep scopes centralized so they are easy to audit.
 */

export const GOOGLE_BASE_SCOPES = [
  // Read calendars + free/busy.
  'https://www.googleapis.com/auth/calendar.readonly',

  // Create/update/delete events.
  'https://www.googleapis.com/auth/calendar.events',
] as const;
