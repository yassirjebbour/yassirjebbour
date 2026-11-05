import { describe, expect, it } from "vitest";
import { clientIp, assertSameOrigin, readLimited } from "@/server/http/api";
import { zipLooksSafe, sniffType } from "@/server/repo/files";
import { hashPassword, verifyPassword, needsRehash } from "@/server/auth/password";

const req = (headers: Record<string, string>, method = "POST", body?: BodyInit) => new Request("http://localhost:3100/api/v1/x", { method, headers, body, duplex: "half" } as RequestInit);

describe("security regressions (from docs/SECURITY_REVIEW_FINDINGS.md)", () => {
  it("F-02: rate-limit IP is the address appended by our proxy, not the client's first X-Forwarded-For", () => {
    process.env.TRUSTED_PROXY_HOPS = "1";
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))).toBe("203.0.113.9");
    expect(clientIp(req({}))).toBe("direct");
    process.env.TRUSTED_PROXY_HOPS = "0";
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6" }))).toBe("direct");
    delete process.env.TRUSTED_PROXY_HOPS;
  });

  it("F-09: X-Forwarded-Host cannot make a foreign Origin pass the CSRF check", () => {
    expect(() => assertSameOrigin(req({ origin: "https://evil.example", host: "localhost:3100", "x-forwarded-host": "evil.example" }))).toThrow(/Cross-origin/);
    expect(() => assertSameOrigin(req({ origin: "http://localhost:3100", host: "localhost:3100" }))).not.toThrow();
    expect(() => assertSameOrigin(req({ host: "localhost:3100" }))).toThrow(/Missing origin/);
    expect(() => assertSameOrigin(req({ host: "x" }, "GET"))).not.toThrow();
  });

  it("F-04: body limit is enforced while streaming, even without Content-Length", async () => {
    const big = new ReadableStream({ start(c) { for (let i = 0; i < 10; i++) c.enqueue(new Uint8Array(100_000)); c.close(); } });
    await expect(readLimited(req({}, "POST", big), 256 * 1024)).rejects.toThrow(/too large/);
    const small = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('{"a":1}')); c.close(); } });
    expect((await readLimited(req({}, "POST", small), 1024)).byteLength).toBe(7);
  });

  it("F-05: archives claiming huge expansion are rejected before parsing", () => {
    // Minimal ZIP: one central-directory entry claiming 500 MB uncompressed from 1 KB, then the EOCD record.
    const cd = Buffer.alloc(46 + 17);
    cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt32LE(1024, 20); cd.writeUInt32LE(500 * 1024 * 1024, 24); cd.writeUInt16LE(17, 28);
    cd.write("word/document.xml", 46);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(1, 8); eocd.writeUInt16LE(1, 10); eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(4, 16);
    const zip = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), cd, eocd]);
    expect(zipLooksSafe(zip)).toBe(false);
    expect(sniffType(zip)).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    expect(sniffType(Buffer.from("MZ\u0000\u0001binary"))).toBeNull();
    expect(sniffType(Buffer.from("%PDF-1.7 ..."))).toBe("application/pdf");
  });

  it("F-12: password hashes use the current parameters and old ones are flagged for upgrade", async () => {
    const h = await hashPassword("correct horse battery");
    expect(h.startsWith("scrypt$32768$8$3$")).toBe(true);
    expect(needsRehash(h)).toBe(false);
    expect(needsRehash("scrypt$32768$8$1$x$y")).toBe(true);
    expect(await verifyPassword("correct horse battery", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
});
