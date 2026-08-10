"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Moon,
  Sparkles,
  Sun,
  Target,
  Zap,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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

  const isDark = resolvedTheme === "dark";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================================ */}
      {/* BACKGROUND */}
      {/* ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/[0.08] blur-3xl dark:bg-sky-400/[0.06]" />

        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-400/[0.05]" />

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* TOP BAR */}
      {/* ============================================================ */}

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="TaskFlow home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)] shadow-sm transition-transform duration-200 group-hover:scale-105">
            TF
          </div>

          <span className="text-sm font-bold tracking-tight">TaskFlow</span>
        </Link>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* ============================================================ */}
      {/* MAIN */}
      {/* ============================================================ */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-7xl items-center px-5 pb-10 pt-4 sm:px-8 lg:px-10 lg:pt-0">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/[0.04] dark:shadow-black/20 lg:grid-cols-2">
          {/* ======================================================== */}
          {/* LEFT — BRAND PANEL */}
          {/* ======================================================== */}

          <section className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--background)] p-10 lg:flex lg:min-h-[690px] lg:flex-col lg:justify-between xl:p-14">
            {/* Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/[0.10] blur-3xl dark:bg-sky-400/[0.08]" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-emerald-500/[0.08] blur-3xl dark:bg-emerald-400/[0.06]" />

            {/* Content */}
            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/[0.07] px-3 py-1.5 text-xs font-semibold text-sky-600 dark:border-sky-400/20 dark:bg-sky-400/[0.07] dark:text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                Your productivity workspace
              </div>

              <h2 className="max-w-lg text-4xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-5xl">
                Turn your plans into{" "}
                <span className="text-sky-600 dark:text-sky-400">
                  progress.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted-foreground)] xl:text-base">
                Organize your tasks, keep projects moving, and stay focused
                on what matters most — all from one simple workspace.
              </p>

              {/* Feature list */}
              <div className="mt-9 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-400/10">
                    <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </div>

                  <span className="text-sm font-medium">
                    Organize tasks without the clutter
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-400/10">
                    <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>

                  <span className="text-sm font-medium">
                    Keep your priorities clear
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
                    <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <span className="text-sm font-medium">
                    Build momentum every day
                  </span>
                </div>
              </div>
            </div>

            {/* Fake dashboard preview */}
            <div className="relative mt-12">
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
                {/* Preview header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-[9px] font-bold text-[var(--primary-foreground)]">
                      TF
                    </div>

                    <div>
                      <div className="h-2 w-16 rounded-full bg-[var(--foreground)]/15" />
                      <div className="mt-1.5 h-1.5 w-10 rounded-full bg-[var(--muted-foreground)]/10" />
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <div className="h-6 w-6 rounded-md bg-[var(--muted)]" />
                    <div className="h-6 w-6 rounded-md bg-[var(--muted)]" />
                  </div>
                </div>

                {/* Preview body */}
                <div className="grid grid-cols-3 gap-2 p-4">
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-10 rounded-full bg-sky-500/30" />
                      <div className="h-4 w-4 rounded bg-sky-500/10" />
                    </div>
                    <div className="mt-4 h-5 w-7 rounded bg-sky-500/30" />
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-10 rounded-full bg-amber-500/30" />
                      <div className="h-4 w-4 rounded bg-amber-500/10" />
                    </div>
                    <div className="mt-4 h-5 w-7 rounded bg-amber-500/30" />
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 w-10 rounded-full bg-emerald-500/30" />
                      <div className="h-4 w-4 rounded bg-emerald-500/10" />
                    </div>
                    <div className="mt-4 h-5 w-7 rounded bg-emerald-500/30" />
                  </div>
                </div>

                <div className="space-y-2 px-4 pb-4">
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
                    <div className="h-4 w-4 rounded-full border border-[var(--border)]" />
                    <div className="flex-1">
                      <div className="h-2 w-32 rounded-full bg-[var(--foreground)]/10" />
                      <div className="mt-1.5 h-1.5 w-20 rounded-full bg-[var(--muted-foreground)]/10" />
                    </div>
                    <div className="h-5 w-12 rounded-md bg-sky-500/10" />
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
                    <div className="h-4 w-4 rounded-full border border-[var(--border)]" />
                    <div className="flex-1">
                      <div className="h-2 w-24 rounded-full bg-[var(--foreground)]/10" />
                      <div className="mt-1.5 h-1.5 w-16 rounded-full bg-[var(--muted-foreground)]/10" />
                    </div>
                    <div className="h-5 w-12 rounded-md bg-amber-500/10" />
                  </div>
                </div>
              </div>

              {/* Floating completion card */}
              <div className="absolute -bottom-5 -right-5 hidden w-40 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl xl:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>

                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      Productivity
                    </p>
                    <p className="text-sm font-bold">84%</p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div className="h-full w-[84%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* RIGHT — REGISTER */}
          {/* ======================================================== */}

          <section className="relative flex min-h-[690px] items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
            <div className="w-full max-w-md">
              {/* Mobile branding */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)] shadow-sm">
                  TF
                </div>

                <p className="text-sm font-bold tracking-tight">
                  TaskFlow
                </p>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted-foreground)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Start for free
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Set up your workspace and start getting things done.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3.5 text-sm text-red-600 dark:text-red-400"
                >
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <p className="leading-5">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="e.g. Sandumal Fernando"
                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)]/70 hover:border-[var(--muted-foreground)]/30 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:focus:border-sky-400 dark:focus:ring-sky-400/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)]/70 hover:border-[var(--muted-foreground)]/30 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:focus:border-sky-400 dark:focus:ring-sky-400/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold"
                    >
                      Password
                    </label>

                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      Minimum 6 characters
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 pr-11 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)]/70 hover:border-[var(--muted-foreground)]/30 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:focus:border-sky-400 dark:focus:ring-sky-400/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password strength / requirements */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span
                        className={`h-1 w-7 rounded-full transition-colors ${
                          password.length >= 1
                            ? "bg-sky-500"
                            : "bg-[var(--muted)]"
                        }`}
                      />
                      <span
                        className={`h-1 w-7 rounded-full transition-colors ${
                          password.length >= 6
                            ? "bg-sky-500"
                            : "bg-[var(--muted)]"
                        }`}
                      />
                      <span
                        className={`h-1 w-7 rounded-full transition-colors ${
                          password.length >= 10
                            ? "bg-emerald-500"
                            : "bg-[var(--muted)]"
                        }`}
                      />
                    </div>

                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {password.length === 0
                        ? "Use at least 6 characters"
                        : password.length < 6
                          ? "Password is too short"
                          : password.length < 10
                            ? "Good password"
                            : "Strong password"}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Already a member?
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <Link
                href="/login"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:shadow-sm"
              >
                Log in to TaskFlow
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Trust note */}
              <div className="mt-7 flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-[var(--muted-foreground)]">
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                <span>Simple workspace. Clear priorities. Better focus.</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}