import crypto from 'node:crypto';

const COOKIE = 'ord_sid';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // une journée de travail
const MAX_ATTEMPTS = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function setCookie(req, res, value, maxAgeMs) {
  const secure = req.secure || process.env.COOKIE_SECURE === '1';
  res.append(
    'Set-Cookie',
    `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(maxAgeMs / 1000)}${secure ? '; Secure' : ''}`,
  );
}

export function createAuth(db) {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM users').get();
  if (n === 0) {
    const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    db.prepare(
      "INSERT INTO users (username, full_name, password_hash, role) VALUES ('admin', 'Administrateur', ?, 'admin')",
    ).run(hashPassword(password));
    console.log('──────────────────────────────────────────────');
    console.log(' Compte administrateur créé');
    console.log('   identifiant : admin');
    console.log(`   mot de passe : ${process.env.ADMIN_PASSWORD ? '(valeur de ADMIN_PASSWORD)' : password}`);
    console.log(' Changez ce mot de passe dans Paramètres.');
    console.log('──────────────────────────────────────────────');
  }

  // Évite de révéler par le temps de réponse qu'un identifiant n'existe pas.
  const dummyHash = hashPassword(crypto.randomBytes(16).toString('hex'));
  const attempts = new Map();

  const findSession = db.prepare(`
    SELECT u.id, u.username, u.full_name, u.role, s.expires_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND u.status = 'active'`);
  const renewSession = db.prepare('UPDATE sessions SET expires_at = ? WHERE token_hash = ?');

  function login(req, res) {
    const now = Date.now();
    const ip = req.ip;
    let entry = attempts.get(ip);
    if (entry && now - entry.first > ATTEMPT_WINDOW_MS) entry = undefined;
    if (entry && entry.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' });
    }

    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');
    const user = username ? db.prepare('SELECT id, password_hash, status FROM users WHERE username = ?').get(username) : null;
    const ok = verifyPassword(password, user ? user.password_hash : dummyHash) && Boolean(user);
    if (!ok) {
      entry ??= { count: 0, first: now };
      entry.count++;
      attempts.set(ip, entry);
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }

    attempts.delete(ip);
    if (user.status !== 'active') {
      return res.status(403).json({ error: "Votre compte est en attente de validation par l'administrateur du cabinet." });
    }
    db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now);
    const token = crypto.randomBytes(32).toString('base64url');
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
      sha256(token),
      user.id,
      now + SESSION_TTL_MS,
    );
    setCookie(req, res, token, SESSION_TTL_MS);
    res.json(db.prepare('SELECT id, username, full_name, role FROM users WHERE id = ?').get(user.id));
  }

  function logout(req, res) {
    const token = parseCookies(req.headers.cookie)[COOKIE];
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
    setCookie(req, res, '', 0);
    res.status(204).end();
  }

  function requireUser(req, res, next) {
    const token = parseCookies(req.headers.cookie)[COOKIE];
    const row = token ? findSession.get(sha256(token)) : null;
    const now = Date.now();
    if (!row || row.expires_at < now) {
      return res.status(401).json({ error: 'Session expirée, veuillez vous reconnecter' });
    }
    // Session glissante : prolongée tant que l'utilisateur est actif.
    if (row.expires_at - now < SESSION_TTL_MS / 2) {
      renewSession.run(now + SESSION_TTL_MS, sha256(token));
      setCookie(req, res, token, SESSION_TTL_MS);
    }
    req.user = { id: row.id, username: row.username, full_name: row.full_name, role: row.role };
    next();
  }

  function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Action réservée aux administrateurs' });
    next();
  }

  return { login, logout, requireUser, requireAdmin };
}
