"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[var(--background)]">
      {/* ================================================================
          BACKGROUND
      ================================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--primary)]/[0.06] blur-3xl" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[360px] w-[360px] rounded-full bg-sky-500/[0.05] blur-3xl dark:bg-sky-400/[0.04]" />

        <div className="absolute right-[-120px] top-[35%] h-[360px] w-[360px] rounded-full bg-emerald-500/[0.04] blur-3xl dark:bg-emerald-400/[0.035]" />

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ================================================================
          THEME TOGGLE
      ================================================================ */}

      <button
        type="button"
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:text-[var(--foreground)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      {/* ================================================================
          MAIN CONTENT
      ================================================================ */}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ============================================================
              LEFT — BRAND / VALUE PROPOSITION
          ============================================================ */}

          <section className="hidden lg:block">
            <div className="max-w-lg">
              {/* Logo */}
              <Link
                href="/"
                className="group inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)] shadow-lg shadow-black/10 transition-transform group-hover:-translate-y-0.5">
                  TF
                </div>

                <div>
                  <span className="text-base font-bold tracking-tight">
                    TaskFlow
                  </span>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Personal productivity
                  </p>
                </div>
              </Link>

              {/* Heading */}
              <div className="mt-12">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Welcome back
                </div>

                <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-5xl">
                  Get back to
                  <span className="block text-[var(--muted-foreground)]">
                    doing your best work.
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-base leading-7 text-[var(--muted-foreground)]">
                  Organize your tasks, keep projects moving, and focus on
                  what matters without the unnecessary complexity.
                </p>
              </div>

              {/* Feature list */}
              <div className="mt-9 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Check className="h-4 w-4" />
                  </div>

                  <span className="text-sm text-[var(--muted-foreground)]">
                    Keep every task organized in one place
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Zap className="h-4 w-4" />
                  </div>

                  <span className="text-sm text-[var(--muted-foreground)]">
                    Move from ideas to action faster
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <span className="text-sm text-[var(--muted-foreground)]">
                    Simple, focused, and built for your workflow
                  </span>
                </div>
              </div>

              {/* Small bottom decoration */}
              <div className="mt-12 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <div className="h-px w-10 bg-[var(--border)]" />
                <span>Less clutter. More momentum.</span>
              </div>
            </div>
          </section>

          {/* ============================================================
              RIGHT — LOGIN CARD
          ============================================================ */}

          <section className="w-full">
            {/* Mobile brand */}
            <div className="mb-8 text-center lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)] shadow-md">
                  TF
                </div>

                <span className="text-lg font-bold tracking-tight">
                  TaskFlow
                </span>
              </Link>
            </div>

            <div className="mx-auto w-full max-w-md">
              {/* Card */}
              <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/[0.04] dark:shadow-black/20">
                {/* Top accent */}
                <div className="h-1 w-full bg-[var(--primary)]" />

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <h2 className="text-2xl font-bold tracking-[-0.025em]">
                      Welcome back
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      Sign in to continue to your TaskFlow workspace.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                      <div>
                        <p className="font-medium">
                          Unable to sign in
                        </p>

                        <p className="mt-0.5 text-xs opacity-90">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
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
                        className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] hover:border-[var(--foreground)]/20 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium"
                        >
                          Password
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 pr-11 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] hover:border-[var(--foreground)]/20 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/20 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Signing you in...
                        </>
                      ) : (
                        <>
                          Continue to TaskFlow
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--border)]" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      TaskFlow
                    </span>
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  {/* Register */}
                  <p className="text-center text-sm text-[var(--muted-foreground)]">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-[var(--foreground)] underline-offset-4 transition-colors hover:text-[var(--primary)] hover:underline"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom reassurance */}
              <p className="mt-5 text-center text-[11px] leading-5 text-[var(--muted-foreground)]">
                Your workspace is private and accessible only to you.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}