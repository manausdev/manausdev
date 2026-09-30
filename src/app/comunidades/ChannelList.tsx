import { getMockChannelsByCommunity } from '@/lib/data/mock';
import { platformMeta } from '@/lib/channels-meta';
import type { CommunityChannel } from '@/types/database';
import styles from './ChannelList.module.css';

export default function ChannelList({ channels }: { channels: CommunityChannel[] }) {
  if (channels.length === 0) return null;

  return (
    <ul className={styles.channelList}>
      {channels.map((channel) => {
        const meta = platformMeta(channel.platform);

        return (
          <li key={channel.id} className={styles.channelRow}>
            <span className={`${styles.platformBadge} ${styles[meta.badgeClass]}`}>
              {meta.label}
            </span>
            <span className={styles.channelName}>{channel.name}</span>
            {(channel.members_count ?? 0) > 0 && (
              <span className={styles.channelMembers}>
                {(channel.members_count ?? 0).toLocaleString('pt-BR')}
              </span>
            )}
            {channel.url && (
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className={styles.channelJoin}
              >
                Entrar
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function mockChannelsOf(communityId: string): CommunityChannel[] {
  return getMockChannelsByCommunity(communityId);
}
