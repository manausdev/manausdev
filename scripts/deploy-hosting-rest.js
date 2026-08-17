import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
import { getAccessToken } from './firebase-auth.js';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function gzipAndHash(filePath) {
  const rawBuffer = fs.readFileSync(filePath);
  const gzBuffer = zlib.gzipSync(rawBuffer, { level: 9 });
  const hashSum = crypto.createHash('sha256');
  hashSum.update(gzBuffer);
  const hash = hashSum.digest('hex');
  return { gzBuffer, hash };
}

export async function deployHosting(siteIdOverride) {
  console.log('🚀 Iniciando deploy no Firebase Hosting via REST API...');

  // 1. Obter Access Token usando Service Account (*admin.json)
  const auth = await getAccessToken();
  const siteId = siteIdOverride || auth.projectId;
  console.log(`🔑 Autenticado como ${auth.clientEmail} para o projeto ${auth.projectId}`);
  console.log(`🌐 Site de destino: ${siteId}`);

  // 2. Verificar arquivos do dist/
  if (!fs.existsSync(DIST)) {
    throw new Error('Diretório dist/ não encontrado. Execute o build antes (ex: node build.js).');
  }

  const filePaths = getAllFiles(DIST);
  if (filePaths.length === 0) {
    throw new Error('Diretório dist/ está vazio.');
  }

  console.log(`📦 Processando ${filePaths.length} arquivos...`);

  // Mapear caminhos normalizados e calcular hashes SHA-256 do conteúdo comprimido (gzip)
  const fileHashMap = {}; // '/index.html' -> sha256
  const hashToDataMap = {}; // sha256 -> { gzBuffer, filePath, relativePath }

  for (const fPath of filePaths) {
    const relativePath = '/' + path.relative(DIST, fPath).replace(/\\/g, '/');
    const { gzBuffer, hash } = gzipAndHash(fPath);
    fileHashMap[relativePath] = hash;
    hashToDataMap[hash] = { gzBuffer, filePath: fPath, relativePath };
  }

  // 3. Criar nova versão de Hosting
  console.log('📡 Criando nova versão no Firebase Hosting...');
  const createVersionRes = await fetch(
    `https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/versions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          headers: [{ glob: '**', headers: { 'Cache-Control': 'max-age=3600' } }],
        },
      }),
    }
  );

  if (!createVersionRes.ok) {
    const err = await createVersionRes.text();
    throw new Error(`Erro ao criar versão: ${createVersionRes.status} - ${err}`);
  }

  const versionData = await createVersionRes.json();
  const versionName = versionData.name;
  console.log(`✅ Versão criada: ${versionName}`);

  // 4. Popular lista de arquivos (hashes)
  console.log('📤 Verificando arquivos necessários para upload...');
  const populateRes = await fetch(
    `https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: fileHashMap,
      }),
    }
  );

  if (!populateRes.ok) {
    const err = await populateRes.text();
    throw new Error(`Erro ao enviar manifesto de arquivos: ${populateRes.status} - ${err}`);
  }

  const populateData = await populateRes.json();
  const uploadRequiredHashes = populateData.uploadRequiredHashes || [];
  const uploadUrl = populateData.uploadUrl;

  console.log(`ℹ️ ${uploadRequiredHashes.length} arquivo(s) precisam de upload.`);

  // 5. Fazer upload dos arquivos comprimidos requisitados
  for (let i = 0; i < uploadRequiredHashes.length; i++) {
    const hash = uploadRequiredHashes[i];
    const { gzBuffer, relativePath } = hashToDataMap[hash];

    console.log(`  [${i + 1}/${uploadRequiredHashes.length}] Enviando ${relativePath}...`);

    const uploadRes = await fetch(`${uploadUrl}/${hash}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: gzBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`Falha no upload de ${relativePath}: ${uploadRes.status} - ${err}`);
    }
  }

  // 6. Finalizar versão
  console.log('🔒 Finalizando versão...');
  const finalizeRes = await fetch(
    `https://firebasehosting.googleapis.com/v1beta1/${versionName}?update_mask=status`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'FINALIZED',
      }),
    }
  );

  if (!finalizeRes.ok) {
    const err = await finalizeRes.text();
    throw new Error(`Erro ao finalizar versão: ${finalizeRes.status} - ${err}`);
  }

  // 7. Publicar release
  console.log('🚀 Publicando versão...');
  const releaseRes = await fetch(
    `https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/releases?versionName=${encodeURIComponent(versionName)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Deploy automático via REST API em ${new Date().toISOString()}`,
      }),
    }
  );

  if (!releaseRes.ok) {
    const err = await releaseRes.text();
    throw new Error(`Erro ao criar release: ${releaseRes.status} - ${err}`);
  }

  console.log('\n🎉 Deploy concluído com sucesso no Firebase Hosting!');
  console.log(`🔗 URL: https://${siteId}.web.app`);
  console.log(`🔗 URL alternativo: https://${siteId}.firebaseapp.com\n`);
}

// Executar se chamado diretamente
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('./scripts/deploy-hosting-rest.js')) {
  deployHosting().catch((err) => {
    console.error('❌ Falha no deploy:', err.message);
    process.exit(1);
  });
}
