import { NextApiRequest, NextApiResponse } from "next";

// Returns the TOTP setup URI for scanning into an authenticator app.
// Only accessible once — after first login, the user should already have it saved.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.AUTH_TOTP_SECRET || "";
  const email = process.env.AUTH_EMAIL || "user";
  const uri = `otpauth://totp/OpenClaw%20Voice?secret=${secret}&issuer=OpenClaw&algorithm=SHA1&digits=6&period=30`;

  res.status(200).json({ uri, secret });
}
