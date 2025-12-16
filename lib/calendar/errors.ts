/**
 * Shared error types for calendar providers.
 *
 * Keep errors provider-agnostic so the app can handle them consistently.
 */

export class CalendarError extends Error {
  name = 'CalendarError' as const;
}

export class CalendarAuthError extends CalendarError {
  name = 'CalendarAuthError' as const;
}

export class CalendarRateLimitError extends CalendarError {
  name = 'CalendarRateLimitError' as const;
}

export class CalendarProviderError extends CalendarError {
  name = 'CalendarProviderError' as const;

  constructor(
    message: string,
    public readonly provider: string,
    public readonly cause?: unknown
  ) {
    super(message);
  }
}
