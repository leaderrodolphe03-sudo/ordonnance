import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_MEDICATIONS } from './seed.js';

/** Minuscules, sans accents ni espaces superflus : sert aux recherches. */
export const normalize = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

export const DEFAULT_SETTINGS = {
  cabinet_name: 'CABINET DENTAIRE DJOSSOU',
  cabinet_address: 'Carré 413 Maro-Militaire 03BP0220 TEL : 0169205555 / 0195911515',
  cabinet_contact: 'contact@cabinetdjossou.com - Cotonou - Bénin',
  city: 'Cotonou',
  practitioner_name: '',
  footer_note: 'NB : Ordonnance à ramener à la prochaine consultation',
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  full_name     TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS medications (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name_search TEXT NOT NULL,
  dosage      TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id             INTEGER PRIMARY KEY,
  number         TEXT NOT NULL UNIQUE,
  patient_name   TEXT NOT NULL,
  patient_search TEXT NOT NULL,
  patient_age    TEXT NOT NULL DEFAULT '',
  prescribed_at  TEXT NOT NULL,              -- heure locale 'AAAA-MM-JJTHH:MM'
  notes          TEXT NOT NULL DEFAULT '',
  created_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_prescriptions_date    ON prescriptions(prescribed_at);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_search);

CREATE TABLE IF NOT EXISTS prescription_items (
  id              INTEGER PRIMARY KEY,
  prescription_id INTEGER NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  name            TEXT NOT NULL,
  name_search     TEXT NOT NULL,
  dosage          TEXT NOT NULL DEFAULT '',
  quantity        TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_items_prescription ON prescription_items(prescription_id);
CREATE INDEX IF NOT EXISTS idx_items_name         ON prescription_items(name_search);
`;

export function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function openDatabase(dataDir) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, 'ordonnances.db'));
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  db.exec(SCHEMA);

  // Migration : statut des comptes (les inscriptions attendent la validation d'un administrateur).
  const userColumns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
  if (!userColumns.includes('status')) {
    db.exec("ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending'))");
  }

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) insertSetting.run(key, value);

  const { n } = db.prepare('SELECT COUNT(*) AS n FROM medications').get();
  if (n === 0) {
    const insert = db.prepare('INSERT OR IGNORE INTO medications (name, name_search, dosage) VALUES (?, ?, ?)');
    transaction(db, () => {
      for (const m of DEFAULT_MEDICATIONS) insert.run(m.name, normalize(m.name), m.dosage);
    });
  }
  return db;
}
