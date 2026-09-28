const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const auth = require('./auth');

for (const k of ['DATABASE_URL', 'OWNER_PASSWORD', 'SESSION_SECRET'])
  if (!process.env[k]) { console.error(`Missing env var ${k} (see .env.example)`); process.exit(1); }

require('pg').types.setTypeParser(1082, v => v); // keep DATE as 'YYYY-MM-DD' (no TZ shift)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => { res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /\n'));

// Static shell is public (it only contains the login screen); all data is behind auth.
app.use(express.static(path.join(__dirname, '../public')));
app.get('/api/config', (req, res) => res.json({ currency: process.env.CURRENCY || 'MAD', authed: auth.valid(req) }));
app.post('/api/login', auth.login);
app.post('/api/logout', auth.logout);
app.use('/api', auth.require);

const q = (text, params) => pool.query(text, params).then(r => r.rows);
const wrap = fn => (req, res) => fn(req, res).catch(e => {
  const known = { '23505': 409, '23503': 409, '23514': 400, '22P02': 400, P0001: 400, '23502': 400 };
  const s = known[e.code] || 500;
  if (s === 500) console.error(e);
  res.status(s).json({ error: s === 500 ? 'Server error' : e.message });
});

// Generic CRUD with whitelisted columns
function crud(name, table, cols, order, extra = {}) {
  const pick = (b) => { const k = cols.filter(c => b[c] !== undefined); return { k, v: k.map(c => b[c] === '' ? null : b[c]) }; };
  app.get(`/api/${name}`, wrap(async (req, res) => res.json(await q(extra.list || `SELECT * FROM ${table} ORDER BY ${order}`))));
  app.post(`/api/${name}`, wrap(async (req, res) => {
    const { k, v } = pick(req.body);
    const r = await q(`INSERT INTO ${table}(${k.join(',')}) VALUES (${k.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING *`, v);
    res.status(201).json(r[0]);
  }));
  app.patch(`/api/${name}/:id`, wrap(async (req, res) => {
    const { k, v } = pick(req.body);
    if (!k.length) return res.status(400).json({ error: 'No fields' });
    const r = await q(`UPDATE ${table} SET ${k.map((c, i) => `${c}=$${i + 1}`).join(',')} WHERE id=$${k.length + 1} RETURNING *`, [...v, req.params.id]);
    r[0] ? res.json(r[0]) : res.status(404).json({ error: 'Not found' });
  }));
  app.delete(`/api/${name}/:id`, wrap(async (req, res) => {
    const r = await q(`DELETE FROM ${table} WHERE id=$1 RETURNING id`, [req.params.id]);
    r[0] ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found' });
  }));
}

crud('customers', 'customers', ['full_name', 'phone', 'address_neighborhood', 'maps_pin_url'], 'full_name');
crud('suppliers', 'suppliers', ['name', 'contact_phone', 'address_location', 'notes'], 'name');
crud('drivers', 'drivers', ['name', 'phone', 'vehicle_type', 'default_rate_per_trip'], 'name');
crud('expenses', 'operating_expenses', ['expense_category', 'amount', 'receipt_note', 'expense_date'], 'expense_date DESC, created_at DESC');

const TICKET_COLS = ['customer_id', 'device_brand', 'device_model', 'device_color', 'device_imei_serial', 'device_passcode',
  'primary_fault', 'part_type', 'part_grade', 'status', 'scheduled_date', 'scheduled_time', 'gross_quoted_price', 'deposit_amount',
  'part_purchase_cost', 'supplier_id', 'supplier_paid_instant', 'driver_id', 'driver_fee', 'driver_fee_paid', 'consumables_cost',
  'payment_method', 'payment_state', 'audit_pre_touch', 'audit_pre_faceid', 'audit_pre_rear_camera', 'audit_pre_front_camera',
  'audit_pre_microphone', 'audit_pre_charging', 'audit_pre_chassis_dent', 'audit_pre_notes', 'audit_post_verified',
  'screen_protector_applied', 'warranty_period_days'];
crud('tickets', 'repair_tickets', TICKET_COLS, '', {
  list: `SELECT t.*, c.full_name AS customer_name, c.phone AS customer_phone, c.address_neighborhood, c.maps_pin_url,
                (t.warranty_expiration_date >= CURRENT_DATE) AS under_warranty
           FROM repair_tickets t LEFT JOIN customers c ON c.id = t.customer_id
          ORDER BY (t.status IN ('completed','cancelled')), t.scheduled_date DESC, t.scheduled_time NULLS LAST, t.created_at DESC`
});

