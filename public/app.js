'use strict';
const $app = document.getElementById('app');
const S = { cur: 'MAD', tab: 'today', filter: 'open', data: {} };
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => Number(n || 0).toLocaleString('en', { maximumFractionDigits: 2 }) + ' ' + S.cur;
const cls = n => Number(n) < 0 ? 'neg' : 'pos';
const today = () => new Date().toISOString().slice(0, 10);
const toast = m => { const t = document.getElementById('toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2800); };

async function api(path, method = 'GET', body) {
  const r = await fetch('/api/' + path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== 'login') { showLogin(); throw new Error('Session expired'); }
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
const guard = fn => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message); } };

const STATUSES = ['lead_received', 'confirmed', 'parts_procured', 'in_transit', 'in_progress', 'completed', 'cancelled', 'warranty_return'];
const NEXT = { lead_received: 'confirmed', confirmed: 'parts_procured', parts_procured: 'in_transit', in_transit: 'in_progress', in_progress: 'completed' };
const label = s => s.replace(/_/g, ' ');
const opts = (arr, sel) => arr.map(o => { const [v, l] = Array.isArray(o) ? o : [o, label(o)]; return `<option value="${esc(v)}"${v == sel ? ' selected' : ''}>${esc(l)}</option>`; }).join('');

function showLogin() {
  $app.innerHTML = `<form class="login card" id="lf"><h1>Repair OS</h1><label>Owner password</label><input type="password" name="password" autocomplete="current-password" autofocus><button style="width:100%">Sign in</button></form>`;
  document.getElementById('lf').onsubmit = guard(async e => { e.preventDefault(); await api('login', 'POST', { password: e.target.password.value }); boot(); });
}

async function loadAll() {
  const [tickets, customers, suppliers, drivers, expenses, pnl] = await Promise.all(
    ['tickets', 'customers', 'suppliers', 'drivers', 'expenses'].map(p => api(p)).concat(api('pnl')));
  Object.assign(S.data, { tickets, customers, suppliers, drivers, expenses, pnl });
}

function shell(inner) {
  const tabs = [['today', '📊 Today'], ['jobs', '🔧 Jobs'], ['money', '💰 Money'], ['people', '👥 People']];
  $app.innerHTML = `<main>${inner}</main><nav>${tabs.map(([k, l]) => `<button data-t="${k}" class="${S.tab === k ? 'on' : ''}">${l}</button>`).join('')}</nav>`;
  $app.querySelectorAll('nav button').forEach(b => b.onclick = () => { S.tab = b.dataset.t; render(); });
}
const render = () => ({ today: vToday, jobs: vJobs, money: vMoney, people: vPeople }[S.tab])();

function vToday() {
  const p = S.data.pnl, t = p.totals;
  const kpi = (l, v, c = '') => `<div class="card kpi"><span class="mut">${l}</span><b class="${c}">${money(v)}</b></div>`;
  const upcoming = S.data.tickets.filter(x => !['completed', 'cancelled', 'warranty_return'].includes(x.status)).slice(0, 5);
  shell(`<h1>This month <span class="mut">${esc(p.from)} → ${esc(p.to)}</span></h1>
    <div class="grid">${kpi('Revenue', t.revenue)}${kpi('Job profit', t.job_profit, cls(t.job_profit))}${kpi('Opex', t.opex)}${kpi('Net margin', t.net_margin, cls(t.net_margin))}</div>
    <div class="grid">${kpi('Owed to suppliers', p.owed_suppliers, Number(p.owed_suppliers) > 0 ? 'neg' : '')}${kpi('Owed to drivers', p.owed_drivers, Number(p.owed_drivers) > 0 ? 'neg' : '')}</div>
    <p class="mut">${t.jobs} jobs completed · ${p.open_jobs} open</p>
    <h2>Next jobs</h2>${upcoming.map(ticketCard).join('') || '<p class="mut">No open jobs.</p>'}
    <button style="width:100%;margin-top:8px" id="newj">+ New job</button>
    <p style="text-align:center"><button class="sec" id="lo">Sign out</button></p>`);
  bindTickets(); document.getElementById('newj').onclick = () => ticketForm();
  document.getElementById('lo').onclick = guard(async () => { await api('logout', 'POST'); showLogin(); });
}

