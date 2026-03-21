"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("LOGIN NON-JSON RESPONSE:", text);
        setMessage("Login failed. Server returned invalid response.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setMessage(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      setMessage("Login successful. Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("LOGIN FETCH ERROR:", error);
      setMessage("Login request failed. Check server.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-blue-900 flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-red-600 p-10 text-white">
          <div className="max-w-md">
            <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              Youth Empowerment Platform
            </p>

            <h1 className="text-4xl font-bold leading-tight">
              Empowering youth through leadership, contributions, welfare,
              projects, and growth.
            </h1>

            <p className="mt-5 text-base text-white/90">
              Manage members, track contributions, build projects, grow training
              programs, and prepare the platform for future referral and MLM
              expansion.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
              <p className="mt-2 text-slate-500">
                Access your Youth Empowerment Platform account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0748063855"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-purple-600"
                  required
                />
              </div>
<div className="text-right">
  <a
    href="/forgot-password"
    className="text-sm font-medium text-purple-600 hover:text-purple-700"
  >
    Forgot password?
  </a>
</div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {message && (
              <p
                className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                  message.toLowerCase().includes("successful")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}