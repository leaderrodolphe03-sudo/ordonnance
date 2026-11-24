// Sauvegarde à chaud de la base, à planifier chaque nuit (Planificateur de tâches Windows ou cron).
// Usage : node scripts/backup.js [dossier_destination]   (par défaut : ./backups, conserve 30 copies)
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, 'data'));
const destDir = path.resolve(process.argv[2] || process.env.BACKUP_DIR || path.join(root, 'backups'));
const keep = Number(process.env.BACKUP_KEEP) || 30;

fs.mkdirSync(destDir, { recursive: true });
const now = new Date();
const p2 = (n) => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}_${p2(now.getHours())}h${p2(now.getMinutes())}`;
const target = path.join(destDir, `ordonnances-${stamp}.db`);

const db = new DatabaseSync(path.join(dataDir, 'ordonnances.db'), { readOnly: true });
db.prepare('VACUUM INTO ?').run(target);
db.close();
console.log(`Sauvegarde créée : ${target}`);

const old = fs.readdirSync(destDir).filter((f) => /^ordonnances-.*\.db$/.test(f)).sort().reverse().slice(keep);
for (const f of old) fs.rmSync(path.join(destDir, f));
if (old.length) console.log(`${old.length} ancienne(s) sauvegarde(s) supprimée(s)`);
