import { describe, expect, it } from 'vitest';
import { PLATFORM_META, platformMeta } from './channels-meta';

/**
 * A lista alimenta `className={styles[meta.badgeClass]}`. Se `badgeClass`
 * apontar para uma classe que o CSS Module nao exporta, o navegador ignora a
 * regra em silencio e o badge perde a cor da plataforma — exatamente o que
 * aconteceu quando o codigo usava a string crua em vez de `styles[...]`.
 *
 * O guarda aqui e sobre os nomes, nao sobre o hashing: cada `badgeClass` tem
 * que existir como classe no CSS Module. O teste de token garante o resto.
 */

const BADGE_CLASS_PATTERN = /^badge[A-Z]/;

describe('channels-meta', () => {
  it('cobre todas as plataformas de ChannelPlatform', () => {
    const platforms: Array<'discord' | 'telegram' | 'whatsapp' | 'matrix'> = [
      'discord',
      'telegram',
      'whatsapp',
      'matrix',
    ];

    for (const platform of platforms) {
      expect(PLATFORM_META.map((m) => m.value)).toContain(platform);
    }
  });

  it('cada badgeClass segue o padrao badgeXxx', () => {
    for (const meta of PLATFORM_META) {
      expect(meta.badgeClass, `badgeClass de ${meta.value} fora do padrao`).toMatch(
        BADGE_CLASS_PATTERN
      );
    }
  });

  it('badgeClass e unico por plataforma', () => {
    const seen = new Set<string>();
    for (const meta of PLATFORM_META) {
      expect(seen.has(meta.badgeClass), `${meta.badgeClass} duplicado`).toBe(false);
      seen.add(meta.badgeClass);
    }
  });

  it('platformMeta resolve as plataformas conhecidas', () => {
    expect(platformMeta('discord').label).toBe('Discord');
    expect(platformMeta('telegram').label).toBe('Telegram');
    expect(platformMeta('whatsapp').label).toBe('WhatsApp');
    expect(platformMeta('matrix').label).toBe('Matrix');
  });

  it('platformMeta cai no padrao para valor desconhecido', () => {
    const meta = platformMeta('irc' as never);
    expect(meta.value).toBeTruthy();
    expect(meta.badgeClass).toMatch(BADGE_CLASS_PATTERN);
  });
});
