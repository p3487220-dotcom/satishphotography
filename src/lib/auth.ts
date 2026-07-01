import crypto from "crypto";

const SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || "dev_secret";
const TOKEN_TTL = 60 * 60; // 1 hour

export function createAdminToken(username: string) {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const payload = `${username}:${expires}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyAdminToken(token: string | null) {
  if (!token) return { ok: false };
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [username, expStr, sig] = decoded.split(":");
    const payload = `${username}:${expStr}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (!sig || !expected || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return { ok: false };
    }
    const exp = parseInt(expStr, 10);
    if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) return { ok: false };
    return { ok: true, username };
  } catch (err) {
    return { ok: false };
  }
}
