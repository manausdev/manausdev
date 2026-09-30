import { SparklesIcon, ShieldIcon, HeartIcon, CompassIcon } from '@/components/icons';
import styles from './sobre.module.css';

export default function SobrePage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <SparklesIcon />
          <span>Manifesto & Visão</span>
        </div>
        <h1 className={styles.heroTitle}>
          Sobre o <span className={styles.heroAccent}>ManausDev</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Nossa missão é conectar, potencializar e dar visibilidade global aos talentos de tecnologia e bioeconomia que constroem a partir do Amazonas.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>O que é a Plataforma?</h2>
          <p className={styles.sectionText}>
            O <strong>ManausDev</strong> é uma iniciativa independente e aberta voltada a centralizar o ecossistema tecnológico de Manaus e de todo o estado do Amazonas. Conectamos desenvolvedores, designers, pesquisadores, dados, comunidades locais e empresas do Polo Industrial e de bioeconomia sustentável.
          </p>
        </div>

        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <CompassIcon />
            </div>
            <h3 className={styles.pillarTitle}>Visibilidade Regional</h3>
            <p className={styles.pillarText}>
              Dar palco aos projetos de software e inovação criados por profissionais no Norte do Brasil.
            </p>
          </div>

          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <HeartIcon />
            </div>
            <h3 className={styles.pillarTitle}>Comunidade & Open Source</h3>
            <p className={styles.pillarText}>
              Fortalecer grupos de estudo, meetups e compartilhamento livre de conhecimento técnico.
            </p>
          </div>

          <div className={styles.pillar}>
            <div className={styles.pillarIcon}>
              <ShieldIcon />
            </div>
            <h3 className={styles.pillarTitle}>Conexão com Mercado</h3>
            <p className={styles.pillarText}>
              Aproximar talentos de empresas inovadoras e oportunidades no Polo Industrial e exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
