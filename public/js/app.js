'use strict';

/* ════════════════════════════════════════════════════════════
   Utilitaires
   ════════════════════════════════════════════════════════════ */

const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
  pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  tooth: '<path d="M7.5 3C5 3 3.5 5 3.5 7.4c0 2.8 1.4 4.2 1.9 6.6.5 2.8.9 7 2.9 7s1.9-4 3.7-4 1.7 4 3.7 4 2.4-4.2 2.9-7c.5-2.4 1.9-3.8 1.9-6.6C20.5 5 19 3 16.5 3c-1.9 0-2.8.9-4.5.9S9.4 3 7.5 3Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
};

const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

const normalize = (s) =>
  String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Vrai si chaque mot recherché apparaît dans le texte (« amox 1g » trouve « Amoxicilline 1g »). */
const matchesWords = (textValue, query) => {
  const hay = normalize(textValue);
  return normalize(query).split(' ').every((w) => hay.includes(w));
};

const pad = (n) => String(n).padStart(2, '0');
const nowLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const parseLocal = (s) => {
  const [date, time = '00:00'] = String(s).split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
};
const fmtDate = (s) => parseLocal(s).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtTime = (s) => { const d = parseLocal(s); return `${pad(d.getHours())}h${pad(d.getMinutes())}`; };
const fmtDateTime = (s) => `${fmtDate(s)} à ${fmtTime(s)}`;
const fmtLongDate = (s) => parseLocal(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

function debounce(fn, ms = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/** Quantité proposée par défaut selon la forme du produit. */
function autoQuantity(name) {
  const n = normalize(name);
  if (['sirop', 'suspension', 'buvable', 'bain', 'eludril'].some((k) => n.includes(k))) return '01 Flacon';
  if (['pate', 'gel', 'dentifrice'].some((k) => n.includes(k))) return '01 Tube';
  if (['brossette', 'fil inter'].some((k) => n.includes(k))) return '01 Paquet';
  return '01 Boîte';
}

const initials = (name) =>
  String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

/* ════════════════════════════════════════════════════════════
   API
   ════════════════════════════════════════════════════════════ */

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (res.status === 401 && path !== '/auth/login') {
    showLogin();
    throw new Error(data?.error || 'Session expirée');
  }
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
}

const state = { user: null, settings: null, medications: null };
const isAdmin = () => state.user?.role === 'admin';

async function loadSettings(force = false) {
  if (!state.settings || force) state.settings = await api('/settings');
  $$('[data-setting]').forEach((el) => { el.textContent = state.settings[el.dataset.setting] || el.textContent; });
  return state.settings;
}
async function loadMedications(force = false) {
  if (!state.medications || force) state.medications = await api('/medications');
  return state.medications;
}

/* ════════════════════════════════════════════════════════════
   Composants : notifications, fenêtres modales
   ════════════════════════════════════════════════════════════ */

function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `${icon(type === 'error' ? 'alert' : 'check')}<span>${esc(message)}</span>`;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), type === 'error' ? 6000 : 3500);
}