function ticketCard(t) {
  const next = NEXT[t.status];
  return `<div class="card" data-id="${esc(t.id)}"><div class="row"><b>${esc(t.ticket_code)} · ${esc(t.device_model)}</b><span class="pill">${esc(label(t.status))}</span></div>
    <div class="mut">${esc(t.customer_name || 'No customer')} · ${esc(t.primary_fault)}</div>
    <div class="row"><span>${money(t.gross_quoted_price)} <span class="${cls(t.net_profit)}">(+${money(t.net_profit)})</span></span>
    <span class="mut">${esc(String(t.scheduled_date || '').slice(0, 10))} ${esc(String(t.scheduled_time || '').slice(0, 5))}${t.under_warranty ? ' · 🛡 warranty' : ''}</span></div>
    <div class="row" style="margin-top:6px">${t.maps_pin_url ? `<a href="${esc(t.maps_pin_url)}" target="_blank" rel="noopener noreferrer">📍 Map</a>` : '<span></span>'}
    <span>${t.customer_phone ? `<a href="tel:${esc(t.customer_phone)}">📞</a> <a href="https://wa.me/${esc(String(t.customer_phone).replace(/\D/g, ''))}" target="_blank" rel="noopener noreferrer">💬</a> ` : ''}
    ${next ? `<button data-adv="${esc(t.id)}">→ ${esc(label(next))}</button>` : ''} <button class="sec" data-edit="${esc(t.id)}">Edit</button></span></div></div>`;
}
function bindTickets() {
  $app.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => ticketForm(S.data.tickets.find(t => t.id === b.dataset.edit)));
  $app.querySelectorAll('[data-adv]').forEach(b => b.onclick = guard(async () => {
    const t = S.data.tickets.find(x => x.id === b.dataset.adv), n = NEXT[t.status];
    if (n === 'completed') return ticketForm(t, true);
    await api('tickets/' + t.id, 'PATCH', { status: n }); await refresh();
  }));
}
async function refresh() { await loadAll(); render(); }

function vJobs() {
  const f = S.filter, list = S.data.tickets.filter(t => f === 'all' || (f === 'open' ? !['completed', 'cancelled', 'warranty_return'].includes(t.status) : t.status === f));
  shell(`<div class="row"><h1>Jobs</h1><button id="newj">+ New</button></div>
    <div class="chips">${['open', 'all', ...STATUSES].map(s => `<button class="${s === f ? '' : 'sec'}" data-f="${s}">${esc(label(s))}</button>`).join('')}</div>
    ${list.map(ticketCard).join('') || '<p class="mut">Nothing here.</p>'}`);
  bindTickets(); document.getElementById('newj').onclick = () => ticketForm();
  $app.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { S.filter = b.dataset.f; vJobs(); });
}

