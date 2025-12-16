/**
 * Provider-agnostic calendar data models.
 *
 * These types represent the shapes ClayTime needs for scheduling.
 * Providers will map Google/Microsoft payloads into these.
 */

export type ISODateTime = string; // e.g. '2025-12-16T15:30:00Z'

export type TimeRange = {
  start: ISODateTime;
  end: ISODateTime;
};

export type Calendar = {
  id: string;
  name: string;
  /** Whether the calendar is writable by the connected account. */
  canWrite?: boolean;
  /** Primary calendar indicator if the provider exposes it. */
  isPrimary?: boolean;
  /** Optional time zone identifier (IANA) when available. */
  timeZone?: string;
};

export type Attendee = {
  email: string;
  name?: string;
  /** Provider-specific response status normalized where possible. */
  responseStatus?: 'needsAction' | 'accepted' | 'declined' | 'tentative';
};

export type CalendarEvent = {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  start: ISODateTime;
  end: ISODateTime;
  timeZone?: string;
  attendees?: Attendee[];
  /** Video meeting link if present/created (Google Meet / Teams). */
  conferenceUrl?: string;
  /** A stable link to view the event in the provider UI, if available. */
  htmlLink?: string;
};

export type ListCalendarsResponse = {
  calendars: Calendar[];
};

export type FreeBusyQuery = {
  /**
   * Query window.
   * Providers will typically cap this (e.g., max range); we enforce limits at a higher layer.
   */
  range: TimeRange;

  /** One or more calendar IDs to evaluate busy blocks for. */
  calendarIds: string[];
};

export type FreeBusySlot = TimeRange;

export type FreeBusyResponse = {
  /** Busy blocks per calendar id. */
  busy: Record<string, FreeBusySlot[]>;
};

export type CreateEventInput = {
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  start: ISODateTime;
  end: ISODateTime;
  timeZone?: string;
  attendees?: Attendee[];

  /**
   * If enabled, the provider should attempt to create a conferencing link.
   * (Google Meet / Microsoft Teams).
   */
  createConference?: boolean;
};

export type UpdateEventInput = {
  calendarId: string;
  eventId: string;
  patch: Partial<Omit<CreateEventInput, 'calendarId'>>;
};

export type DeleteEventInput = {
  calendarId: string;
  eventId: string;
};