function openModal({ title, body, footer = '', onClose }) {
  const root = document.createElement('div');
  root.className = 'modal-backdrop';
  root.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-head">
        <h2 id="modal-title">${esc(title)}</h2>
        <button class="icon-btn" data-close aria-label="Fermer">${icon('x')}</button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
    </div>`;
  const previousFocus = document.activeElement;
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  function close() {
    root.remove();
    document.removeEventListener('keydown', onKey);
    previousFocus?.focus?.();
    onClose?.();
  }
  document.addEventListener('keydown', onKey);
  root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });
  $$('[data-close]', root).forEach((b) => b.addEventListener('click', close));
  document.body.append(root);
  requestAnimationFrame(() => $('input, textarea, select, [data-ok]', root)?.focus());
  return { root, close };
}

function confirmDialog(message, { title = 'Confirmation', confirmLabel = 'Confirmer', danger = false } = {}) {
  return new Promise((resolve) => {
    let answer = false;
    const { root, close } = openModal({
      title,
      body: `<p>${esc(message)}</p>`,
      footer: `<button class="btn btn-ghost" data-close>Annuler</button>
               <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-ok>${esc(confirmLabel)}</button>`,
      onClose: () => resolve(answer),
    });
    $('[data-ok]', root).addEventListener('click', () => { answer = true; close(); });
  });
}

function fieldHtml(f) {
  const attrs = `name="${f.name}" ${f.required ? 'required' : ''} ${f.maxlength ? `maxlength="${f.maxlength}"` : ''} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''} placeholder="${esc(f.placeholder ?? '')}"`;
  let control;
  if (f.type === 'textarea') control = `<textarea ${attrs} rows="${f.rows ?? 3}"></textarea>`;
  else if (f.type === 'select') control = `<select name="${f.name}">${f.options.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select>`;
  else control = `<input type="${f.type ?? 'text'}" ${attrs}>`;
  return `<label class="field"><span class="field-label">${esc(f.label)}${f.required ? ' <span class="req">*</span>' : ''}</span>${control}${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</label>`;
}

/** Fenêtre de formulaire générique : onSubmit(values) peut lever une erreur affichée dans la fenêtre. */
function formModal({ title, fields, submitLabel = 'Enregistrer', onSubmit }) {
  const { root, close } = openModal({
    title,
    body: `<form class="stack" novalidate>${fields.map(fieldHtml).join('')}<p class="form-error" hidden></p><button type="submit" hidden></button></form>`,
    footer: `<button class="btn btn-ghost" data-close>Annuler</button><button class="btn btn-primary" data-submit>${esc(submitLabel)}</button>`,
  });
  const form = $('form', root);
  const submitBtn = $('[data-submit]', root);
  const error = $('.form-error', form);
  for (const f of fields) if (f.value != null) form.elements[f.name].value = f.value;

  async function submit(e) {
    e?.preventDefault();
    error.hidden = true;
    submitBtn.disabled = true;
    try {
      await onSubmit(Object.fromEntries(new FormData(form)));
      close();
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  }
  form.addEventListener('submit', submit);
  submitBtn.addEventListener('click', submit);
}

/* ════════════════════════════════════════════════════════════
   Document d'ordonnance (aperçu + impression)
   ════════════════════════════════════════════════════════════ */

function renderDocument(p, s) {
  return `
  <article class="rx-doc">
    <header class="rx-head">
      <img class="rx-logo" src="img/logo.png" alt="${esc(s.cabinet_name)}">
      ${s.cabinet_address ? `<p>${esc(s.cabinet_address)}</p>` : ''}
      ${s.cabinet_contact ? `<p>${esc(s.cabinet_contact)}</p>` : ''}
    </header>
    <div class="rx-meta">
      <span>N° ${esc(p.number ?? '—')}</span>
      <span>${esc(s.city ? `${s.city}, le ` : 'Le ')}${fmtLongDate(p.prescribed_at)} à ${fmtTime(p.prescribed_at)}</span>
    </div>
    <h2 class="rx-title">Ordonnance médicale</h2>
    <div class="rx-patient">
      <span>Patient : <strong>${esc(p.patient_name)}</strong></span>
      ${p.patient_age ? `<span>Âge : ${esc(p.patient_age)}</span>` : ''}
    </div>
    <ol class="rx-items">
      ${p.items.map((it) => `
        <li>
          <div class="rx-item-head">
            <span class="rx-item-name">${esc(it.name)}</span>
            ${it.quantity ? `<span class="rx-qty">${esc(it.quantity)}</span>` : ''}
          </div>
          ${it.dosage ? `<div class="rx-dosage">${esc(it.dosage)}</div>` : ''}
        </li>`).join('')}
    </ol>
    ${p.notes ? `<div class="rx-notes">${esc(p.notes)}</div>` : ''}
    <div class="rx-sign">
      <div class="rx-sign-box">
        ${s.practitioner_name ? `<strong>${esc(s.practitioner_name)}</strong>` : '<strong>&nbsp;</strong>'}
        <div class="rx-sign-line">Signature &amp; cachet</div>
      </div>
    </div>
    ${s.footer_note ? `<footer class="rx-foot">${esc(s.footer_note)}</footer>` : ''}
  </article>`;
}

async function printPrescription(p) {
  const settings = await loadSettings();
  $('#print-area').innerHTML = renderDocument(p, settings);
  // Attendre le logo, sinon il peut manquer sur la feuille imprimée.
  await Promise.all($$('#print-area img').map((img) => img.decode().catch(() => {})));
  const previousTitle = document.title;
  document.title = `Ordonnance ${p.number} - ${p.patient_name}`; // nom proposé pour « Enregistrer en PDF »
  window.print();
  document.title = previousTitle;
}

/* ════════════════════════════════════════════════════════════
   Vue : tableau de bord
   ════════════════════════════════════════════════════════════ */

async function viewDashboard(el) {
  const s = await api('/stats');
  const max = Math.max(1, ...s.topMedications.map((m) => m.count));
  const firstName = (state.user.full_name || state.user.username).split(' ')[0];
  const kpi = (iconName, value, label) => `
    <div class="card kpi"><div class="kpi-icon">${icon(iconName)}</div>
      <div><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div></div></div>`;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Bonjour ${esc(firstName)}</h1>
        <p class="muted">${esc(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}</p>
      </div>
      <a class="btn btn-primary" href="#/nouvelle">${icon('plus')} Nouvelle ordonnance</a>
    </div>
    ${s.pendingUsers ? `<div class="notice">${icon('users')}<span>${s.pendingUsers > 1 ? `${s.pendingUsers} comptes attendent` : 'Un compte attend'} votre validation.</span><a class="btn btn-secondary btn-sm" href="#/parametres">Voir les comptes</a></div>` : ''}
    <div class="kpis">
      ${kpi('calendar', s.today, "Ordonnances aujourd'hui")}
      ${kpi('file', s.month, 'Ordonnances ce mois-ci')}
      ${kpi('database', s.total, 'Ordonnances au total')}
      ${kpi('users', s.patients, 'Patients')}
    </div>
    <div class="grid-2">
      <section class="card">
        <div class="card-head"><h2>Dernières ordonnances</h2><a class="link-sm" href="#/historique">Tout l'historique</a></div>
        ${s.recent.length ? `<ul class="list">${s.recent.map((p) => `
          <li><a class="list-row" href="#/ordonnances/${p.id}">
            <div class="avatar" style="background:var(--primary-soft);color:var(--primary)">${esc(initials(p.patient_name))}</div>
            <div class="list-row-main"><strong>${esc(p.patient_name)}</strong><span>${esc(p.number)} · ${plural(p.item_count, 'médicament')}</span></div>
            <span class="muted nowrap" style="font-size:13px">${fmtDateTime(p.prescribed_at)}</span>
          </a></li>`).join('')}</ul>`
          : `<div class="empty">${icon('file')}<p>Aucune ordonnance enregistrée pour l'instant.</p><a class="btn btn-primary btn-sm" href="#/nouvelle">Créer la première</a></div>`}
      </section>
      <section class="card">
        <div class="card-head"><h2>Médicaments les plus prescrits</h2></div>
        ${s.topMedications.length ? `<div class="bars">${s.topMedications.map((m) => `
          <div><div class="bar-label"><span>${esc(m.name)}</span><span>${m.count}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((m.count / max) * 100)}%"></div></div></div>`).join('')}</div>`
          : `<div class="empty">${icon('pill')}<p>Les statistiques apparaîtront après les premières ordonnances.</p></div>`}
      </section>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   Vue : création / modification d'une ordonnance
   ════════════════════════════════════════════════════════════ */

let editorDirty = false;

async function viewEditor(el, { id, fromId }) {
  const meds = await loadMedications();
  const isEdit = Boolean(id);
  const toDraft = (p) => ({
    patient_name: p.patient_name, patient_age: p.patient_age, prescribed_at: p.prescribed_at, notes: p.notes,
    items: p.items.map((it) => ({ ...it })),
  });

  let draft = { patient_name: '', patient_age: '', prescribed_at: nowLocal(), notes: '', items: [] };
  let source = null;
  if (id) {
    source = await api(`/prescriptions/${id}`);
    draft = toDraft(source);
  } else if (fromId) {
    source = await api(`/prescriptions/${fromId}`);
    draft = { ...toDraft(source), prescribed_at: nowLocal() };
  }

  const subtitle = isEdit
    ? `${esc(source.number)} · le numéro et l'historique sont conservés`
    : fromId ? `Renouvellement de ${esc(source.number)} — vérifiez les posologies avant d'enregistrer` : 'Renseignez le patient puis ajoutez les médicaments depuis le catalogue';

  el.innerHTML = `
    <div class="page-head">
      <div>
        ${isEdit ? `<a class="back" href="#/ordonnances/${id}">${icon('left')} Retour à l'ordonnance</a>` : ''}
        <h1>${isEdit ? "Modifier l'ordonnance" : fromId ? 'Renouveler une ordonnance' : 'Nouvelle ordonnance'}</h1>
        <p class="muted">${subtitle}</p>
      </div>
    </div>

    <div class="editor-grid">
      <div class="stack">
        <section class="card editor-patient">
          <div class="card-head"><h2>Patient</h2></div>
          <div class="card-body form-grid">
            <label class="field span-2"><span class="field-label">Nom et prénom <span class="req">*</span></span>
              <input name="patient_name" data-autofocus list="patients-dl" autocomplete="off" maxlength="150" placeholder="Ex : KOFFI Jean">
              <datalist id="patients-dl"></datalist>
            </label>
            <div class="patient-hint span-2" data-patient-hint hidden></div>
            <label class="field"><span class="field-label">Âge <span class="hint">(facultatif)</span></span>
              <input name="patient_age" maxlength="20" placeholder="Ex : 34 ans">
            </label>
            <label class="field"><span class="field-label">Date et heure <span class="req">*</span></span>
              <input type="datetime-local" name="prescribed_at">
            </label>
          </div>
        </section>

        <section class="card editor-lines">
          <div class="card-head"><h2>Médicaments prescrits</h2><span class="badge" data-count></span></div>
          <div class="card-body">
            <div class="rx-lines" data-lines></div>
            <label class="field"><span class="field-label">Note complémentaire <span class="hint">(facultatif — imprimée sous la liste)</span></span>
              <textarea name="notes" rows="2" maxlength="2000" placeholder="Ex : Revenir dans 7 jours pour contrôle"></textarea>
            </label>
          </div>
        </section>
      </div>

      <aside class="card catalog">
        <div class="card-head"><h2>Catalogue</h2><a class="link-sm" href="#/medicaments">Gérer le catalogue</a></div>
        <div class="card-body">
          <div class="search-input">${icon('search')}<input type="search" data-catalog-search placeholder="Rechercher ou saisir un médicament…" autocomplete="off"></div>
          <ul class="catalog-list" data-catalog></ul>
        </div>
      </aside>
    </div>

    <div class="action-bar">
      <span class="muted" data-status></span>
      <div class="btn-row">
        <a class="btn btn-ghost" href="${isEdit ? `#/ordonnances/${id}` : '#/'}">Annuler</a>
        <button class="btn btn-secondary" data-action="save">${icon('save')} Enregistrer</button>
        <button class="btn btn-primary" data-action="save-print">${icon('printer')} Enregistrer et imprimer</button>
      </div>
    </div>`;

  const form = {
    name: $('[name=patient_name]', el),
    age: $('[name=patient_age]', el),
    date: $('[name=prescribed_at]', el),
    notes: $('[name=notes]', el),
  };
  form.name.value = draft.patient_name;
  form.age.value = draft.patient_age;
  form.date.value = draft.prescribed_at;
  form.notes.value = draft.notes;

  const lines = $('[data-lines]', el);
  const catalog = $('[data-catalog]', el);
  const search = $('[data-catalog-search]', el);
  const hint = $('[data-patient-hint]', el);
  editorDirty = false;
  const markDirty = () => { editorDirty = true; };

  function renderLines() {
    $('[data-count]', el).textContent = plural(draft.items.length, 'ligne');
    if (!draft.items.length) {
      lines.innerHTML = `<div class="empty">${icon('pill')}<p>Aucun médicament pour l'instant.<br>Cliquez sur un produit du catalogue pour l'ajouter.</p></div>`;
      return;
    }
    lines.innerHTML = draft.items.map((it, i) => `
      <div class="rx-line" data-index="${i}">
        <div class="rx-line-num">${i + 1}</div>
        <div class="rx-line-fields">
          <div class="rx-line-top">
            <input class="input-name" data-field="name" value="${esc(it.name)}" placeholder="Nom du médicament" maxlength="200" aria-label="Nom du médicament">
            <input class="input-qty" data-field="quantity" value="${esc(it.quantity)}" placeholder="Quantité" maxlength="100" aria-label="Quantité">
          </div>
          <textarea data-field="dosage" rows="2" placeholder="Posologie" maxlength="1000" aria-label="Posologie">${esc(it.dosage)}</textarea>
        </div>
        <div class="rx-line-actions">
          <button type="button" class="icon-btn" data-action="up" title="Monter" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button>
          <button type="button" class="icon-btn" data-action="down" title="Descendre" ${i === draft.items.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
          <button type="button" class="icon-btn danger" data-action="remove" title="Retirer">${icon('trash')}</button>
        </div>
      </div>`).join('');
  }

  function renderCatalog() {
    const raw = search.value.trim();
    const q = normalize(raw);
    const added = new Set(draft.items.map((it) => normalize(it.name)));
    const list = q ? meds.filter((m) => matchesWords(m.name, q)) : meds;
    let html = list.map((m) => {
      const isAdded = added.has(normalize(m.name));
      return `<li><button type="button" class="catalog-item ${isAdded ? 'is-added' : ''}" data-med="${m.id}" title="${isAdded ? 'Déjà dans l’ordonnance' : 'Ajouter à l’ordonnance'}">
        <span class="catalog-name">${esc(m.name)}</span>
        <span class="catalog-dosage">${esc(m.dosage)}</span>
        ${icon(isAdded ? 'check' : 'plus')}
      </button></li>`;
    }).join('');
    if (q && !list.some((m) => normalize(m.name) === q)) {
      html += `<li><button type="button" class="catalog-item catalog-free" data-free>${icon('plus')}<span>Ajouter « ${esc(raw)} » (hors catalogue)</span></button></li>`;
    }
    catalog.innerHTML = html || `<li class="empty">Catalogue vide</li>`;
  }

  function addItem(name, dosage = '') {
    if (draft.items.some((it) => normalize(it.name) === normalize(name))) {
      toast(`${name} est déjà dans l'ordonnance`, 'error');
      return;
    }
    draft.items.push({ name, dosage, quantity: autoQuantity(name) });
    markDirty();
    renderLines();
    renderCatalog();
    const last = $$('.rx-line', lines).at(-1);
    last?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (!dosage) $('[data-field=dosage]', last)?.focus();
  }

  // Ajout depuis le catalogue
  catalog.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.hasAttribute('data-free')) {
      addItem(search.value.trim());
      search.value = '';
      renderCatalog();
      return;
    }
    const med = meds.find((m) => m.id === Number(btn.dataset.med));
    if (med) addItem(med.name, med.dosage);
  });
  search.addEventListener('input', renderCatalog);
  search.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const first = $('.catalog-item:not(.is-added)', catalog);
    if (!first) return;
    const isFree = first.hasAttribute('data-free');
    first.click();
    if (!isFree) { search.value = ''; renderCatalog(); search.focus(); }
  });

  // Modification des lignes
  lines.addEventListener('input', (e) => {
    const line = e.target.closest('.rx-line');
    if (!line || !e.target.dataset.field) return;
    draft.items[Number(line.dataset.index)][e.target.dataset.field] = e.target.value;
    markDirty();
  });
  lines.addEventListener('change', (e) => { if (e.target.dataset.field === 'name') renderCatalog(); });
  lines.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const i = Number(btn.closest('.rx-line').dataset.index);
    const items = draft.items;
    if (btn.dataset.action === 'remove') items.splice(i, 1);
    if (btn.dataset.action === 'up' && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    if (btn.dataset.action === 'down' && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
    markDirty();
    renderLines();
    renderCatalog();
  });

  // Patient : suggestions + rappel des ordonnances précédentes
  const lookupPatient = debounce(async () => {
    const q = form.name.value.trim();
    if (q.length < 2) { hint.hidden = true; return; }
    try {
      const patients = await api(`/patients?q=${encodeURIComponent(q)}`);
      $('#patients-dl', el).innerHTML = patients.map((p) => `<option value="${esc(p.name)}">`).join('');
      const match = patients.find((p) => normalize(p.name) === normalize(q));
      const previous = match ? match.count - (isEdit && normalize(source.patient_name) === normalize(q) ? 1 : 0) : 0;
      hint.hidden = previous <= 0;
      if (previous > 0) {
        hint.innerHTML = `${icon('history')}<span>Patient connu : ${plural(previous, 'ordonnance')} précédente${previous > 1 ? 's' : ''}, dernière le ${fmtDate(match.last_at)}.</span>
          <a href="#/historique?q=${encodeURIComponent(match.name)}" target="_blank" rel="noopener">Voir l'historique</a>`;
      }
    } catch { /* suggestions facultatives */ }
  }, 300);
  form.name.addEventListener('input', () => { markDirty(); lookupPatient(); });
  [form.age, form.date, form.notes].forEach((input) => input.addEventListener('input', markDirty));

  async function save(andPrint) {
    draft.patient_name = form.name.value.trim();
    draft.patient_age = form.age.value.trim();
    draft.prescribed_at = form.date.value;
    draft.notes = form.notes.value.trim();
    draft.items = draft.items.map((it) => ({ name: it.name.trim(), dosage: it.dosage.trim(), quantity: it.quantity.trim() }));

    if (!draft.patient_name) { toast('Veuillez saisir le nom du patient', 'error'); form.name.focus(); return; }
    if (!draft.prescribed_at) { toast('Veuillez indiquer la date de prescription', 'error'); form.date.focus(); return; }
    if (!draft.items.length) { toast('Ajoutez au moins un médicament', 'error'); search.focus(); return; }
    if (draft.items.some((it) => !it.name)) { toast('Chaque ligne doit avoir un nom de médicament', 'error'); return; }

    const buttons = $$('.action-bar .btn', el);
    buttons.forEach((b) => b.setAttribute('disabled', ''));
    try {
      const saved = isEdit
        ? await api(`/prescriptions/${id}`, { method: 'PUT', body: draft })
        : await api('/prescriptions', { method: 'POST', body: draft });
      editorDirty = false;
      toast(`Ordonnance ${saved.number} enregistrée`);
      if (andPrint) await printPrescription(saved);
      location.hash = `#/ordonnances/${saved.id}`;
    } catch (err) {
      toast(err.message, 'error');
      buttons.forEach((b) => b.removeAttribute('disabled'));
    }
  }
  $('[data-action=save]', el).addEventListener('click', () => save(false));
  $('[data-action=save-print]', el).addEventListener('click', () => save(true));

  renderLines();
  renderCatalog();
  if (draft.patient_name) form.name.removeAttribute('data-autofocus');
  if (fromId) lookupPatient();
}

