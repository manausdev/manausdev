import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const CSS_FILES = [
  'css/variables.css',
  'css/global.css',
  'css/components.css',
  'css/responsive.css',
];

const JS_FILES = [
  'js/app.js',
  'js/analytics.js',
  'js/api.js',
  'js/auth.js',
  'js/logging.js',
  'js/search.js',
  'js/seed.js',
  'js/utils.js',
];

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .replace(/}\s*/g, '}')
    .replace(/:\s*/g, ':')
    .replace(/;\s*/g, ';')
    .replace(/,\s*/g, ',')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:<>=+\-*/])\s*/g, '$1')
    .trim();
}

function buildCSS() {
  const combined = CSS_FILES.map((file) => {
    const fullPath = path.join(ROOT, file);
    return fs.readFileSync(fullPath, 'utf8');
  }).join('\n');

  const minified = minifyCSS(combined);
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, 'style.min.css'), minified);
  console.log('CSS minified -> dist/style.min.css');
}

function buildJS() {
  const combined = JS_FILES.map((file) => {
    const fullPath = path.join(ROOT, file);
    return fs.readFileSync(fullPath, 'utf8');
  }).join('\n');

  const minified = minifyJS(combined);
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, 'app.min.js'), minified);
  console.log('JS minified -> dist/app.min.js');
}

function copyHTML() {
  const pages = [
    'index.html',
    'pages/sobre.html',
    'pages/termos.html',
    'pages/privacidade.html',
    'pages/contato.html',
    'pages/devs/index.html',
    'pages/devs/[username].html',
    'pages/projetos/index.html',
    'pages/projetos/[slug].html',
    'pages/projetos/novo.html',
    'pages/empresas/index.html',
    'pages/vagas/index.html',
    'pages/eventos/index.html',
    'pages/comunidades/index.html',
    'pages/conteudo/index.html',
    'pages/destaques/index.html',
    'pages/equipes/index.html',
    'pages/moderacao/index.html',
    'pages/beta/index.html',
    'pages/beta/feedback.html',
    'dashboard/index.html',
    'pages/auth/login.html',
    'pages/auth/register.html',
  ];

  pages.forEach((file) => {
    const src = path.join(ROOT, file);
    const dest = path.join(DIST, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    let content = fs.readFileSync(src, 'utf8');

    content = content.replace(/<link rel="stylesheet" href="[^"]+">/g, '<link rel="stylesheet" href="/style.min.css">');
    content = content.replace(/<link rel="stylesheet" href="[^"]+"\/>/g, '<link rel="stylesheet" href="/style.min.css">');
    content = content.replace(/<script type="module" src="[^"]+"><\/script>/g, '<script type="module" src="/app.min.js"><\/script>');
    content = content.replace(/<script src="[^"]+"><\/script>/g, '<script src="/app.min.js"><\/script>');

    fs.writeFileSync(dest, content);
  });

  console.log(`HTML copied and optimized -> dist/ (${pages.length} pages)`);
}

function copyAssets() {
  const assets = ['assets/images/feito-em-manaus.svg', 'assets/images/feito-em-manaus-dark.svg', 'assets/images/feito-em-manaus.png'];
  assets.forEach((file) => {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      const dest = path.join(DIST, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  });
  console.log('Assets copied -> dist/');
}

function clean() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
}

const isWatch = process.argv.includes('--watch');

function run() {
  console.log('Building ManausDev...');
  clean();
  buildCSS();
  buildJS();
  copyHTML();
  copyAssets();
  console.log('Build complete.');
}

run();

if (isWatch) {
  console.log('Watching for changes...');
  fs.watch(path.join(ROOT, 'css'), { recursive: true }, () => { buildCSS(); copyHTML(); console.log('CSS updated'); });
  fs.watch(path.join(ROOT, 'js'), { recursive: true }, () => { buildJS(); console.log('JS updated'); });
  fs.watch(path.join(ROOT, 'pages'), { recursive: true }, () => { copyHTML(); console.log('HTML updated'); });
}
