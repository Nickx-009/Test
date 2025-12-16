/**
 * Provider-agnostic entrypoint.
 *
 * ClayTime app code should talk to this layer rather than calling Google/Microsoft SDKs directly.
 *
 * Eventually this will:
 * - Select a provider based on an integration record (e.g., provider: 'google' | 'microsoft')
 * - Load OAuth tokens from the token store (Supabase)
 * - Call the provider implementation
 */

import type { CalendarProvider } from './types';

export type CalendarClientConfig = {
  /** Registry of providers available in this deployment. */
  providers: Record<string, CalendarProvider>;
};

export class CalendarClient {
  // TODO: implement provider selection + token wiring.
  constructor(private readonly _config: CalendarClientConfig) {}
}
