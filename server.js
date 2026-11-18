const fs = require('fs');
const http = require('http');
const path = require('path');
const { askAI } = require('./server/askAI');

const root = __dirname;
const port = Number(process.env.PORT || 3000);

function loadEnv() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const index = line.indexOf('=');
    if (index > 0) process.env[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function serveFile(request, response) {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const safePath = path.normalize(requested).replace(/^([.][.][\\/])+/, '');
  const filePath = path.join(root, safePath);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
  response.writeHead(200, { 'Content-Type': `${types[path.extname(filePath)] || 'text/plain'}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(response);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; if (body.length > 10000) reject(new Error('Request is too large.')); });
    request.on('end', () => resolve(JSON.parse(body || '{}')));
    request.on('error', reject);
  });
}

loadEnv();
const server = http.createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/api/translate') {
    try {
      const body = await readBody(request);
      const text = String(body.text || '').trim();
      if (!text) return sendJson(response, 400, { error: { message: 'Please enter a word or phrase.', fix: 'Type something before translating.' } });
      const answer = await askAI(text, body.secondVersion === true);
      return sendJson(response, 200, { answer });
    } catch (error) {
      const message = error?.error?.message || error?.message || 'The AI could not answer right now.';
      const fix = error?.error?.fix || error?.fix || 'Check the internet connection and try again.';
      console.error(fix);
      return sendJson(response, 500, { error: { message, fix } });
    }
  }
  serveFile(request, response);
});

server.listen(port, () => console.log(`Chinese Translate is running at http://localhost:${port}`));