// ---------- Ticket form ----------
const AUDIT = [['audit_pre_touch', 'Touch works'], ['audit_pre_faceid', 'Face ID works'], ['audit_pre_rear_camera', 'Rear camera OK'], ['audit_pre_front_camera', 'Front camera OK'], ['audit_pre_microphone', 'Microphone OK'], ['audit_pre_charging', 'Charging OK'], ['audit_pre_chassis_dent', 'Chassis dent / damage']];
function ticketForm(t, completing = false) {
  const isNew = !t;
  t = t || { status: 'confirmed', device_brand: 'Apple', part_type: 'screen', part_grade: 'not_applicable', scheduled_date: today(), gross_quoted_price: '', deposit_amount: 0, part_purchase_cost: 0, driver_fee: 0, consumables_cost: 10,
    payment_method: 'cash', payment_state: 'unpaid', supplier_paid_instant: true, screen_protector_applied: true, warranty_period_days: 90,
    audit_pre_touch: true, audit_pre_faceid: true, audit_pre_rear_camera: true, audit_pre_front_camera: true, audit_pre_microphone: true, audit_pre_charging: true };
  if (completing) { t = { ...t, status: 'completed' }; }
  const locked = ['completed', 'warranty_return'].includes(t.status) && !isNew && !completing;
  const d = S.data, inp = (n, l, type = 'text', extra = '') => { let val = String(t[n] ?? ''); if (type === 'date') val = val.slice(0, 10); if (type === 'time') val = val.slice(0, 5); return `<label>${l}</label><input name="${n}" type="${type}" value="${esc(val)}" ${extra}>`; };
  const num = (n, l) => inp(n, l, 'number', `step="0.01" min="0" ${locked ? 'disabled' : ''}`);
  const chk = (n, l) => `<label class="chk"><input type="checkbox" name="${n}" ${t[n] ? 'checked' : ''}> ${l}</label>`;
  const el = document.createElement('div'); el.className = 'sheet';
  el.innerHTML = `<div><form id="tf"><div class="row"><h1>${isNew ? 'New job' : esc(t.ticket_code)}</h1><button type="button" class="sec" id="x">Close</button></div>
    ${locked ? '<p class="mut">🔒 Completed — economics are locked.</p>' : ''}
    <label>Customer</label><select name="customer_id"><option value="">— select —</option>${opts(d.customers.map(c => [c.id, `${c.full_name} · ${c.phone}`]), t.customer_id)}</select>
    <div class="grid"><div>${inp('device_model', 'Model *', 'text', 'required placeholder="iPhone 12 Pro Max"')}</div><div>${inp('device_color', 'Color')}</div>
    <div>${inp('device_imei_serial', 'IMEI / Serial')}</div><div>${inp('device_passcode', 'Passcode')}</div></div>
    ${inp('primary_fault', 'Fault *', 'text', 'required')}
    <div class="grid"><div><label>Part</label><select name="part_type">${opts(['screen', 'battery', 'rear_camera', 'front_camera', 'charging_port', 'housing', 'motherboard_ic', 'other'], t.part_type)}</select></div>
    <div><label>Screen grade</label><select name="part_grade">${opts(['not_applicable', 'original_pulled', 'oled_hard', 'oled_soft', 'incell', 'tft'], t.part_grade)}</select></div>
    <div>${inp('scheduled_date', 'Date', 'date')}</div><div>${inp('scheduled_time', 'Time', 'time')}</div></div>
    <label>Status</label><select name="status">${opts(STATUSES, t.status)}</select>
    <h2>Economics</h2><div class="grid"><div>${num('gross_quoted_price', 'Client price *')}</div><div>${num('deposit_amount', 'Deposit')}</div>
    <div>${num('part_purchase_cost', 'Part cost')}</div><div>${num('consumables_cost', 'Consumables')}</div></div>
    <label>Supplier</label><select name="supplier_id" ${locked ? 'disabled' : ''}><option value="">—</option>${opts(d.suppliers.map(s => [s.id, s.name]), t.supplier_id)}</select>${chk('supplier_paid_instant', 'Paid supplier on the spot (untick = on credit)')}
    <label>Driver</label><select name="driver_id" ${locked ? 'disabled' : ''}><option value="">—</option>${opts(d.drivers.map(x => [x.id, x.name]), t.driver_id)}</select>${num('driver_fee', 'Driver fee')}
    <div class="grid"><div><label>Payment method</label><select name="payment_method">${opts(['cash', 'bank_transfer', 'other'], t.payment_method)}</select></div>
    <div><label>Payment state</label><select name="payment_state">${opts(['unpaid', 'partially_paid', 'paid_in_full'], t.payment_state)}</select></div></div>
    <h2>Pre-repair audit</h2>${AUDIT.map(([n, l]) => chk(n, l)).join('')}${inp('audit_pre_notes', 'Audit notes')}
    <h2>Handover</h2>${chk('audit_post_verified', 'All functions tested after repair')}${chk('screen_protector_applied', 'Free screen protector applied')}${inp('warranty_period_days', 'Warranty (days)', 'number', 'min="0"')}
    ${t.warranty_expiration_date ? `<p class="mut">Warranty until ${esc(String(t.warranty_expiration_date).slice(0, 10))}</p>` : ''}
    <div class="profit"><div class="row"><span>Net profit</span><b id="np"></b></div><button style="width:100%;margin-top:8px">${completing ? 'Complete job' : 'Save'}</button></div>
    ${isNew ? '' : '<p style="text-align:center"><button type="button" class="danger" id="del">Delete</button></p>'}</form></div>`;
  document.body.appendChild(el);
  const f = el.querySelector('#tf'), v = n => Number(f[n].value) || 0;
  const calc = () => { const p = v('gross_quoted_price') - v('part_purchase_cost') - v('driver_fee') - v('consumables_cost'); const b = el.querySelector('#np'); b.textContent = money(p); b.className = cls(p); };
  f.oninput = calc; calc();
  f.driver_id.onchange = () => { const dr = d.drivers.find(x => x.id === f.driver_id.value); if (dr && !v('driver_fee')) { f.driver_fee.value = dr.default_rate_per_trip; calc(); } };
  el.querySelector('#x').onclick = () => el.remove();
  if (!isNew) el.querySelector('#del').onclick = guard(async () => { if (confirm('Delete this ticket permanently?')) { await api('tickets/' + t.id, 'DELETE'); el.remove(); await refresh(); } });
  f.onsubmit = guard(async e => {
    e.preventDefault();
    const body = {};
    for (const x of f.elements) { if (!x.name || x.disabled) continue; body[x.name] = x.type === 'checkbox' ? x.checked : x.value; }
    if (body.warranty_period_days === '') delete body.warranty_period_days;
    if (isNew) await api('tickets', 'POST', body); else await api('tickets/' + t.id, 'PATCH', body);
    el.remove(); toast('Saved'); await refresh();
  });
}

