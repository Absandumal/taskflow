import Link from "next/link";
import {
  CheckSquare,
  Columns3,
  BarChart3,
  Search,
  FolderKanban,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Tasks that stay organized",
    description:
      "Priorities, due dates, status, and descriptions — everything in one clean list.",
  },
  {
    icon: FolderKanban,
    title: "Projects with real progress",
    description:
      "Group work into projects and see completion at a glance.",
  },
  {
    icon: Columns3,
    title: "Kanban board",
    description:
      "Drag tasks across To Do, In Progress, In Review, and Done.",
  },
  {
    icon: BarChart3,
    title: "Clear analytics",
    description:
      "Completion rate, trends, and priority breakdown without the noise.",
  },
  {
    icon: Search,
    title: "Command palette",
    description:
      "Press / to search tasks and projects instantly.",
  },
  {
    icon: Zap,
    title: "Fast and focused",
    description:
      "Built for daily use — light, dark, and distraction-free.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
              TF
            </div>
            <span className="text-lg font-semibold tracking-tight">
              TaskFlow
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Personal productivity, refined
          </div>

          <h1 className="animate-fade-up delay-100 mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Your work.
            <br />
            <span className="text-[var(--muted-foreground)]">
              Clearly organized.
            </span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
            TaskFlow helps you plan projects, track tasks, and stay focused —
            with a calm interface built for real daily use.
          </p>

          <div className="animate-fade-up delay-300 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
            >
              Log in
            </Link>
          </div>

          {/* Product preview card */}
          <div className="animate-fade-up delay-400 animate-float mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/5">
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs text-[var(--muted-foreground)]">
                  TaskFlow Dashboard
                </span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Active tasks
                  </p>
                  <p className="mt-2 text-2xl font-semibold">12</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    In progress
                  </p>
                  <p className="mt-2 text-2xl font-semibold">4</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Completion
                  </p>
                  <p className="mt-2 text-2xl font-semibold">68%</p>
                </div>
                <div className="sm:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left">
                  <div className="space-y-3">
                    {[
                      { title: "Ship authentication flow", tag: "High" },
                      { title: "Design project overview", tag: "Medium" },
                      { title: "Review analytics layout", tag: "Low" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded border border-[var(--border)]" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <span className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] bg-[var(--card)]/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to stay on track
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              A focused toolkit — not another cluttered dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`animate-fade-up rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md delay-${(i % 5) + 1}00`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[var(--accent)]/5" />
            <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to organize your work?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-[var(--muted-foreground)]">
              Create an account and start managing tasks and projects in
              minutes.
            </p>
            <div className="relative mt-8">
              <Link
                href="/register"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-[var(--muted-foreground)] sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-foreground)]">
              TF
            </div>
            <span>TaskFlow</span>
          </div>
          <p>Built for focused work.</p>
        </div>
      </footer>
    </div>
  );
}