/* ════════════════════════════════════════════════════════════
   Vue : détail d'une ordonnance
   ════════════════════════════════════════════════════════════ */

async function viewDetail(el, id) {
  const [p, settings] = await Promise.all([api(`/prescriptions/${id}`), loadSettings()]);
  const edited = p.updated_at && p.updated_at !== p.created_at;
  el.innerHTML = `
    <div class="page-head">
      <div>
        <a class="back" href="#/historique">${icon('left')} Historique</a>
        <h1>${esc(p.patient_name)}</h1>
        <p class="muted"><span class="mono">${esc(p.number)}</span> · ${fmtDateTime(p.prescribed_at)}${p.author ? ` · rédigée par ${esc(p.author)}` : ''}${edited ? ' · modifiée' : ''}</p>
      </div>
      <div class="btn-row">
        ${isAdmin() ? `<button class="btn btn-danger-ghost" data-action="delete">${icon('trash')} Supprimer</button>` : ''}
        <a class="btn btn-secondary" href="#/ordonnances/${p.id}/modifier">${icon('edit')} Modifier</a>
        <a class="btn btn-secondary" href="#/nouvelle?depuis=${p.id}">${icon('copy')} Renouveler</a>
        <button class="btn btn-primary" data-action="print">${icon('printer')} Imprimer</button>
      </div>
    </div>
    <div class="doc-preview">${renderDocument(p, settings)}</div>`;

  $('[data-action=print]', el).addEventListener('click', () => printPrescription(p));
  $('[data-action=delete]', el)?.addEventListener('click', async () => {
    const ok = await confirmDialog(`L'ordonnance ${p.number} de ${p.patient_name} sera définitivement supprimée.`, {
      title: 'Supprimer l’ordonnance ?', confirmLabel: 'Supprimer', danger: true,
    });
    if (!ok) return;
    try {
      await api(`/prescriptions/${p.id}`, { method: 'DELETE' });
      toast('Ordonnance supprimée');
      location.hash = '#/historique';
    } catch (err) { toast(err.message, 'error'); }
  });
}

