export const isDev = process.env.NODE_ENV === 'development';

export const isProduction = process.env.NODE_ENV === 'production';

export function useMockData(): boolean {
  return isDev || process.env.NEXT_PUBLIC_USE_MOCK === 'true';
}