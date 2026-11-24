import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DEFAULT_SETTINGS, normalize, transaction } from './db.js';
import { hashPassword, verifyPassword } from './auth.js';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const badRequest = (message) => new HttpError(400, message);

function text(value, { max = 500, required = false, label = 'Ce champ' } = {}) {
  const s = String(value ?? '').trim();
  if (required && !s) throw badRequest(`${label} est obligatoire`);
  if (s.length > max) throw badRequest(`${label} est trop long (${max} caractères maximum)`);
  return s;
}

function idParam(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Élément introuvable');
  return id;
}

const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const pad = (n) => String(n).padStart(2, '0');
const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const likePattern = (s) => `%${s.replace(/[\\%_]/g, (c) => '\\' + c)}%`;

function readPrescription(body) {
  const prescribed_at = String(body?.prescribed_at ?? '');
  if (!DATETIME_RE.test(prescribed_at)) throw badRequest('Date de prescription invalide');
  if (!Array.isArray(body.items) || body.items.length === 0) throw badRequest('Ajoutez au moins un médicament');
  if (body.items.length > 50) throw badRequest('50 médicaments maximum par ordonnance');
  return {
    patient_name: text(body.patient_name, { max: 150, required: true, label: 'Le nom du patient' }),
    patient_age: text(body.patient_age, { max: 20, label: "L'âge" }),
    prescribed_at,
    notes: text(body.notes, { max: 2000, label: 'La note' }),
    items: body.items.map((it) => ({
      name: text(it?.name, { max: 200, required: true, label: 'Le nom du médicament' }),
      dosage: text(it?.dosage, { max: 1000, label: 'La posologie' }),
      quantity: text(it?.quantity, { max: 100, label: 'La quantité' }),
    })),
  };
}

function readPassword(value) {
  const s = String(value ?? '');
  if (s.length < 8) throw badRequest('Le mot de passe doit contenir au moins 8 caractères');
  if (s.length > 200) throw badRequest('Mot de passe trop long');
  return s;
}

