import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, keylen: number, opts: object) => Promise<Buffer>;

// scrypt N=2^15, r=8, p=3 — one of the OWASP Password Storage Cheat Sheet equivalents of N=2^17,r=8,p=1
// (same work, 32 MiB instead of 128 MiB per hash, which matters with concurrent sign-ins). 64-byte key.
const N = 1 << 15, r = 8, p = 3, KEYLEN = 64;
const MAXMEM = 128 * N * r * 2;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEYLEN, { N, r, p, maxmem: MAXMEM });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, rr, pp, saltB64, keyB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const key = await scrypt(password.normalize("NFKC"), Buffer.from(saltB64, "base64url"), expected.length, {
    N: Number(n), r: Number(rr), p: Number(pp), maxmem: 128 * Number(n) * Number(rr) * 2,
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** True when a stored hash uses older parameters; it is upgraded at the next successful sign-in. */
export function needsRehash(stored: string) {
  const [alg, n, rr, pp] = stored.split("$");
  return alg !== "scrypt" || Number(n) !== N || Number(rr) !== r || Number(pp) !== p;
}

/** Used to equalise timing when the email does not exist. */
export const DUMMY_HASH = "scrypt$32768$8$3$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);
