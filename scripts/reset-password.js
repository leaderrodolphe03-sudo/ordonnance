// Définit le mot de passe d'un compte (par défaut "admin"), par exemple après un oubli.
// Usage : npm run reset-password -- <nouveau_mot_de_passe> [identifiant]
// Le compte est aussi activé s'il était en attente. S'il n'existe pas, il est créé avec le rôle administrateur.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from '../src/db.js';
import { hashPassword } from '../src/auth.js';

const [password, username = 'admin'] = process.argv.slice(2);
if (!password || password.length < 8) {
  console.error('Usage : npm run reset-password -- <nouveau_mot_de_passe (8 caractères min.)> [identifiant]');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const db = openDatabase(path.resolve(process.env.DATA_DIR || path.join(root, 'data')));

const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (user) {
  db.prepare("UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?").run(hashPassword(password), user.id);
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
  console.log(`Mot de passe du compte « ${username} » modifié.`);
} else {
  db.prepare("INSERT INTO users (username, full_name, password_hash, role, status) VALUES (?, ?, ?, 'admin', 'active')").run(
    username,
    username,
    hashPassword(password),
  );
  console.log(`Compte administrateur « ${username} » créé.`);
}
db.close();
