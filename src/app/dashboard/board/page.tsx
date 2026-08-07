
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { Board } from "@/components/board/Board";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Layers3,
  ListTodo,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function BoardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const total = tasks.length;

  const todo = tasks.filter(
    (task) => task.status === "TODO" && !task.completed
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS" && !task.completed
  ).length;

  const inReview = tasks.filter(
    (task) => task.status === "IN_REVIEW" && !task.completed
  ).length;

  const completed = tasks.filter(
    (task) => task.completed || task.status === "DONE"
  ).length;

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ============================================================= */}
        {/* HEADER */}
        {/* ============================================================= */}

        <header className="mb-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 text-xs font-medium text-[var(--muted-foreground)] shadow-sm transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Dashboard
                </Link>

                <span className="text-[var(--muted-foreground)]">/</span>

                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  Board
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
                  <Layers3 className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                    Board
                  </h1>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                    Organize your work visually and move tasks through your
                    workflow.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              New task
            </Link>
          </div>
        </header>

        {/* ============================================================= */}
        {/* BOARD SUMMARY */}
        {/* ============================================================= */}

        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {/* Total */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                  <ListTodo className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Total
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {total}
              </p>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                All tasks
              </p>
            </div>

            {/* Todo */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                <Circle className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {todo}
              </p>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                To do
              </p>
            </div>

            {/* In Progress */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                <Clock3 className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {inProgress}
              </p>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                In progress
              </p>
            </div>

            {/* Review */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                <Activity className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {inReview}
              </p>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                In review
              </p>
            </div>

            {/* Completed */}
            <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--muted)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>

                {total > 0 && (
                  <span className="text-xs font-semibold">
                    {Math.round((completed / total) * 100)}%
                  </span>
                )}
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {completed}
              </p>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                Completed
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* BOARD TOOLBAR */}
        {/* ============================================================= */}

        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--muted)]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-xs font-semibold">
                Your workflow
              </p>

              <p className="text-[11px] text-[var(--muted-foreground)]">
                Drag tasks between columns to update their status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
            <span className="hidden sm:inline">Showing</span>

            <span className="rounded-md bg-[var(--muted)] px-2 py-1 font-semibold text-[var(--foreground)]">
              {total} {total === 1 ? "task" : "tasks"}
            </span>
          </div>
        </section>

        {/* ============================================================= */}
        {/* BOARD */}
        {/* ============================================================= */}

        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 shadow-sm">
          <div className="min-h-[600px] p-3 sm:p-4 lg:p-5">
            <Board tasks={tasks} />
          </div>
        </section>
      </main>
    </AppShell>
  );
}