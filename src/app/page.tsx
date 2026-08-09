import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Circle,
  Clock3,
  Columns3,
  Command,
  FolderKanban,
  Layers3,
  ListTodo,
  MousePointer2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Tasks that stay organized",
    description:
      "Priorities, due dates, descriptions, and status — everything you need without the clutter.",
    color: "sky",
  },
  {
    icon: FolderKanban,
    title: "Projects with real progress",
    description:
      "Group your work into projects and instantly see what is moving forward.",
    color: "violet",
  },
  {
    icon: Columns3,
    title: "A board that feels natural",
    description:
      "Move work from To Do to Done with a fast, intuitive Kanban workflow.",
    color: "amber",
  },
  {
    icon: BarChart3,
    title: "Analytics that matter",
    description:
      "See completion rates, trends, priorities, and progress without information overload.",
    color: "emerald",
  },
  {
    icon: Command,
    title: "Find anything instantly",
    description:
      "Search your tasks and projects quickly instead of digging through menus.",
    color: "rose",
  },
  {
    icon: Zap,
    title: "Built for focused work",
    description:
      "Fast interactions, clean layouts, dark mode, and zero unnecessary distractions.",
    color: "cyan",
  },
];

const tasks = [
  {
    title: "Ship authentication flow",
    project: "TaskFlow",
    priority: "High",
    priorityClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    title: "Design project overview",
    project: "Website",
    priority: "Medium",
    priorityClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Review analytics layout",
    project: "Dashboard",
    priority: "Low",
    priorityClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================================ */}
      {/* BACKGROUND */}
      {/* ============================================================ */}

      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--accent)]/[0.08] blur-[120px]" />

        <div className="absolute left-[-200px] top-[650px] h-[400px] w-[400px] rounded-full bg-sky-500/[0.035] blur-[100px]" />

        <div className="absolute right-[-200px] top-[1000px] h-[500px] w-[500px] rounded-full bg-violet-500/[0.035] blur-[120px]" />
      </div>

      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)] shadow-sm transition-transform duration-200 group-hover:scale-105">
              TF
            </div>

            <span className="text-[17px] font-bold tracking-[-0.02em]">
              TaskFlow
            </span>
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}

      <main>
        <section className="relative">
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent)",
            }}
          />

          <div className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
            {/* Badge */}

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/80 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                Simple productivity, seriously powerful
                <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              </div>
            </div>

            {/* Heading */}

            <div className="mx-auto mt-8 max-w-4xl text-center">
              <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Turn your work
                <br />
                <span className="text-[var(--muted-foreground)]">
                  into momentum.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
                TaskFlow brings tasks, projects, priorities, and progress
                together in one beautifully focused workspace — so you always
                know what to do next.
              </p>
            </div>

            {/* Hero buttons */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl sm:w-auto"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:shadow-md sm:w-auto"
              >
                Explore TaskFlow
                <MousePointer2 className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
              Free to use · No credit card required · Built for focused work
            </p>

            {/* ======================================================== */}
            {/* PRODUCT PREVIEW */}
            {/* ======================================================== */}

            <div className="relative mx-auto mt-20 max-w-6xl sm:mt-24">
              {/* glow behind dashboard */}

              <div className="absolute -inset-8 -z-10 rounded-[40px] bg-[var(--accent)]/[0.07] blur-3xl" />

              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/[0.10] ring-1 ring-black/[0.02]">
                {/* browser top bar */}

                <div className="flex h-11 items-center justify-between border-b border-[var(--border)] bg-[var(--muted)]/30 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <div className="hidden items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-20 py-1 text-[10px] text-[var(--muted-foreground)] sm:flex">
                    taskflow.app/dashboard
                  </div>

                  <div className="w-12" />
                </div>

                {/* fake application */}

                <div className="grid min-h-[430px] grid-cols-1 lg:grid-cols-[190px_1fr]">
                  {/* sidebar */}

                  <aside className="hidden border-r border-[var(--border)] bg-[var(--muted)]/20 p-4 lg:block">
                    <div className="mb-7 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-[9px] font-bold text-[var(--primary-foreground)]">
                        TF
                      </div>
                      <span className="text-xs font-bold">
                        TaskFlow
                      </span>
                    </div>

                    <div className="space-y-1">
                      {[
                        {
                          icon: ListTodo,
                          label: "My Tasks",
                          active: true,
                        },
                        {
                          icon: FolderKanban,
                          label: "Projects",
                        },
                        {
                          icon: Columns3,
                          label: "Board",
                        },
                        {
                          icon: BarChart3,
                          label: "Analytics",
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.label}
                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium ${
                              item.active
                                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                                : "text-[var(--muted-foreground)]"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {item.label}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8">
                      <p className="px-2.5 text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                        Projects
                      </p>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-[var(--muted-foreground)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          Website
                        </div>

                        <div className="flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-[var(--muted-foreground)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                          Personal
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* dashboard */}

                  <div className="min-w-0 bg-[var(--background)] p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                          Tuesday, August 12
                        </p>

                        <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                          Good morning, Sandumal 👋
                        </h3>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          Here&apos;s what needs your attention today.
                        </p>
                      </div>

                      <div className="hidden h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-[10px] font-medium sm:flex">
                        <Sparkles className="h-3 w-3" />
                        Focus mode
                      </div>
                    </div>

                    {/* stats */}

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-[var(--muted-foreground)]">
                            Total
                          </span>
                          <ListTodo className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        </div>
                        <p className="mt-2 text-xl font-bold">24</p>
                      </div>

                      <div className="rounded-xl border-2 border-sky-500/40 bg-[var(--card)] p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-[var(--muted-foreground)]">
                            To do
                          </span>
                          <Circle className="h-3.5 w-3.5 text-sky-500" />
                        </div>
                        <p className="mt-2 text-xl font-bold">12</p>
                      </div>

                      <div className="rounded-xl border-2 border-amber-500/40 bg-[var(--card)] p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-[var(--muted-foreground)]">
                            In progress
                          </span>
                          <Clock3 className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                        <p className="mt-2 text-xl font-bold">4</p>
                      </div>

                      <div className="rounded-xl border-2 border-emerald-500/40 bg-[var(--card)] p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-[var(--muted-foreground)]">
                            Completed
                          </span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <p className="mt-2 text-xl font-bold">68%</p>
                        <div className="mt-2 h-1 rounded-full bg-[var(--muted)]">
                          <div className="h-full w-[68%] rounded-full bg-emerald-500" />
                        </div>
                      </div>
                    </div>

                    {/* lower dashboard */}

                    <div className="mt-4 grid gap-3 md:grid-cols-[1.5fr_1fr]">
                      {/* tasks */}

                      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
                        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                          <div>
                            <p className="text-[11px] font-semibold">
                              Active tasks
                            </p>
                            <p className="mt-0.5 text-[9px] text-[var(--muted-foreground)]">
                              Your work at a glance
                            </p>
                          </div>

                          <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-[8px] font-semibold">
                            12 tasks
                          </span>
                        </div>

                        <div className="divide-y divide-[var(--border)]">
                          {tasks.map((task) => (
                            <div
                              key={task.title}
                              className="flex items-center gap-3 px-4 py-3"
                            >
                              <div className="h-4 w-4 shrink-0 rounded-md border border-[var(--border)]" />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[10px] font-semibold">
                                  {task.title}
                                </p>

                                <p className="mt-0.5 text-[8px] text-[var(--muted-foreground)]">
                                  {task.project}
                                </p>
                              </div>

                              <span
                                className={`rounded-md px-2 py-1 text-[8px] font-semibold ${task.priorityClass}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* productivity */}

                      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold">
                              Productivity
                            </p>
                            <p className="mt-0.5 text-[9px] text-[var(--muted-foreground)]">
                              Current completion
                            </p>
                          </div>

                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                          <span className="text-3xl font-bold tracking-tight">
                            68
                          </span>
                          <span className="mb-1 text-xs text-[var(--muted-foreground)]">
                            %
                          </span>
                        </div>

                        <div className="mt-4 h-2 rounded-full bg-[var(--muted)]">
                          <div className="h-full w-[68%] rounded-full bg-emerald-500" />
                        </div>

                        <div className="mt-3 flex justify-between text-[8px] text-[var(--muted-foreground)]">
                          <span>16 completed</span>
                          <span>8 remaining</span>
                        </div>

                        <div className="mt-6 rounded-lg bg-[var(--muted)]/50 p-3">
                          <div className="flex items-center gap-2">
                            <Target className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-semibold">
                              Suggested next
                            </span>
                          </div>

                          <p className="mt-2 text-[9px] leading-4">
                            Ship authentication flow
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating card */}

              <div className="absolute -bottom-6 -left-4 hidden w-52 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl sm:block lg:-left-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold">
                      Task completed
                    </p>
                    <p className="text-[8px] text-[var(--muted-foreground)]">
                      Nice work. Keep going.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -top-5 hidden w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl sm:block lg:-right-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
                      <BarChart3 className="h-3.5 w-3.5 text-sky-500" />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold">
                        Weekly progress
                      </p>
                      <p className="text-[8px] text-[var(--muted-foreground)]">
                        +18% this week
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* TRUST / VALUE STRIP */}
        {/* ========================================================== */}

        <section className="border-y border-[var(--border)] bg-[var(--card)]/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[var(--border)] sm:grid-cols-4">
            {[
              ["1 workspace", "Everything together"],
              ["4 workflows", "Tasks to completion"],
              ["100% focused", "No unnecessary clutter"],
              ["24/7", "Your productivity hub"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="px-4 py-7 text-center sm:px-6"
              >
                <p className="text-sm font-bold tracking-tight sm:text-base">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-[var(--muted-foreground)] sm:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* FEATURES */}
        {/* ========================================================== */}

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  <Layers3 className="h-3 w-3" />
                  Everything in one place
                </div>

                <h2 className="max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Less managing.
                  <br />
                  <span className="text-[var(--muted-foreground)]">
                    More doing.
                  </span>
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)] lg:justify-self-end lg:text-base">
                TaskFlow is deliberately focused. You get the tools needed to
                organize your work, understand your progress, and keep moving —
                without turning productivity into another project.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                const colorClasses = {
                  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                  violet:
                    "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                  amber:
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  emerald:
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
                };

                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[var(--muted)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-70" />

                    <div
                      className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="relative mt-5 text-sm font-bold">
                      {feature.title}
                    </h3>

                    <p className="relative mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {feature.description}
                    </p>

                    <div className="relative mt-6 flex items-center gap-1 text-[10px] font-semibold text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]">
                      Explore feature
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* HOW IT WORKS */}
        {/* ========================================================== */}

        <section className="border-y border-[var(--border)] bg-[var(--card)]/30 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                A simpler workflow
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                From scattered ideas to
                <br />
                <span className="text-[var(--muted-foreground)]">
                  finished work.
                </span>
              </h2>
            </div>

            <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
              {/* connector */}

              <div className="absolute left-[17%] right-[17%] top-8 hidden border-t border-dashed border-[var(--border)] md:block" />

              {[
                {
                  number: "01",
                  icon: ListTodo,
                  title: "Capture",
                  text: "Add tasks the moment they come to mind. Give them a priority, deadline, or project.",
                },
                {
                  number: "02",
                  icon: Target,
                  title: "Focus",
                  text: "See what matters now. TaskFlow surfaces the work that deserves your attention.",
                },
                {
                  number: "03",
                  icon: CheckCircle2,
                  title: "Complete",
                  text: "Move work forward, watch your progress grow, and finish the things that matter.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative text-center"
                  >
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                      <Icon className="h-6 w-6" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-bold text-[var(--primary-foreground)]">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-base font-bold">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* CTA */}
        {/* ========================================================== */}

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20">
              {/* background decoration */}

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/[0.07] blur-[100px]" />

              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg">
                  <Sparkles className="h-5 w-5" />
                </div>

                <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Your next productive day
                  <br />
                  starts here.
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  Stop juggling scattered notes, unfinished tasks, and
                  forgotten priorities. Put everything into one focused
                  workspace.
                </p>

                <div className="mt-8">
                  <Link
                    href="/register"
                    className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl"
                  >
                    Create your workspace
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <p className="mt-4 text-[10px] text-[var(--muted-foreground)]">
                  Free to start · Simple by design
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-[9px] font-bold text-[var(--primary-foreground)]">
              TF
            </div>

            <span className="text-sm font-bold">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-5 text-xs text-[var(--muted-foreground)]">
            <Link
              href="/login"
              className="transition-colors hover:text-[var(--foreground)]"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="transition-colors hover:text-[var(--foreground)]"
            >
              Get started
            </Link>

            <span>Built for focused work.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}