// Driver settlement: pays out the entire wallet, flags the driver's completed tickets as paid.
app.post('/api/drivers/:id/settle', wrap(async (req, res) => {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const d = (await c.query('SELECT wallet_balance FROM drivers WHERE id=$1 FOR UPDATE', [req.params.id])).rows[0];
    if (!d) { await c.query('ROLLBACK'); return res.status(404).json({ error: 'Not found' }); }
    const amount = req.body?.amount !== undefined ? Number(req.body.amount) : Number(d.wallet_balance);
    if (!(amount > 0)) { await c.query('ROLLBACK'); return res.status(400).json({ error: 'Nothing to pay' }); }
    await c.query('INSERT INTO driver_payouts(driver_id, amount_paid, notes) VALUES ($1,$2,$3)', [req.params.id, amount, req.body?.notes || null]);
    if (req.body?.amount === undefined)
      await c.query("UPDATE repair_tickets SET driver_fee_paid = TRUE WHERE driver_id=$1 AND status='completed' AND NOT driver_fee_paid", [req.params.id]);
    await c.query('COMMIT');
    res.json({ ok: true, paid: amount });
  } catch (e) { await c.query('ROLLBACK').catch(() => {}); throw e; } finally { c.release(); }
}));
app.get('/api/driver-payouts', wrap(async (req, res) => res.json(await q('SELECT p.*, d.name AS driver_name FROM driver_payouts p JOIN drivers d ON d.id=p.driver_id ORDER BY payout_date DESC LIMIT 200'))));

// Supplier ledger
app.get('/api/supplier-transactions', wrap(async (req, res) => res.json(await q(
  `SELECT x.*, s.name AS supplier_name, t.ticket_code FROM supplier_transactions x JOIN suppliers s ON s.id=x.supplier_id
     LEFT JOIN repair_tickets t ON t.id=x.related_ticket_id ORDER BY x.created_at DESC LIMIT 200`))));
app.post('/api/supplier-transactions', wrap(async (req, res) => {
  const b = req.body;
  const r = await q('INSERT INTO supplier_transactions(supplier_id, transaction_type, amount, related_ticket_id, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [b.supplier_id, b.transaction_type, b.amount, b.related_ticket_id || null, b.notes || null]);
  res.status(201).json(r[0]);
}));

// P&L + dashboard. Range defaults to the current month.
app.get('/api/pnl', wrap(async (req, res) => {
  const from = req.query.from || new Date().toISOString().slice(0, 8) + '01';
  const to = req.query.to || new Date().toISOString().slice(0, 10);
  const [tot] = await q(`SELECT COALESCE(SUM(jobs),0)::INT jobs, COALESCE(SUM(revenue),0) revenue, COALESCE(SUM(parts),0) parts,
      COALESCE(SUM(drivers),0) drivers, COALESCE(SUM(consumables),0) consumables, COALESCE(SUM(job_profit),0) job_profit,
      COALESCE(SUM(opex),0) opex, COALESCE(SUM(net_margin),0) net_margin FROM v_daily_pnl WHERE day BETWEEN $1 AND $2`, [from, to]);
  const daily = await q('SELECT * FROM v_daily_pnl WHERE day BETWEEN $1 AND $2 ORDER BY day', [from, to]);
  const opexByCat = await q('SELECT expense_category, SUM(amount) amount FROM operating_expenses WHERE expense_date BETWEEN $1 AND $2 GROUP BY 1 ORDER BY 2 DESC', [from, to]);
  const [owed] = await q(`SELECT (SELECT COALESCE(SUM(balance_credit),0) FROM suppliers) owed_suppliers,
      (SELECT COALESCE(SUM(wallet_balance),0) FROM drivers) owed_drivers,
      (SELECT COUNT(*) FROM repair_tickets WHERE status NOT IN ('completed','cancelled','warranty_return'))::INT open_jobs`);
  res.json({ from, to, totals: tot, daily, opexByCat, ...owed });
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
const port = process.env.PORT || 3000;
if (require.main === module) app.listen(port, () => console.log(`Repair OS on :${port}`));
module.exports = { app, pool };