/* ════════════════════════════════════════════════════════════
   Vue : historique / recherche
   ════════════════════════════════════════════════════════════ */

async function viewHistory(el, _match, query) {
  el.innerHTML = `
    <div class="page-head">
      <div><h1>Historique des ordonnances</h1><p class="muted">Recherchez par patient, numéro d'ordonnance, médicament ou période.</p></div>
      <a class="btn btn-primary" href="#/nouvelle">${icon('plus')} Nouvelle ordonnance</a>
    </div>
    <section class="card">
      <form class="filters" autocomplete="off">
        <div class="search-input grow">${icon('search')}<input type="search" name="q" placeholder="Nom du patient ou n° (ORD-…)"></div>
        <input type="search" name="med" placeholder="Médicament">
        <label class="inline-field">Du <input type="date" name="from"></label>
        <label class="inline-field">Au <input type="date" name="to"></label>
        <button type="button" class="btn btn-ghost btn-sm" data-action="reset">Effacer les filtres</button>
      </form>
      <div data-results><div class="loader"></div></div>
    </section>`;

  const form = $('form', el);
  const results = $('[data-results]', el);
  for (const k of ['q', 'med', 'from', 'to']) form.elements[k].value = query.get(k) ?? '';
  let page = Math.max(1, Number(query.get('page')) || 1);
  let requestId = 0;

  async function load() {
    const params = new URLSearchParams();
    for (const k of ['q', 'med', 'from', 'to']) { const v = form.elements[k].value.trim(); if (v) params.set(k, v); }
    if (page > 1) params.set('page', page);
    const qs = params.toString();
    history.replaceState(null, '', `#/historique${qs ? `?${qs}` : ''}`);

    const current = ++requestId;
    const data = await api(`/prescriptions${qs ? `?${qs}` : ''}`);
    if (current !== requestId) return;

    if (!data.items.length) {
      const filtered = [...params.keys()].some((k) => k !== 'page');
      results.innerHTML = `<div class="empty">${icon(filtered ? 'search' : 'file')}<p>${filtered ? 'Aucune ordonnance ne correspond à ces critères.' : 'Aucune ordonnance enregistrée.'}</p></div>`;
      return;
    }
    const start = (data.page - 1) * data.pageSize + 1;
    const end = start + data.items.length - 1;
    const pages = Math.ceil(data.total / data.pageSize);
    results.innerHTML = `
      <div class="table-wrap"><table class="table">
        <thead><tr><th>N°</th><th>Date</th><th>Patient</th><th>Médicaments</th><th class="col-author">Rédigée par</th><th class="col-actions"></th></tr></thead>
        <tbody>${data.items.map((p) => `
          <tr class="clickable" data-id="${p.id}">
            <td class="mono nowrap">${esc(p.number)}</td>
            <td class="nowrap">${fmtDate(p.prescribed_at)}<span class="cell-sub">${fmtTime(p.prescribed_at)}</span></td>
            <td><strong>${esc(p.patient_name)}</strong>${p.patient_age ? `<span class="cell-sub">${esc(p.patient_age)}</span>` : ''}</td>
            <td><div class="cell-meds" title="${esc(p.medications)}">${esc(p.medications)}</div></td>
            <td class="nowrap muted col-author">${esc(p.author ?? '—')}</td>
            <td class="col-actions">
              <button class="icon-btn" data-action="print" title="Imprimer">${icon('printer')}</button>
              <a class="icon-btn" href="#/nouvelle?depuis=${p.id}" title="Renouveler">${icon('copy')}</a>
              <a class="icon-btn" href="#/ordonnances/${p.id}" title="Ouvrir">${icon('eye')}</a>
            </td>
          </tr>`).join('')}
        </tbody>
      </table></div>
      <div class="pagination">
        <span>${start}–${end} sur ${data.total}</span>
        <div class="btn-row">
          <button class="btn btn-secondary btn-sm" data-page="${data.page - 1}" ${data.page <= 1 ? 'disabled' : ''}>${icon('left')} Précédent</button>
          <button class="btn btn-secondary btn-sm" data-page="${data.page + 1}" ${data.page >= pages ? 'disabled' : ''}>Suivant ${icon('right')}</button>
        </div>
      </div>`;
  }

  const reload = () => load().catch((err) => toast(err.message, 'error'));
  const reloadSoon = debounce(() => { page = 1; reload(); }, 300);
  form.addEventListener('input', (e) => (e.target.type === 'date' ? (page = 1, reload()) : reloadSoon()));
  form.addEventListener('submit', (e) => e.preventDefault());
  $('[data-action=reset]', el).addEventListener('click', () => { form.reset(); page = 1; reload(); });

  results.addEventListener('click', async (e) => {
    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) { page = Number(pageBtn.dataset.page); reload(); results.scrollIntoView({ block: 'start' }); return; }
    if (e.target.closest('a')) return;
    const row = e.target.closest('tr[data-id]');
    if (!row) return;
    if (e.target.closest('[data-action=print]')) {
      try { await printPrescription(await api(`/prescriptions/${row.dataset.id}`)); } catch (err) { toast(err.message, 'error'); }
      return;
    }
    location.hash = `#/ordonnances/${row.dataset.id}`;
  });

  await load();
}

