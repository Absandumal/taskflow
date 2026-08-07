import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask } from "@/app/actions/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { format } from "date-fns";
import Link from "next/link";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { DeleteTaskButton } from "@/components/tasks/DeleteTaskButton";
import { suggestNextTask } from "@/lib/suggest-next-task";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: {
      project: { select: { id: true, name: true } },
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

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-6xl px-1 pb-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted-foreground)]">
                {today}
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Good morning, {firstName}{" "}
                <span className="inline-block">👋</span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Here&apos;s an overview of your tasks and what needs your
                attention today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/board"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
              >
                Open Board
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Total tasks
                </p>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  All
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {total}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Tasks in your workspace
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">To do</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {todo}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Waiting to be started
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="text-sm text-[var(--muted-foreground)]">
                In progress
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {inProgress}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Currently being worked on
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Completed
                </p>
                <span className="text-xs font-medium">{completionRate}%</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {completed}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Suggested next */}
        {suggestion && (
          <section className="mb-8 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Suggested next
              </p>
              <h2 className="mt-1 text-sm font-semibold">Work on this next</h2>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-base font-medium">
                  {suggestion.task.title}
                </p>

                {suggestion.task.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                    {suggestion.task.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={suggestion.task.status} />
                  <PriorityBadge priority={suggestion.task.priority} />
                  {suggestion.task.dueDate && (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      Due{" "}
                      {format(new Date(suggestion.task.dueDate), "MMM d")}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestion.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              <form action={toggleTask.bind(null, suggestion.task.id)}>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                >
                  Mark done
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left Column */}
          <div className="min-w-0 space-y-6 lg:col-span-3">
            {/* Quick Add */}
            <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold">Create a task</h2>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Add something you want to get done.
                    </p>
                  </div>
                  <span className="hidden rounded-md bg-[var(--muted)] px-2 py-1 text-[11px] font-medium text-[var(--muted-foreground)] sm:inline-flex">
                    Quick add
                  </span>
                </div>
              </div>

              <form action={createTask} className="space-y-3 p-5">
                <input
                  type="text"
                  name="title"
                  placeholder="What needs to be done?"
                  required
                  className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                />

                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                  >
                    <option value="LOW">Low priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="HIGH">High priority</option>
                    <option value="URGENT">Urgent priority</option>
                  </select>

                  <select
                    name="projectId"
                    className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="dueDate"
                    className="h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                  />

                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 sm:min-w-[110px]"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </section>

            {/* Active Tasks */}
            <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold">Active tasks</h2>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    The work currently on your plate.
                  </p>
                </div>

                <Link
                  href="/dashboard/tasks"
                  className="text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  View all →
                </Link>
              </div>

              {activeTasks.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                    ✓
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">
                    You&apos;re all caught up
                  </h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-[var(--muted-foreground)]">
                    Nice work. Create a new task when you&apos;re ready for the
                    next one.
                  </p>
                </div>
              ) : (
                <ul>
                  {activeTasks.slice(0, 8).map((task) => (
                    <li
                      key={task.id}
                      className="group flex items-start gap-3 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
                    >
                      <form
                        action={toggleTask.bind(null, task.id)}
                        className="mt-0.5 shrink-0"
                      >
                        <button
                          type="submit"
                          aria-label={`Complete ${task.title}`}
                          className="flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border)] transition hover:border-[var(--foreground)] hover:bg-[var(--muted)]"
                        />
                      </form>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {task.title}
                          </span>
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>

                        {task.description && (
                          <p className="mt-1 line-clamp-1 text-sm text-[var(--muted-foreground)]">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
                          {task.project && <span>{task.project.name}</span>}
                          {task.dueDate && (
                            <span>
                              Due {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                        <EditTaskModal task={task} projects={projects} />
                        <DeleteTaskButton
                          taskId={task.id}
                          taskTitle={task.title}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Right Column */}
          <aside className="min-w-0 lg:col-span-2">
            <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold">Recent activity</h2>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Your latest actions.
                  </p>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-sm">
                    •
                  </div>
                  <p className="mt-4 text-sm font-medium">No activity yet</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                    Your activity will appear here as you work.
                  </p>
                </div>
              ) : (
                <ul>
                  {activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex gap-3 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
                    >
                      <div className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5">{activity.message}</p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
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

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Productivity</h2>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Your current completion rate.
                  </p>
                </div>
                <span className="text-2xl font-semibold tracking-tight">
                  {completionRate}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>{completed} completed</span>
                <span>{total - completed} remaining</span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}