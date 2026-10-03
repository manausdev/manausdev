import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const alt = 'ManausDev — o ecossistema de tecnologia do Amazonas';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c2233 0%, #123a4f 55%, #0c2233 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              background: '#0068e8',
              color: '#ffffff',
              fontSize: '52px',
              fontWeight: 700,
            }}
          >
            {'</>'}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontSize: '72px',
                fontWeight: 700,
                letterSpacing: '-2px',
              }}
            >
              ManausDev
            </div>
            <div
              style={{
                display: 'flex',
                color: '#2ed6d2',
                fontSize: '30px',
                fontWeight: 600,
                letterSpacing: '8px',
              }}
            >
              AMAZONAS • TECH
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#f2f5f8',
            fontSize: '40px',
            fontWeight: 500,
            maxWidth: '900px',
            lineHeight: 1.3,
          }}
        >
          O ecossistema que conecta desenvolvedores, comunidades, empresas e projetos do Amazonas.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '28px',
            color: '#4bd76d',
            fontSize: '28px',
            fontWeight: 600,
          }}
        >
          manausdev.com.br
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