/* ════════════════════════════════════════════════════════════
   Vue : catalogue des médicaments
   ════════════════════════════════════════════════════════════ */

async function viewMedications(el) {
  let meds = await loadMedications(true);
  el.innerHTML = `
    <div class="page-head">
      <div><h1>Catalogue des médicaments</h1><p class="muted">Produits proposés lors de la rédaction, avec leur posologie par défaut.</p></div>
      <button class="btn btn-primary" data-action="add">${icon('plus')} Ajouter un médicament</button>
    </div>
    <section class="card">
      <div class="filters"><div class="search-input grow">${icon('search')}<input type="search" data-search placeholder="Rechercher dans le catalogue…"></div><span class="badge badge-muted" data-count></span></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>Médicament</th><th>Posologie par défaut</th><th class="col-actions"></th></tr></thead>
        <tbody data-rows></tbody>
      </table></div>
    </section>`;

  const rows = $('[data-rows]', el);
  const search = $('[data-search]', el);

  function render() {
    const q = normalize(search.value);
    const list = q ? meds.filter((m) => matchesWords(`${m.name} ${m.dosage}`, q)) : meds;
    $('[data-count]', el).textContent = plural(list.length, 'produit');
    rows.innerHTML = list.length ? list.map((m) => `
      <tr data-id="${m.id}">
        <td><strong>${esc(m.name)}</strong></td>
        <td class="muted">${esc(m.dosage)}</td>
        <td class="col-actions">
          <button class="icon-btn" data-action="edit" title="Modifier">${icon('edit')}</button>
          <button class="icon-btn danger" data-action="delete" title="Supprimer">${icon('trash')}</button>
        </td>
      </tr>`).join('') : `<tr><td colspan="3"><div class="empty">${icon('search')}<p>Aucun produit trouvé.</p></div></td></tr>`;
  }

  const refresh = async () => { meds = await loadMedications(true); render(); };
  const medFields = (m = {}) => [
    { name: 'name', label: 'Nom du médicament', required: true, maxlength: 200, value: m.name, placeholder: 'Ex : Amoxicilline 1g' },
    { name: 'dosage', label: 'Posologie par défaut', type: 'textarea', maxlength: 1000, value: m.dosage, placeholder: 'Ex : 01 Comprimé matin et soir pendant 7 jours' },
  ];

  $('[data-action=add]', el).addEventListener('click', () => formModal({
    title: 'Ajouter un médicament',
    fields: medFields(),
    submitLabel: 'Ajouter',
    onSubmit: async (v) => { await api('/medications', { method: 'POST', body: v }); toast('Médicament ajouté au catalogue'); await refresh(); },
  }));

  rows.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const med = meds.find((m) => m.id === Number(btn.closest('tr').dataset.id));
    if (btn.dataset.action === 'edit') {
      formModal({
        title: 'Modifier le médicament',
        fields: medFields(med),
        onSubmit: async (v) => { await api(`/medications/${med.id}`, { method: 'PUT', body: v }); toast('Médicament modifié'); await refresh(); },
      });
    } else if (btn.dataset.action === 'delete') {
      const ok = await confirmDialog(`Retirer « ${med.name} » du catalogue ? Les ordonnances déjà enregistrées ne sont pas modifiées.`, {
        title: 'Supprimer du catalogue', confirmLabel: 'Supprimer', danger: true,
      });
      if (!ok) return;
      try { await api(`/medications/${med.id}`, { method: 'DELETE' }); toast('Médicament supprimé'); await refresh(); } catch (err) { toast(err.message, 'error'); }
    }
  });
  search.addEventListener('input', render);
  render();
}