// ---------- Money ----------
function vMoney() {
  const d = S.data, p = d.pnl, t = p.totals;
  shell(`<h1>Money</h1>
    <div class="card"><div class="row"><b>P&amp;L</b><span class="mut">${esc(p.from)} → ${esc(p.to)}</span></div>
    <table><tr><td>Revenue</td><td>${money(t.revenue)}</td></tr><tr><td>− Parts</td><td>${money(t.parts)}</td></tr><tr><td>− Drivers</td><td>${money(t.drivers)}</td></tr>
    <tr><td>− Consumables</td><td>${money(t.consumables)}</td></tr><tr><td><b>Job profit</b></td><td class="${cls(t.job_profit)}"><b>${money(t.job_profit)}</b></td></tr>
    <tr><td>− Opex</td><td>${money(t.opex)}</td></tr><tr><td><b>Net margin</b></td><td class="${cls(t.net_margin)}"><b>${money(t.net_margin)}</b></td></tr></table></div>
    <div class="card"><b>Daily</b><table><tr><th>Day</th><th>Jobs</th><th>Profit</th><th>Opex</th><th>Net</th></tr>${p.daily.map(r => `<tr><td>${esc(String(r.day).slice(5, 10))}</td><td>${r.jobs}</td><td>${money(r.job_profit)}</td><td>${money(r.opex)}</td><td class="${cls(r.net_margin)}">${money(r.net_margin)}</td></tr>`).join('')}</table></div>
    <h2>Add expense</h2><form class="card" id="ef"><div class="grid"><div><label>Category</label><select name="expense_category">${opts(['social_ads', 'tools', 'phone_4g', 'packaging', 'transport', 'consumables_stock', 'other'])}</select></div>
    <div><label>Amount</label><input name="amount" type="number" step="0.01" min="0" required></div></div><label>Note</label><input name="receipt_note"><label>Date</label><input name="expense_date" type="date" value="${today()}"><button style="width:100%">Add</button></form>
    ${d.expenses.slice(0, 15).map(e => `<div class="card row"><span>${esc(String(e.expense_date).slice(0, 10))} · ${esc(label(e.expense_category))}<br><span class="mut">${esc(e.receipt_note || '')}</span></span><span>${money(e.amount)} <button class="sec" data-delx="${esc(e.id)}">✕</button></span></div>`).join('')}
    <h2>Drivers</h2>${d.drivers.map(x => `<div class="card row"><span>${esc(x.name)}<br><span class="mut">Owed: ${money(x.wallet_balance)}</span></span><button ${Number(x.wallet_balance) > 0 ? '' : 'disabled'} data-settle="${esc(x.id)}">Pay out</button></div>`).join('') || '<p class="mut">No drivers yet.</p>'}
    <h2>Suppliers</h2>${d.suppliers.map(x => `<div class="card row"><span>${esc(x.name)}<br><span class="mut">We owe: ${money(x.balance_credit)}</span></span><button ${Number(x.balance_credit) > 0 ? '' : 'disabled'} data-sp="${esc(x.id)}">Pay</button></div>`).join('') || '<p class="mut">No suppliers yet.</p>'}`);
  document.getElementById('ef').onsubmit = guard(async e => { e.preventDefault(); await api('expenses', 'POST', Object.fromEntries(new FormData(e.target))); toast('Added'); await refresh(); });
  $app.querySelectorAll('[data-delx]').forEach(b => b.onclick = guard(async () => { if (confirm('Delete expense?')) { await api('expenses/' + b.dataset.delx, 'DELETE'); await refresh(); } }));
  $app.querySelectorAll('[data-settle]').forEach(b => b.onclick = guard(async () => { const x = d.drivers.find(y => y.id === b.dataset.settle); if (confirm(`Pay ${money(x.wallet_balance)} to ${x.name}?`)) { await api(`drivers/${x.id}/settle`, 'POST', {}); toast('Paid'); await refresh(); } }));
  $app.querySelectorAll('[data-sp]').forEach(b => b.onclick = guard(async () => { const x = d.suppliers.find(y => y.id === b.dataset.sp); const a = prompt(`Amount paid to ${x.name} (owed ${x.balance_credit})`, x.balance_credit); if (a && Number(a) > 0) { await api('supplier-transactions', 'POST', { supplier_id: x.id, transaction_type: 'payment_settled', amount: a }); await refresh(); } }));
}

