import { useState, useEffect, FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [totpUri, setTotpUri] = useState("");
  const [totpSecret, setTotpSecret] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totp }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleShowSetup = async () => {
    try {
      const res = await fetch("/api/auth/totp-qr");
      const data = await res.json();
      setTotpUri(data.uri);
      setTotpSecret(data.secret);
      setShowSetup(true);
    } catch {
      setError("Failed to load setup");
    }
  };

  return (
    <>
      <Head>
        <title>OpenClaw Voice - Login</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
        <div className="w-full max-w-sm">
          <div className="border border-gray-800 rounded-lg bg-gray-950 p-6">
            <h1 className="text-xl font-semibold text-center mb-1">
              OpenClaw Voice
            </h1>
            <p className="text-xs text-gray-500 text-center mb-6">
              Sign in to access the playground
            </p>

            {showSetup ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-gray-400 text-center">
                  Scan this QR code with your authenticator app
                </p>
                <div className="bg-white p-3 rounded-md">
                  <QRCodeSVG value={totpUri} size={180} />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    Or enter this key manually:
                  </p>
                  <code className="text-xs text-cyan-400 bg-gray-900 px-2 py-1 rounded font-mono select-all">
                    {totpSecret}
                  </code>
                </div>
                <button
                  onClick={() => setShowSetup(false)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-sm font-medium transition-colors"
                >
                  Done — Back to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
                <input
                  type="text"
                  placeholder="2FA Code"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  autoComplete="one-time-code"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 tracking-widest text-center font-mono"
                />

                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-md text-sm font-medium transition-colors"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <button
                  type="button"
                  onClick={handleShowSetup}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
                >
                  Set up 2FA authenticator
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
