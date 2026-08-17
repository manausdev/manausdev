import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PORT = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  let fullPath = path.join(ROOT, reqUrl);

  // If path is directory or ends with '/', append index.html
  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      fullPath = path.join(fullPath, 'index.html');
    }
  } catch {}

  // If file doesn't exist, try appending .html
  if (!fs.existsSync(fullPath) && fs.existsSync(fullPath + '.html')) {
    fullPath = fullPath + '.html';
  }

  const ext = path.extname(fullPath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Página não encontrada</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro interno do servidor: ' + err.message);
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`ManausDev server running at http://localhost:${PORT}`);
});
