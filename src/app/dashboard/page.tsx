import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const firstName = session.user.name?.split(" ")[0] || "there";
  const today = format(new Date(), "EEEE, MMMM d");

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed || t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter((t) => t.status === "TODO").length;

  // Tasks that are not done
  const activeTasks = tasks.filter((t) => t.status !== "DONE" && !t.completed);

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">{today}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Here&apos;s what&apos;s happening with your work today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/board"
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
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
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Total</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{total}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">To Do</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{todo}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">In Progress</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{inProgress}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Completed</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{completed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left: Create + Active Tasks */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Task */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="mb-4 text-sm font-medium">Quick Add</h2>
              <form action={createTask} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="What needs to be done?"
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <div className="flex flex-wrap gap-3">
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                  <input
                    type="date"
                    name="dueDate"
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    className="ml-auto rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>

            {/* Active Tasks */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
                <h2 className="text-sm font-medium">Active Tasks</h2>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {activeTasks.length} remaining
                </span>
              </div>

              {activeTasks.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-[var(--muted-foreground)]">
                    You&apos;re all caught up. Nice work.
                  </p>
                </div>
              ) : (
                <ul>
                  {activeTasks.slice(0, 8).map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-4 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
                    >
                      <form action={toggleTask.bind(null, task.id)} className="mt-0.5">
                        <button
                          type="submit"
                          className="flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border)] transition-colors hover:border-[var(--muted-foreground)]"
                        />
                      </form>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                        {task.dueDate && (
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Due {format(new Date(task.dueDate), "MMM d")}
                          </p>
                        )}
                      </div>

                      <form action={deleteTask.bind(null, task.id)}>
                        <button
                          type="submit"
                          className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--destructive)]"
                        >
                          Delete
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Recently Completed */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="border-b border-[var(--border)] px-5 py-3">
                <h2 className="text-sm font-medium">Recently Completed</h2>
              </div>

              {completed === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Completed tasks will appear here.
                  </p>
                </div>
              ) : (
                <ul>
                  {tasks
                    .filter((t) => t.completed || t.status === "DONE")
                    .slice(0, 6)
                    .map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3.5 last:border-b-0"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-[var(--success)] bg-[var(--success)] text-white">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-[var(--muted-foreground)] line-through">
                          {task.title}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}