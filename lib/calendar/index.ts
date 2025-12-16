/**
 * Calendar integration layer (provider-agnostic).
 *
 * This module exposes:
 * - A common provider interface
 * - Shared types
 * - Provider implementations (Google, Microsoft)
 * - Token storage contracts (Supabase-backed)
 */

export * from './types';
export * from './client';
export * from './errors';

export * as Providers from './providers';
export * as SupabaseTokenStore from './supabase';
