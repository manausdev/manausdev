import { SparklesIcon, ShieldIcon, HeartIcon, CompassIcon } from '@/components/icons';
import styles from './sobre.module.css';

export default function SobrePage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <SparklesIcon className={styles.badgeIcon} />
          <span>Manifesto & Visão</span>
        </div>
        <h1 className={styles.heroTitle}>
          Sobre o <span className={styles.accent}>ManausDev</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Nossa missão é conectar, potencializar e dar visibilidade global aos talentos de tecnologia e bioeconomia que constroem a partir do Amazonas.
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.introCard}>
          <h2 className={styles.introTitle}>O que é a Plataforma?</h2>
          <p>
            O <strong>ManausDev</strong> é uma iniciativa independente e aberta voltada a centralizar o ecossistema tecnológico de Manaus e de todo o estado do Amazonas. Conectamos desenvolvedores, designers, pesquisadores, dados, comunidades locais e empresas do Polo Industrial e de bioeconomia sustentável.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.valueCard} ${styles.valueCardDeep}`}>
            <div className={`${styles.iconBox} ${styles.iconBoxDeep}`}>
              <CompassIcon className={styles.icon} />
            </div>
            <h3 className={styles.valueTitle}>Visibilidade Regional</h3>
            <p className={styles.valueText}>
              Dar palco aos projetos de software e inovação criados por profissionais no Norte do Brasil.
            </p>
          </div>

          <div className={`${styles.valueCard} ${styles.valueCardAccent}`}>
            <div className={`${styles.iconBox} ${styles.iconBoxAccent}`}>
              <HeartIcon className={styles.icon} />
            </div>
            <h3 className={styles.valueTitle}>Comunidade & Open Source</h3>
            <p className={styles.valueText}>
              Fortalecer grupos de estudo, meetups e compartilhamento livre de conhecimento técnico.
            </p>
          </div>

          <div className={`${styles.valueCard} ${styles.valueCardCyan}`}>
            <div className={`${styles.iconBox} ${styles.iconBoxDeep}`}>
              <ShieldIcon className={styles.icon} />
            </div>
            <h3 className={styles.valueTitle}>Conexão com Mercado</h3>
            <p className={styles.valueText}>
              Aproximar talentos de empresas inovadoras e oportunidades no Polo Industrial e exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
