import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { NameForm } from "@/components/settings/NameForm";
import { ThemePreference } from "@/components/settings/ThemePreference";
import { format } from "date-fns";
import {
  UserRound,
  Mail,
  CalendarDays,
  Pencil,
  Palette,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = user.name || user.email || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <AppShell userName={user.name || user.email}>
      <div className="mx-auto w-full max-w-5xl">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                  <Settings2 className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Preferences
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Manage your account, personalize your workspace, and
                configure your TaskFlow experience.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] shadow-sm sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account settings
            </div>
          </div>
        </header>

        {/* ========================================================= */}
        {/* SETTINGS CONTENT */}
        {/* ========================================================= */}

        <div className="space-y-6">
          {/* ======================================================= */}
          {/* ACCOUNT */}
          {/* ======================================================= */}

          <section className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:shadow-md">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/[0.08] blur-3xl transition-opacity group-hover:opacity-100 dark:bg-sky-400/[0.07]" />

            <div className="relative">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-400/10">
                    <UserRound className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      Account information
                    </h2>

                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      Your basic TaskFlow account details.
                    </p>
                  </div>
                </div>

                <span className="hidden rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-600 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-400 sm:inline-flex">
                  Account
                </span>
              </div>

              <div className="p-5 sm:p-6">
                {/* Profile identity */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white shadow-sm shadow-sky-500/20 dark:bg-sky-400 dark:text-slate-950">
                        {initials}
                      </div>

                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--card)] bg-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-semibold">
                          {user.name || "No name set"}
                        </p>

                        <span className="hidden rounded-md bg-[var(--muted)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)] sm:inline">
                          Member
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active account
                  </div>
                </div>

                {/* Account metadata */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="group/info rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--muted)]/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-400/10">
                        <Mail className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      </div>

                      <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                        Email address
                      </dt>
                    </div>

                    <dd className="mt-3 truncate text-sm font-semibold">
                      {user.email}
                    </dd>
                  </div>

                  <div className="group/info rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:bg-[var(--muted)]/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-400/10">
                        <CalendarDays className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      </div>

                      <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                        Member since
                      </dt>
                    </div>

                    <dd className="mt-3 text-sm font-semibold">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "MMM d, yyyy")
                        : "—"}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================= */}
          {/* DISPLAY NAME */}
          {/* ======================================================= */}

          <section className="group overflow-hidden rounded-2xl border border-amber-500/40 bg-[var(--card)] shadow-sm transition-all duration-300 hover:border-amber-500/60 hover:shadow-md dark:border-amber-400/30 dark:hover:border-amber-400/50">
            <div className="flex items-center gap-3 border-b border-amber-500/20 px-5 py-5 dark:border-amber-400/15 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10">
                <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">Display name</h2>

                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  Customize how your name appears across TaskFlow.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 dark:border-amber-400/15 dark:bg-amber-400/[0.04]">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

                <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                  Your display name is used for greetings, your profile,
                  and other personalized areas throughout the app.
                </p>
              </div>

              <NameForm defaultName={user.name || ""} />
            </div>
          </section>

          {/* ======================================================= */}
          {/* APPEARANCE */}
          {/* ======================================================= */}

          <section className="group overflow-hidden rounded-2xl border border-emerald-500/40 bg-[var(--card)] shadow-sm transition-all duration-300 hover:border-emerald-500/60 hover:shadow-md dark:border-emerald-400/30 dark:hover:border-emerald-400/50">
            <div className="flex items-center justify-between border-b border-emerald-500/20 px-5 py-5 dark:border-emerald-400/15 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                  <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">Appearance</h2>

                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    Choose how TaskFlow looks on your devices.
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400 sm:inline-flex">
                Theme
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-sm font-medium">Theme preference</p>

                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                  Select light mode, dark mode, or automatically follow
                  your system preference.
                </p>
              </div>

              <ThemePreference />
            </div>
          </section>

          {/* ======================================================= */}
          {/* FOOTER NOTE */}
          {/* ======================================================= */}

          <div className="flex items-center justify-center gap-2 pb-4 pt-2 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your TaskFlow preferences are saved to your account.
          </div>
        </div>
      </div>
    </AppShell>
  );
}