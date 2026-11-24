import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './src/db.js';
import { createAuth } from './src/auth.js';
import { apiRouter } from './src/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));

const db = openDatabase(DATA_DIR);
const auth = createAuth(db);

const app = express();
app.disable('x-powered-by');
// À activer uniquement derrière un reverse proxy (IIS, Nginx…) qui termine le HTTPS.
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; " +
      "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });
  if (req.path.startsWith('/api/')) res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRouter(db, auth));
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, HOST, () => {
  console.log(`Ordonnances — serveur démarré sur http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`Base de données : ${path.join(DATA_DIR, 'ordonnances.db')}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