/* ════════════════════════════════════════════════════════════
   Vue : paramètres
   ════════════════════════════════════════════════════════════ */

const SETTING_FIELDS = [
  { name: 'cabinet_name', label: 'Nom du cabinet', maxlength: 300 },
  { name: 'cabinet_address', label: 'Adresse et téléphone', maxlength: 300 },
  { name: 'cabinet_contact', label: 'Contact (e-mail, ville, pays)', maxlength: 300 },
  { name: 'city', label: 'Ville (pour « Fait à … le … »)', maxlength: 300 },
  { name: 'practitioner_name', label: 'Praticien (affiché au-dessus de la signature)', maxlength: 300, placeholder: 'Ex : Dr DJOSSOU' },
  { name: 'footer_note', label: 'Mention en bas de page', maxlength: 300 },
];

async function viewSettings(el) {
  const settings = await loadSettings(true);
  const admin = isAdmin();
  el.innerHTML = `
    <div class="page-head"><div><h1>Paramètres</h1><p class="muted">En-tête des ordonnances, comptes et sauvegarde.</p></div></div>
    <div class="stack">
      <section class="card">
        <div class="card-head"><h2>${icon('building')} En-tête des ordonnances</h2>${admin ? '' : '<span class="badge badge-muted">Lecture seule</span>'}</div>
        <form class="card-body form-grid" data-settings>
          ${SETTING_FIELDS.map((f) => `<div class="${f.name === 'cabinet_name' || f.name === 'cabinet_address' ? 'span-2' : ''}">${fieldHtml(f)}</div>`).join('')}
        </form>
        ${admin ? `<div class="card-foot"><button class="btn btn-primary" data-action="save-settings">${icon('save')} Enregistrer</button></div>` : ''}
      </section>

      <section class="card">
        <div class="card-head"><h2>Mon compte</h2></div>
        <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <div><strong>${esc(state.user.full_name || state.user.username)}</strong><div class="muted">Identifiant : ${esc(state.user.username)} · ${admin ? 'Administrateur' : 'Utilisateur'}</div></div>
          <button class="btn btn-secondary" data-action="password">${icon('key')} Changer mon mot de passe</button>
        </div>
      </section>

      ${admin ? `
      <section class="card">
        <div class="card-head"><h2>Utilisateurs</h2><button class="btn btn-secondary btn-sm" data-action="add-user">${icon('plus')} Ajouter</button></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Nom</th><th>Identifiant</th><th>Rôle</th><th class="col-actions"></th></tr></thead>
          <tbody data-users><tr><td colspan="4"><div class="loader"></div></td></tr></tbody>
        </table></div>
      </section>

      <section class="card">
        <div class="card-head"><h2>Sauvegarde</h2></div>
        <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <p class="muted" style="max-width:620px">Télécharge une copie complète de la base (ordonnances, catalogue, comptes). Conservez-la sur un support externe ; pour restaurer, remplacez le fichier <span class="mono">data/ordonnances.db</span> du serveur.</p>
          <a class="btn btn-secondary" href="/api/backup" download>${icon('download')} Télécharger la sauvegarde</a>
        </div>
      </section>` : ''}
    </div>`;

  const settingsForm = $('[data-settings]', el);
  for (const f of SETTING_FIELDS) {
    settingsForm.elements[f.name].value = settings[f.name] ?? '';
    settingsForm.elements[f.name].disabled = !admin;
  }
  $('[data-action=save-settings]', el)?.addEventListener('click', async () => {
    try {
      const body = Object.fromEntries(new FormData(settingsForm));
      state.settings = await api('/settings', { method: 'PUT', body });
      await loadSettings();
      toast('Paramètres enregistrés');
    } catch (err) { toast(err.message, 'error'); }
  });

  $('[data-action=password]', el).addEventListener('click', () => formModal({
    title: 'Changer mon mot de passe',
    fields: [
      { name: 'current', label: 'Mot de passe actuel', type: 'password', required: true, autocomplete: 'current-password' },
      { name: 'next', label: 'Nouveau mot de passe', type: 'password', required: true, autocomplete: 'new-password', hint: '8 caractères minimum' },
      { name: 'confirm', label: 'Confirmer le nouveau mot de passe', type: 'password', required: true, autocomplete: 'new-password' },
    ],
    onSubmit: async (v) => {
      if (v.next !== v.confirm) throw new Error('Les deux mots de passe ne correspondent pas');
      await api('/auth/password', { method: 'POST', body: { current: v.current, next: v.next } });
      toast('Mot de passe modifié');
    },
  }));

  if (!admin) return;
  const usersBody = $('[data-users]', el);
  async function renderUsers() {
    const users = await api('/users');
    usersBody.innerHTML = users.map((u) => `
      <tr data-id="${u.id}" data-name="${esc(u.full_name || u.username)}">
        <td><strong>${esc(u.full_name || '—')}</strong>${u.id === state.user.id ? ' <span class="badge">Vous</span>' : ''}</td>
        <td class="mono">${esc(u.username)}</td>
        <td>${u.status === 'pending' ? '<span class="badge badge-warn">En attente de validation</span>' : u.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</td>
        <td class="col-actions">
          ${u.status === 'pending'
            ? `<button class="btn btn-primary btn-sm" data-action="activate">${icon('check')} Valider</button>
               <button class="btn btn-danger-ghost btn-sm" data-action="delete">Refuser</button>`
            : `<button class="icon-btn" data-action="reset" title="Réinitialiser le mot de passe">${icon('key')}</button>
               ${u.id === state.user.id ? '' : `<button class="icon-btn danger" data-action="delete" title="Supprimer">${icon('trash')}</button>`}`}
        </td>
      </tr>`).join('');
  }
  $('[data-action=add-user]', el).addEventListener('click', () => formModal({
    title: 'Nouvel utilisateur',
    fields: [
      { name: 'full_name', label: 'Nom complet', maxlength: 100, placeholder: 'Ex : Dr Jean DJOSSOU' },
      { name: 'username', label: 'Identifiant de connexion', required: true, maxlength: 50, autocomplete: 'off', placeholder: 'Ex : jdjossou' },
      { name: 'password', label: 'Mot de passe provisoire', type: 'password', required: true, autocomplete: 'new-password', hint: "8 caractères minimum — l'utilisateur pourra le changer" },
      { name: 'role', label: 'Rôle', type: 'select', options: [{ value: 'user', label: 'Utilisateur (rédaction, consultation)' }, { value: 'admin', label: 'Administrateur (+ suppression, comptes, paramètres)' }] },
    ],
    submitLabel: 'Créer le compte',
    onSubmit: async (v) => { await api('/users', { method: 'POST', body: v }); toast('Utilisateur créé'); await renderUsers(); },
  }));
  usersBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const row = btn.closest('tr');
    const { id, name } = row.dataset;
    if (btn.dataset.action === 'activate') {
      try { await api(`/users/${id}/activate`, { method: 'PUT' }); toast(`Compte de ${name} validé`); await renderUsers(); } catch (err) { toast(err.message, 'error'); }
      return;
    }
    if (btn.dataset.action === 'reset') {
      formModal({
        title: `Nouveau mot de passe — ${name}`,
        fields: [{ name: 'password', label: 'Nouveau mot de passe', type: 'password', required: true, autocomplete: 'new-password', hint: '8 caractères minimum' }],
        onSubmit: async (v) => { await api(`/users/${id}/password`, { method: 'PUT', body: v }); toast('Mot de passe réinitialisé'); },
      });
    } else if (btn.dataset.action === 'delete') {
      const ok = await confirmDialog(`Supprimer le compte de ${name} ? Ses ordonnances restent enregistrées.`, { title: 'Supprimer le compte', confirmLabel: 'Supprimer', danger: true });
      if (!ok) return;
      try { await api(`/users/${id}`, { method: 'DELETE' }); toast('Compte supprimé'); await renderUsers(); } catch (err) { toast(err.message, 'error'); }
    }
  });
  await renderUsers();
}

