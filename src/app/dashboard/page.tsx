import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const firstName = session.user.name?.split(" ")[0] || "there";

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Good morning, {firstName} 👋
            </h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Here&apos;s what&apos;s happening with your work today.
            </p>
          </div>

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

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Total Tasks</p>
            <p className="mt-1 text-2xl font-semibold">{total}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">In Progress</p>
            <p className="mt-1 text-2xl font-semibold">{inProgress}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Completed</p>
            <p className="mt-1 text-2xl font-semibold">{completed}</p>
          </div>
        </div>

        {/* Create Task */}
        <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-sm font-medium">New Task</h2>
          <form action={createTask} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />

            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
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

        {/* Task List */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-3">
            <h2 className="text-sm font-medium">Your Tasks</h2>
          </div>

          {tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[var(--muted-foreground)]">
                No tasks yet. Create your first task and start making progress.
              </p>
            </div>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-4 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
                >
                  {/* Checkbox */}
                  <form action={toggleTask.bind(null, task.id)} className="mt-0.5">
                    <button
                      type="submit"
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                        task.completed
                          ? "border-[var(--success)] bg-[var(--success)] text-white"
                          : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                      }`}
                    >
                      {task.completed && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          task.completed
                            ? "text-[var(--muted-foreground)] line-through"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {task.title}
                      </span>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>

                    {task.description && (
                      <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                        Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>

                  {/* Delete */}
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
    </AppShell>
  );
}