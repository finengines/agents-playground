import { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose";
import crypto from "crypto";

/**
 * RFC 6238 TOTP verification — no external deps.
 * Base32 decode + HMAC-SHA1 based OTP.
 */
function base32Decode(encoded: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of encoded.toUpperCase()) {
    const val = alphabet.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTOTP(secret: string, timeStep: number): string {
  const key = base32Decode(secret);
  const time = Buffer.alloc(8);
  time.writeUInt32BE(Math.floor(timeStep), 4);
  const hmac = crypto.createHmac("sha1", key).update(time).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

function verifyTOTP(token: string, secret: string): boolean {
  const now = Math.floor(Date.now() / 1000 / 30);
  // Allow ±1 window for clock drift
  for (let i = -1; i <= 1; i++) {
    if (generateTOTP(secret, now + i) === token) return true;
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, totp } = req.body;

  // Validate email
  const expectedEmail = process.env.AUTH_EMAIL || "";
  if (email?.toLowerCase() !== expectedEmail.toLowerCase()) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Validate password via scrypt
  const storedHash = process.env.AUTH_PASSWORD_HASH || "";
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return res.status(500).json({ error: "Auth not configured" });
  }

  const inputHash = crypto.scryptSync(password || "", salt, 64).toString("hex");
  if (!crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(inputHash, "hex"))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Validate TOTP
  const totpSecret = process.env.AUTH_TOTP_SECRET || "";
  if (!verifyTOTP(totp || "", totpSecret)) {
    return res.status(401).json({ error: "Invalid 2FA code" });
  }

  // Issue JWT — 30 day expiry
  const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || "");
  const token = await new SignJWT({ email: email.toLowerCase(), iat: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  // Set httpOnly secure cookie
  res.setHeader(
    "Set-Cookie",
    `oc_session=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${30 * 24 * 60 * 60}`
  );

  return res.status(200).json({ ok: true });
}