/* ════════════════════════════════════════════════════════════
   Navigation
   ════════════════════════════════════════════════════════════ */

const NAV = [
  { key: 'new', href: '#/nouvelle', icon: 'filePlus', label: 'Nouvelle ordonnance', cta: true },
  { key: 'dashboard', href: '#/', icon: 'dashboard', label: 'Tableau de bord' },
  { key: 'history', href: '#/historique', icon: 'history', label: 'Historique' },
  { key: 'meds', href: '#/medicaments', icon: 'pill', label: 'Médicaments' },
  { key: 'settings', href: '#/parametres', icon: 'settings', label: 'Paramètres' },
];

const ROUTES = [
  { re: /^\/$/, nav: 'dashboard', title: 'Tableau de bord', view: (el) => viewDashboard(el) },
  { re: /^\/nouvelle$/, nav: 'new', title: 'Nouvelle ordonnance', view: (el, m, q) => viewEditor(el, { fromId: q.get('depuis') }) },
  { re: /^\/historique$/, nav: 'history', title: 'Historique', view: viewHistory },
  { re: /^\/ordonnances\/(\d+)$/, nav: 'history', title: 'Ordonnance', view: (el, m) => viewDetail(el, m[1]) },
  { re: /^\/ordonnances\/(\d+)\/modifier$/, nav: 'history', title: "Modifier l'ordonnance", view: (el, m) => viewEditor(el, { id: m[1] }) },
  { re: /^\/medicaments$/, nav: 'meds', title: 'Médicaments', view: (el) => viewMedications(el) },
  { re: /^\/parametres$/, nav: 'settings', title: 'Paramètres', view: (el) => viewSettings(el) },
];

