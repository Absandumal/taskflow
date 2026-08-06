import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { format } from "date-fns";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const filter = params.filter || "all";

  const allTasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const tasks =
    filter === "active"
      ? allTasks.filter((t) => t.status !== "DONE" && !t.completed)
      : filter === "completed"
        ? allTasks.filter((t) => t.status === "DONE" || t.completed)
        : allTasks;

  const counts = {
    all: allTasks.length,
    active: allTasks.filter((t) => t.status !== "DONE" && !t.completed).length,
    completed: allTasks.filter((t) => t.status === "DONE" || t.completed).length,
  };

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Manage and track all your tasks in one place.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "active", label: "Active", count: counts.active },
            { key: "completed", label: "Completed", count: counts.completed },
          ].map((item) => (
            <a
              key={item.key}
              href={`/dashboard/tasks?filter=${item.key}`}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === item.key
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
              <span className="ml-1.5 opacity-70">{item.count}</span>
            </a>
          ))}
        </div>

        {/* Quick Add */}
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <form action={createTask} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              name="title"
              placeholder="Add a new task..."
              required
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <select
              name="priority"
              defaultValue="MEDIUM"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <input
              type="date"
              name="dueDate"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          {tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[var(--muted-foreground)]">
                {filter === "completed"
                  ? "No completed tasks yet."
                  : filter === "active"
                    ? "No active tasks. You're all caught up."
                    : "No tasks yet. Create your first task above."}
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
                        task.completed || task.status === "DONE"
                          ? "border-[var(--success)] bg-[var(--success)] text-white"
                          : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                      }`}
                    >
                      {(task.completed || task.status === "DONE") && (
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </form>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          task.completed || task.status === "DONE"
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
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
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