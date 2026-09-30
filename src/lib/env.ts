export const isDev = process.env.NODE_ENV === 'development';

export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Mock/demo data is ONLY allowed when explicitly opted-in.
 * Production must never enable NEXT_PUBLIC_USE_MOCK.
 */
export function useMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === 'true';
}