let routeSeq = 0;
let currentHash = null;

async function route() {
  if (!state.user) return;
  const hash = location.hash || '#/';

  if (editorDirty && currentHash !== hash) {
    const leave = await confirmDialog("Les modifications de l'ordonnance en cours ne sont pas enregistrées.", {
      title: 'Quitter sans enregistrer ?', confirmLabel: 'Quitter', danger: true,
    });
    if (!leave) { history.replaceState(null, '', currentHash); return; }
    editorDirty = false;
  }
  currentHash = hash;

  const [path, qs = ''] = hash.slice(1).split('?');
  const query = new URLSearchParams(qs);
  const r = ROUTES.find((x) => x.re.test(path)) ?? ROUTES[0];
  const match = path.match(r.re) ?? [];

  $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.key === r.nav));
  $('#topbar-title').textContent = r.title;
  document.title = `${r.title} — Ordonnances`;
  $('#app').classList.remove('menu-open');

  const content = $('#content');
  const seq = ++routeSeq;
  content.innerHTML = '<div class="loader"></div>';
  const el = document.createElement('div');
  try {
    await r.view(el, match, query);
    if (seq !== routeSeq) return;
    content.replaceChildren(el);
    window.scrollTo(0, 0);
    $('[data-autofocus]', el)?.focus();
  } catch (err) {
    if (seq !== routeSeq || !state.user) return;
    content.innerHTML = `<div class="card empty">${icon('alert')}<p>${esc(err.message)}</p><a class="btn btn-secondary btn-sm" href="#/">Retour au tableau de bord</a></div>`;
  }
}

/* ════════════════════════════════════════════════════════════
   Connexion & démarrage
   ════════════════════════════════════════════════════════════ */

function showLogin() {
  state.user = null;
  editorDirty = false;
  $('#app').hidden = true;
  $('#login-screen').hidden = false;
  showAuthView('login');
}

function showAuthView(view) {
  $('#login-form').hidden = view !== 'login';
  $('#register-form').hidden = view !== 'register';
  $$('#login-error, #register-error').forEach((e) => { e.hidden = true; });
  $(`#${view}-form [name=${view === 'login' ? 'username' : 'full_name'}]`).focus();
}

function showApp(user) {
  state.user = user;
  $('#login-screen').hidden = true;
  $('#app').hidden = false;
  $('#user-name').textContent = user.full_name || user.username;
  $('#user-role').textContent = user.role === 'admin' ? 'Administrateur' : 'Utilisateur';
  $('#user-avatar').textContent = initials(user.full_name || user.username);
  loadSettings().catch(() => {});
  currentHash = null;
  route();
}

function initShell() {
  $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  $('#nav').innerHTML = NAV.map((n) =>
    `${n.key === 'dashboard' ? '<div class="nav-label">Menu</div>' : ''}<a href="${n.href}" data-key="${n.key}" class="${n.cta ? 'nav-cta' : ''}">${icon(n.icon)}<span>${n.label}</span></a>`,
  ).join('');

  $('#menu-btn').addEventListener('click', () => $('#app').classList.toggle('menu-open'));
  $('#sidebar-overlay').addEventListener('click', () => $('#app').classList.remove('menu-open'));
  $('#logout-btn').addEventListener('click', async () => {
    if (editorDirty && !(await confirmDialog('Les modifications en cours seront perdues.', { title: 'Se déconnecter ?', confirmLabel: 'Se déconnecter', danger: true }))) return;
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    showLogin();
  });

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const error = $('#login-error');
    const btn = $('button[type=submit]', form);
    error.hidden = true;
    btn.disabled = true;
    try {
      const user = await api('/auth/login', { method: 'POST', body: { username: form.username.value, password: form.password.value } });
      form.reset();
      $('#login-info').hidden = true;
      showApp(user);
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    } finally {
      btn.disabled = false;
    }
  });

  $('#login-screen').addEventListener('click', (e) => {
    const link = e.target.closest('[data-auth-view]');
    if (!link) return;
    e.preventDefault();
    $('#login-info').hidden = true;
    showAuthView(link.dataset.authView);
  });

  $('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const error = $('#register-error');
    const btn = $('button[type=submit]', form);
    error.hidden = true;
    const v = Object.fromEntries(new FormData(form));
    if (v.password !== v.confirm) {
      error.textContent = 'Les deux mots de passe ne correspondent pas';
      error.hidden = false;
      return;
    }
    btn.disabled = true;
    try {
      await api('/auth/register', { method: 'POST', body: { full_name: v.full_name, username: v.username, password: v.password } });
      form.reset();
      showAuthView('login');
      $('#login-form [name=username]').value = v.username;
      const info = $('#login-info');
      info.textContent = "Demande envoyée. Vous pourrez vous connecter dès que l'administrateur aura validé votre compte.";
      info.hidden = false;
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    } finally {
      btn.disabled = false;
    }
  });

  // Installation comme application (icône sur le bureau, fenêtre sans barre d'adresse)
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    $('#install-btn').hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    $('#install-btn').hidden = true;
    toast('Application installée : retrouvez-la sur le bureau et dans le menu Démarrer');
  });
  $('#install-btn').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    $('#install-btn').hidden = true;
  });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

  window.addEventListener('hashchange', route);
  window.addEventListener('beforeunload', (e) => { if (editorDirty) e.preventDefault(); });
  window.addEventListener('afterprint', () => { $('#print-area').innerHTML = ''; });
}

initShell();
loadSettings().catch(() => {});
api('/auth/me').then(showApp).catch(() => {});
