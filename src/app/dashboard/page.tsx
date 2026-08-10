
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask } from "@/app/actions/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { DeleteTaskButton } from "@/components/tasks/DeleteTaskButton";
import { suggestNextTask } from "@/lib/suggest-next-task";
import { format } from "date-fns";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FolderKanban,
  ListTodo,
  LogOut,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  const activities = await prisma.activity.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const suggestion = suggestNextTask(tasks);

  const firstName = session.user.name?.split(" ")[0] || "there";
  const today = format(new Date(), "EEEE, MMMM d");

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed || task.status === "DONE"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const todo = tasks.filter((task) => task.status === "TODO").length;

  const activeTasks = tasks.filter(
    (task) => task.status !== "DONE" && !task.completed
  );

  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const remaining = total - completed;

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {today}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-[2.7rem]">
                Welcome, {firstName}
                <span className="ml-2 inline-block">👋</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Here&apos;s your command center for today. Stay focused,
                keep momentum, and get things done.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/board"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:shadow-md"
              >
                <ListTodo className="h-4 w-4" />
                Open Board
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm font-medium text-[var(--muted-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--muted)] hover:text-[var(--foreground)] hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* STATS */}
        {/* ================================================================ */}

        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* Total */}
            <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--muted)] opacity-60 blur-2xl transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)]">
                    <ListTodo className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>

                  <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    All
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {total}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Total tasks
                </p>
              </div>
            </div>

            {/* To Do — SKY */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-sky-500/60 bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-sky-400/50">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl transition-opacity group-hover:opacity-100 dark:bg-sky-400/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-400/10">
                    <Circle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  </div>

                  <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    To do
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {todo}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Waiting to start
                </p>
              </div>
            </div>

            {/* In Progress — AMBER */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-amber-400/50">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-opacity group-hover:opacity-100 dark:bg-amber-400/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10">
                    <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>

                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                    Active
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {inProgress}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Currently being worked on
                </p>
              </div>
            </div>

            {/* Completed — EMERALD */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/60 bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-400/50">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-100 dark:bg-emerald-400/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {completionRate}%
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {completed}
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-500/10 dark:bg-emerald-400/10">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500 dark:bg-emerald-400"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SUGGESTED NEXT */}
        {/* ================================================================ */}

        {suggestion && (
          <section className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/[0.04] via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4 sm:px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                  <Zap className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    Suggested next
                  </p>

                  <h2 className="mt-0.5 text-sm font-semibold">
                    Keep your momentum going
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <Target className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                        {suggestion.task.title}
                      </h3>

                      {suggestion.task.description && (
                        <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                          {suggestion.task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 pl-0 sm:pl-11">
                    <StatusBadge status={suggestion.task.status} />
                    <PriorityBadge priority={suggestion.task.priority} />

                    {suggestion.task.dueDate && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due{" "}
                        {format(
                          new Date(suggestion.task.dueDate),
                          "MMM d"
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 pl-0 sm:pl-11">
                    {suggestion.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-md bg-[var(--muted)] px-2 py-1 text-[11px] font-medium text-[var(--muted-foreground)]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                <form action={toggleTask.bind(null, suggestion.task.id)}>
                  <button
                    type="submit"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-400 sm:w-auto"
                  >
                    <Check className="h-4 w-4" />
                    Mark done
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* MAIN GRID */}
        {/* ================================================================ */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* LEFT COLUMN */}

          <div className="min-w-0 space-y-6 lg:col-span-3">
            {/* Quick Add */}
            <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)]">
                      <Plus className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Create a task
                      </h2>

                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        Add something you want to get done.
                      </p>
                    </div>
                  </div>

                  <span className="hidden rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)] sm:inline-flex">
                    Quick add
                  </span>
                </div>
              </div>

              <form action={createTask} className="space-y-3 p-5 sm:p-6">
                <input
                  type="text"
                  name="title"
                  placeholder="What needs to be done?"
                  required
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                />

                <textarea
                  name="description"
                  placeholder="Add a description..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                  >
                    <option value="LOW">Low priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="HIGH">High priority</option>
                    <option value="URGENT">Urgent priority</option>
                  </select>

                  <select
                    name="projectId"
                    defaultValue=""
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                  >
                    <option value="">No project</option>

                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />

                    <input
                      type="date"
                      name="dueDate"
                      className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm outline-none transition-all focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </div>
              </form>
            </section>

            {/* Active Tasks */}
            <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Active tasks</h2>

                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted-foreground)]">
                      {activeTasks.length}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    The work currently on your plate.
                  </p>
                </div>

                <Link
                  href="/dashboard/tasks"
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {activeTasks.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    You&apos;re all caught up
                  </h3>

                  <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                    Nice work. Create a new task when you&apos;re ready for
                    the next one.
                  </p>
                </div>
              ) : (
                <ul>
                  {activeTasks.slice(0, 8).map((task) => {
                    const isTodo = task.status === "TODO";
                    const isInProgress = task.status === "IN_PROGRESS";

                    return (
                      <li
                        key={task.id}
                        className={`group flex items-start gap-3 border-b px-5 py-4 transition-colors last:border-b-0 sm:px-6 ${
                          isTodo
                            ? "border-sky-500/20 hover:bg-sky-500/[0.03] dark:border-sky-400/20 dark:hover:bg-sky-400/[0.03]"
                            : isInProgress
                              ? "border-amber-500/20 hover:bg-amber-500/[0.03] dark:border-amber-400/20 dark:hover:bg-amber-400/[0.03]"
                              : "border-[var(--border)] hover:bg-[var(--muted)]/30"
                        }`}
                      >
                        <form
                          action={toggleTask.bind(null, task.id)}
                          className="mt-0.5 shrink-0"
                        >
                          <button
                            type="submit"
                            aria-label={`Complete ${task.title}`}
                            className={`flex h-5 w-5 items-center justify-center rounded-md border bg-[var(--background)] transition-all ${
                              isTodo
                                ? "border-sky-500/60 hover:border-sky-600 hover:bg-sky-500/10 dark:border-sky-400/50 dark:hover:border-sky-300"
                                : isInProgress
                                  ? "border-amber-500/60 hover:border-amber-600 hover:bg-amber-500/10 dark:border-amber-400/50 dark:hover:border-amber-300"
                                  : "border-[var(--border)] hover:border-[var(--foreground)] hover:bg-[var(--muted)]"
                            }`}
                          >
                            <Check className="h-3 w-3 opacity-0" />
                          </button>
                        </form>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="min-w-0 truncate text-sm font-semibold">
                              {task.title}
                            </span>

                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                          </div>

                          {task.description && (
                            <p className="mt-1 line-clamp-1 text-xs leading-5 text-[var(--muted-foreground)]">
                              {task.description}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted-foreground)]">
                            {task.project && (
                              <span className="inline-flex items-center gap-1">
                                <FolderKanban className="h-3 w-3" />
                                {task.project.name}
                              </span>
                            )}

                            {task.dueDate && (
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                Due{" "}
                                {format(
                                  new Date(task.dueDate),
                                  "MMM d"
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                          <EditTaskModal
                            task={task}
                            projects={projects}
                          />

                          <DeleteTaskButton
                            taskId={task.id}
                            taskTitle={task.title}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {activeTasks.length > 8 && (
                <div className="border-t border-[var(--border)] bg-[var(--muted)]/30 px-5 py-3 text-center">
                  <Link
                    href="/dashboard/tasks"
                    className="text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    View {activeTasks.length - 8} more tasks
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN */}

          <aside className="min-w-0 lg:col-span-2">
            <div className="space-y-6">
              {/* Recent Activity */}
              <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)]">
                      <TrendingUp className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Recent activity
                      </h2>

                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        Your latest actions.
                      </p>
                    </div>
                  </div>
                </div>

                {activities.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--muted)]">
                      <BarChart3 className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      No activity yet
                    </p>

                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[var(--muted-foreground)]">
                      Your activity will appear here as you work.
                    </p>
                  </div>
                ) : (
                  <ul>
                    {activities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex gap-3 border-b border-[var(--border)] px-5 py-4 last:border-b-0 sm:px-6"
                      >
                        <div className="relative flex shrink-0 flex-col items-center">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-5">
                            {activity.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-[var(--muted-foreground)]">
                            {format(
                              new Date(activity.createdAt),
                              "MMM d · h:mm a"
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Productivity */}
              <section className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-[var(--card)] p-5 shadow-sm dark:border-emerald-400/30 sm:p-6">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-400/[0.06]" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
                          <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <h2 className="text-sm font-semibold">
                          Productivity
                        </h2>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                        Your current completion rate.
                      </p>
                    </div>

                    <span className="text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                      {completionRate}%
                    </span>
                  </div>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-emerald-500/10 dark:bg-emerald-400/10">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700 dark:bg-emerald-400"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                    <span>{completed} completed</span>
                    <span>{remaining} remaining</span>
                  </div>
                </div>
              </section>

              {/* Workspace Snapshot */}
              <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                <div className="border-b border-[var(--border)] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)]">
                      <FolderKanban className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Workspace snapshot
                      </h2>

                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        A quick look at your workspace.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      Projects
                    </span>

                    <span className="text-sm font-semibold">
                      {projects.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      Active tasks
                    </span>

                    <span className="text-sm font-semibold">
                      {activeTasks.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      Completed
                    </span>

                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {completed}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/analytics"
                  className="group flex items-center justify-between border-t border-[var(--border)] px-5 py-3.5 text-xs font-semibold transition-colors hover:bg-[var(--muted)]"
                >
                  <span>View detailed analytics</span>

                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}