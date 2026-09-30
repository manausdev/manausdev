import type { ChannelPlatform } from '@/types/database';

export interface PlatformMeta {
  value: ChannelPlatform;
  label: string;
  /** Classe do CSS Module do card; o tom vive no CSS, não em utilitário solto. */
  badgeClass: string;
}

export const PLATFORM_META: PlatformMeta[] = [
  { value: 'discord', label: 'Discord', badgeClass: 'badgeDiscord' },
  { value: 'telegram', label: 'Telegram', badgeClass: 'badgeTelegram' },
  { value: 'whatsapp', label: 'WhatsApp', badgeClass: 'badgeWhatsapp' },
  { value: 'matrix', label: 'Matrix', badgeClass: 'badgeMatrix' },
];

const BY_PLATFORM: Record<ChannelPlatform, PlatformMeta> = {
  discord: PLATFORM_META[0],
  telegram: PLATFORM_META[1],
  whatsapp: PLATFORM_META[2],
  matrix: PLATFORM_META[3],
};

export function platformMeta(value?: string | null): PlatformMeta {
  return (value as ChannelPlatform) in BY_PLATFORM ? BY_PLATFORM[value as ChannelPlatform] : PLATFORM_META[0];
}
