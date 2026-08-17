import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Finds the service account JSON (*admin.json or *firebase-adminsdk*.json) in project root.
 */
export function findServiceAccountKey(rootDir = process.cwd()) {
  const files = fs.readdirSync(rootDir);
  const keyFile = files.find(
    (f) =>
      (f.includes('admin') || f.includes('firebase-adminsdk')) &&
      f.endsWith('.json') &&
      f !== 'package.json' &&
      f !== 'package-lock.json' &&
      f !== 'firebase.json'
  );

  if (!keyFile) {
    throw new Error('Nenhum arquivo de service account (*admin.json ou *firebase-adminsdk*.json) encontrado no diretório.');
  }

  const keyPath = path.join(rootDir, keyFile);
  const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  return { credentials, keyPath, fileName: keyFile };
}

/**
 * Creates and signs a Google OAuth2 JWT assertion.
 */
function createJwtAssertion(credentials, scopes) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: scopes.join(' '),
  };

  const base64UrlEncode = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer
    .sign(credentials.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signatureInput}.${signature}`;
}

/**
 * Obtains an OAuth2 Access Token using the Service Account JWT bearer.
 */
export async function getAccessToken(
  scopes = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/firebase',
    'https://www.googleapis.com/auth/datastore',
  ],
  rootDir = process.cwd()
) {
  const { credentials, fileName } = findServiceAccountKey(rootDir);
  const assertion = createJwtAssertion(credentials, scopes);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Falha ao obter access token OAuth2: ${res.status} - ${errorText}`);
  }

  const tokenData = await res.json();
  return {
    accessToken: tokenData.access_token,
    expiresIn: tokenData.expires_in,
    projectId: credentials.project_id,
    clientEmail: credentials.client_email,
    keyFile: fileName,
  };
}