// ---------- People ----------
function vPeople() {
  const d = S.data, sub = (id, title, fields) => `<h2>${title}</h2><form class="card" id="${id}">${fields.map(([n, l, ty = 'text', req]) => `<label>${l}</label><input name="${n}" type="${ty}" ${req ? 'required' : ''} ${ty === 'number' ? 'step="0.01"' : ''}>`).join('')}<button style="width:100%">Add</button></form>`;
  shell(`<h1>People</h1>${sub('cf', 'New customer', [['full_name', 'Name', 'text', 1], ['phone', 'Phone', 'tel', 1], ['address_neighborhood', 'Neighborhood'], ['maps_pin_url', 'Google Maps pin', 'url']])}
    ${d.customers.map(c => `<div class="card row"><span>${esc(c.full_name)}<br><span class="mut">${esc(c.phone)} · spent ${money(c.total_lifetime_spent)}</span></span></div>`).join('')}
    ${sub('sf', 'New supplier (grossiste)', [['name', 'Name', 'text', 1], ['contact_phone', 'Phone', 'tel'], ['address_location', 'Location']])}
    ${sub('df', 'New driver', [['name', 'Name', 'text', 1], ['phone', 'Phone', 'tel', 1], ['default_rate_per_trip', 'Default fee per trip', 'number']])}`);
  for (const [id, path] of [['cf', 'customers'], ['sf', 'suppliers'], ['df', 'drivers']])
    document.getElementById(id).onsubmit = guard(async e => { e.preventDefault(); await api(path, 'POST', Object.fromEntries(new FormData(e.target))); toast('Added'); await refresh(); });
}

async function boot() {
  const c = await fetch('/api/config').then(r => r.json());
  S.cur = c.currency;
  if (!c.authed) return showLogin();
  guard(async () => { await loadAll(); render(); })();
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
boot();
