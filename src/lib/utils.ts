export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function safeUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    // Allow relative URLs (starting with /) as safe
    if (trimmed.startsWith('/')) return trimmed;
    const parsed = new URL(trimmed, 'http://example.com');
    // If URL was relative, parsed will use example.com base; check original
    if (!trimmed.includes('://') && !trimmed.startsWith('mailto:')) return null;
    const allowed = ['http:', 'https:', 'mailto:'];
    if (allowed.includes(parsed.protocol)) {
      return trimmed;
    }
    return null;
  } catch {
    return null;
  }
}