export function apiRouter(db, auth) {
  const r = express.Router();

  const getSettings = () =>
    Object.fromEntries(db.prepare('SELECT key, value FROM settings').all().map((s) => [s.key, s.value]));

  function createUser(body, { role, status }) {
    const username = text(body?.username, { max: 50, required: true, label: "L'identifiant" });
    if (!/^[\w.-]+$/.test(username)) throw badRequest("L'identifiant ne peut contenir que lettres, chiffres, . - _");
    const full_name = text(body?.full_name, { max: 100, required: status === 'pending', label: 'Le nom' });
    const password = readPassword(body?.password);
    if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) throw badRequest('Cet identifiant existe déjà');
    const { lastInsertRowid } = db
      .prepare('INSERT INTO users (username, full_name, password_hash, role, status) VALUES (?, ?, ?, ?, ?)')
      .run(username, full_name, hashPassword(password), role, status);
    return { id: Number(lastInsertRowid), username, full_name, role, status };
  }

  // ── Routes publiques ─────────────────────────────────────────────
  r.post('/auth/login', auth.login);

  // Inscription libre : le compte reste inactif tant qu'un administrateur ne l'a pas validé.
  const signups = new Map();
  r.post('/auth/register', (req, res) => {
    const now = Date.now();
    const recent = (signups.get(req.ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
    if (recent.length >= 5) throw new HttpError(429, 'Trop de demandes. Réessayez plus tard.');
    if (db.prepare("SELECT COUNT(*) AS n FROM users WHERE status = 'pending'").get().n >= 20) {
      throw new HttpError(429, "Trop de comptes en attente. Contactez l'administrateur du cabinet.");
    }
    createUser(req.body, { role: 'user', status: 'pending' });
    signups.set(req.ip, [...recent, now]);
    res.status(201).json({ ok: true });
  });
  r.post('/auth/logout', auth.logout);
  // En-tête du cabinet : déjà imprimé sur chaque ordonnance, affiché sur l'écran de connexion.
  r.get('/settings', (req, res) => res.json(getSettings()));

  // ── Routes authentifiées ─────────────────────────────────────────
  r.use(auth.requireUser);

  r.get('/auth/me', (req, res) => res.json(req.user));

  r.post('/auth/password', (req, res) => {
    const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!verifyPassword(String(req.body?.current ?? ''), row.password_hash)) {
      throw badRequest('Mot de passe actuel incorrect');
    }
    const next = readPassword(req.body?.next);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(next), req.user.id);
    res.status(204).end();
  });

  // ── Paramètres du cabinet ────────────────────────────────────────
  r.put('/settings', auth.requireAdmin, (req, res) => {
    const update = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    transaction(db, () => {
      for (const key of Object.keys(DEFAULT_SETTINGS)) {
        if (key in (req.body ?? {})) update.run(text(req.body[key], { max: 300, label: 'Ce champ' }), key);
      }
    });
    res.json(getSettings());
  });

  // ── Catalogue des médicaments ────────────────────────────────────
  function readMedication(body, id = 0) {
    const name = text(body?.name, { max: 200, required: true, label: 'Le nom' });
    const dosage = text(body?.dosage, { max: 1000, label: 'La posologie' });
    if (db.prepare('SELECT 1 FROM medications WHERE name = ? AND id != ?').get(name, id)) {
      throw badRequest('Ce médicament existe déjà dans le catalogue');
    }
    return { name, dosage };
  }

  r.get('/medications', (req, res) => {
    res.json(db.prepare('SELECT id, name, dosage FROM medications ORDER BY name_search').all());
  });

  r.post('/medications', (req, res) => {
    const m = readMedication(req.body);
    const { lastInsertRowid } = db
      .prepare('INSERT INTO medications (name, name_search, dosage) VALUES (?, ?, ?)')
      .run(m.name, normalize(m.name), m.dosage);
    res.status(201).json({ id: Number(lastInsertRowid), ...m });
  });

  r.put('/medications/:id', (req, res) => {
    const id = idParam(req);
    const m = readMedication(req.body, id);
    const { changes } = db
      .prepare('UPDATE medications SET name = ?, name_search = ?, dosage = ? WHERE id = ?')
      .run(m.name, normalize(m.name), m.dosage, id);
    if (!changes) throw new HttpError(404, 'Médicament introuvable');
    res.json({ id, ...m });
  });

  r.delete('/medications/:id', (req, res) => {
    db.prepare('DELETE FROM medications WHERE id = ?').run(idParam(req));
    res.status(204).end();
  });

  // ── Patients (suggestions de saisie) ─────────────────────────────
  r.get('/patients', (req, res) => {
    const q = normalize(req.query.q);
    if (!q) return res.json([]);
    const rows = db
      .prepare(
        `SELECT patient_name AS name, COUNT(*) AS count, MAX(prescribed_at) AS last_at
         FROM prescriptions WHERE patient_search LIKE ? ESCAPE '\\'
         GROUP BY patient_search ORDER BY last_at DESC LIMIT 8`,
      )
      .all(likePattern(q));
    res.json(rows);
  });

  // ── Ordonnances ──────────────────────────────────────────────────
  const insertItem = db.prepare(
    'INSERT INTO prescription_items (prescription_id, position, name, name_search, dosage, quantity) VALUES (?, ?, ?, ?, ?, ?)',
  );
  function writeItems(prescriptionId, items) {
    db.prepare('DELETE FROM prescription_items WHERE prescription_id = ?').run(prescriptionId);
    items.forEach((it, i) => insertItem.run(prescriptionId, i, it.name, normalize(it.name), it.dosage, it.quantity));
  }

  function getPrescription(id) {
    const p = db
      .prepare(
        `SELECT p.id, p.number, p.patient_name, p.patient_age, p.prescribed_at, p.notes,
                p.created_at, p.updated_at, COALESCE(NULLIF(u.full_name, ''), u.username) AS author
         FROM prescriptions p LEFT JOIN users u ON u.id = p.created_by
         WHERE p.id = ?`,
      )
      .get(id);
    if (!p) throw new HttpError(404, 'Ordonnance introuvable');
    p.items = db
      .prepare('SELECT name, dosage, quantity FROM prescription_items WHERE prescription_id = ? ORDER BY position')
      .all(id);
    return p;
  }

  r.get('/prescriptions', (req, res) => {
    const where = [];
    const params = [];
    const q = normalize(req.query.q);
    if (q) {
      where.push("(p.patient_search LIKE ? ESCAPE '\\' OR p.number LIKE ? ESCAPE '\\')");
      params.push(likePattern(q), likePattern(q));
    }
    const med = normalize(req.query.med);
    if (med) {
      where.push(
        "EXISTS (SELECT 1 FROM prescription_items i WHERE i.prescription_id = p.id AND i.name_search LIKE ? ESCAPE '\\')",
      );
      params.push(likePattern(med));
    }
    if (DATE_RE.test(req.query.from ?? '')) {
      where.push('substr(p.prescribed_at, 1, 10) >= ?');
      params.push(req.query.from);
    }
    if (DATE_RE.test(req.query.to ?? '')) {
      where.push('substr(p.prescribed_at, 1, 10) <= ?');
      params.push(req.query.to);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const pageSize = 20;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const { total } = db.prepare(`SELECT COUNT(*) AS total FROM prescriptions p ${whereSql}`).get(...params);
    const items = db
      .prepare(
        `SELECT p.id, p.number, p.patient_name, p.patient_age, p.prescribed_at,
                COALESCE(NULLIF(u.full_name, ''), u.username) AS author,
                (SELECT group_concat(name, ' · ') FROM
                   (SELECT name FROM prescription_items WHERE prescription_id = p.id ORDER BY position)) AS medications
         FROM prescriptions p LEFT JOIN users u ON u.id = p.created_by
         ${whereSql}
         ORDER BY p.prescribed_at DESC, p.id DESC
         LIMIT ? OFFSET ?`,
      )
      .all(...params, pageSize, (page - 1) * pageSize);
    res.json({ items, total, page, pageSize });
  });

  r.get('/prescriptions/:id', (req, res) => res.json(getPrescription(idParam(req))));

  r.post('/prescriptions', (req, res) => {
    const data = readPrescription(req.body);
    const id = transaction(db, () => {
      const year = data.prescribed_at.slice(0, 4);
      const last = db
        .prepare('SELECT number FROM prescriptions WHERE number LIKE ? ORDER BY length(number) DESC, number DESC LIMIT 1')
        .get(`ORD-${year}-%`);
      const seq = last ? Number(last.number.split('-')[2]) + 1 : 1;
      const number = `ORD-${year}-${String(seq).padStart(5, '0')}`;
      const { lastInsertRowid } = db
        .prepare(
          `INSERT INTO prescriptions (number, patient_name, patient_search, patient_age, prescribed_at, notes, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(number, data.patient_name, normalize(data.patient_name), data.patient_age, data.prescribed_at, data.notes, req.user.id);
      writeItems(Number(lastInsertRowid), data.items);
      return Number(lastInsertRowid);
    });
    res.status(201).json(getPrescription(id));
  });

  r.put('/prescriptions/:id', (req, res) => {
    const id = idParam(req);
    const data = readPrescription(req.body);
    transaction(db, () => {
      const { changes } = db
        .prepare(
          `UPDATE prescriptions SET patient_name = ?, patient_search = ?, patient_age = ?, prescribed_at = ?,
                  notes = ?, updated_at = datetime('now') WHERE id = ?`,
        )
        .run(data.patient_name, normalize(data.patient_name), data.patient_age, data.prescribed_at, data.notes, id);
      if (!changes) throw new HttpError(404, 'Ordonnance introuvable');
      writeItems(id, data.items);
    });
    res.json(getPrescription(id));
  });

  r.delete('/prescriptions/:id', auth.requireAdmin, (req, res) => {
    db.prepare('DELETE FROM prescriptions WHERE id = ?').run(idParam(req));
    res.status(204).end();
  });

  // ── Tableau de bord ──────────────────────────────────────────────
  r.get('/stats', (req, res) => {
    const today = localDate();
    const count = (sql, ...p) => db.prepare(sql).get(...p).n;
    res.json({
      today: count('SELECT COUNT(*) AS n FROM prescriptions WHERE substr(prescribed_at, 1, 10) = ?', today),
      month: count('SELECT COUNT(*) AS n FROM prescriptions WHERE substr(prescribed_at, 1, 7) = ?', today.slice(0, 7)),
      total: count('SELECT COUNT(*) AS n FROM prescriptions'),
      patients: count('SELECT COUNT(DISTINCT patient_search) AS n FROM prescriptions'),
      topMedications: db
        .prepare(
          `SELECT MIN(name) AS name, COUNT(*) AS count FROM prescription_items
           GROUP BY name_search ORDER BY count DESC, name LIMIT 8`,
        )
        .all(),
      recent: db
        .prepare(
          `SELECT p.id, p.number, p.patient_name, p.prescribed_at,
                  (SELECT COUNT(*) FROM prescription_items WHERE prescription_id = p.id) AS item_count
           FROM prescriptions p ORDER BY p.prescribed_at DESC, p.id DESC LIMIT 6`,
        )
        .all(),
      pendingUsers:
        req.user.role === 'admin' ? count("SELECT COUNT(*) AS n FROM users WHERE status = 'pending'") : 0,
    });
  });

  // ── Utilisateurs (administrateurs) ───────────────────────────────
  r.get('/users', auth.requireAdmin, (req, res) => {
    res.json(
      db
        .prepare("SELECT id, username, full_name, role, status, created_at FROM users ORDER BY status = 'pending' DESC, username")
        .all(),
    );
  });

  r.post('/users', auth.requireAdmin, (req, res) => {
    const role = req.body?.role === 'admin' ? 'admin' : 'user';
    res.status(201).json(createUser(req.body, { role, status: 'active' }));
  });

  r.put('/users/:id/activate', auth.requireAdmin, (req, res) => {
    const { changes } = db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(idParam(req));
    if (!changes) throw new HttpError(404, 'Utilisateur introuvable');
    res.status(204).end();
  });

  r.put('/users/:id/password', auth.requireAdmin, (req, res) => {
    const id = idParam(req);
    const password = readPassword(req.body?.password);
    const { changes } = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), id);
    if (!changes) throw new HttpError(404, 'Utilisateur introuvable');
    if (id !== req.user.id) db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id);
    res.status(204).end();
  });

  r.delete('/users/:id', auth.requireAdmin, (req, res) => {
    const id = idParam(req);
    if (id === req.user.id) throw badRequest('Vous ne pouvez pas supprimer votre propre compte');
    const target = db.prepare('SELECT role FROM users WHERE id = ?').get(id);
    if (!target) throw new HttpError(404, 'Utilisateur introuvable');
    if (target.role === 'admin' && db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get().n <= 1) {
      throw badRequest('Impossible de supprimer le dernier administrateur');
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(204).end();
  });

  // ── Sauvegarde ───────────────────────────────────────────────────
  r.get('/backup', auth.requireAdmin, (req, res) => {
    const file = path.join(os.tmpdir(), `ordonnances-backup-${Date.now()}.db`);
    db.prepare('VACUUM INTO ?').run(file);
    res.download(file, `sauvegarde-ordonnances-${localDate()}.db`, () => fs.rm(file, { force: true }, () => {}));
  });

  r.use((req, res) => res.status(404).json({ error: 'Ressource introuvable' }));

  // eslint-disable-next-line no-unused-vars
  r.use((err, req, res, next) => {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Requête invalide' });
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  });

  return r;
}
