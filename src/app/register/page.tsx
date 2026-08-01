"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1d4ed855,transparent_40%),radial-gradient(circle_at_bottom_right,#7c3aed55,transparent_40%),linear-gradient(to_bottom,#020617,#030712,#020617)]" />

      {/* Floating Glow */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[140px] animate-pulse" />

      <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[170px] animate-pulse" />

      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main */}
      <div className="relative flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(59,130,246,.25)] p-10">

          <div className="mb-10 text-center">

            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_50px_rgba(34,211,238,.8)]">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-2.761 2.239-5 5-5m-5 5V5m0 6H6m6 0v6m0-6h6"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-wide bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              CREATE ACCOUNT
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Join the next generation of intelligent experiences.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 backdrop-blur">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="mb-2 block text-sm text-cyan-300">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:shadow-[0_0_35px_rgba(34,211,238,.35)]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-cyan-300">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:shadow-[0_0_35px_rgba(34,211,238,.35)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-cyan-300">
                Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:shadow-[0_0_35px_rgba(34,211,238,.35)]"
              />
            </div>

            <button
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,.6)] disabled:opacity-50"
            >
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-1000 group-hover:translate-x-[100%]" />

              <span className="relative">
                {loading ? "Creating Neural Identity..." : "Initialize Account"}
              </span>
            </button>

          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-slate-400">

            Already connected?

            <Link
              href="/login"
              className="ml-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Access Portal →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}