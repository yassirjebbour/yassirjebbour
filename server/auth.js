// Single-operator auth: password -> HMAC-signed, httpOnly cookie. No user table needed.
const crypto = require('crypto');
const COOKIE = 'ros_session', TTL_MS = 30 * 24 * 3600 * 1000;
const secret = () => process.env.SESSION_SECRET;
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('base64url');
const safeEq = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};
const parseCookies = (h = '') => Object.fromEntries(h.split(';').map(s => s.trim().split(/=(.*)/s).slice(0, 2)).filter(p => p[0]));
function issue(res) {
  const exp = String(Date.now() + TTL_MS);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${exp}.${sign(exp)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${TTL_MS / 1000}${secure}`);
}
function valid(req) {
  const c = parseCookies(req.headers.cookie)[COOKIE];
  if (!c) return false;
  const [exp, sig] = c.split('.');
  return !!sig && safeEq(sig, sign(exp)) && Number(exp) > Date.now();
}
const fails = new Map(); // ip -> {n, until}
function login(req, res) {
  const ip = req.ip, f = fails.get(ip) || { n: 0, until: 0 };
  if (f.until > Date.now()) return res.status(429).json({ error: 'Too many attempts, try later' });
  if (safeEq(req.body?.password ?? '', process.env.OWNER_PASSWORD)) { fails.delete(ip); issue(res); return res.json({ ok: true }); }
  f.n++; if (f.n >= 5) { f.until = Date.now() + 15 * 60 * 1000; f.n = 0; }
  fails.set(ip, f);
  res.status(401).json({ error: 'Wrong password' });
}
const logout = (req, res) => { res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`); res.json({ ok: true }); };
const require_ = (req, res, next) => valid(req) ? next() : res.status(401).json({ error: 'Unauthorized' });
module.exports = { login, logout, require: require_, valid };
