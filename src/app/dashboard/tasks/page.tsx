import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { toggleTask } from "@/app/actions/tasks";
import { format } from "date-fns";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { DeleteTaskButton } from "@/components/tasks/DeleteTaskButton";

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
    include: {
      project: { select: { id: true, name: true } },
    },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
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
    completed: allTasks.filter((t) => t.status === "DONE" || t.completed)
      .length,
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
        <div className="mb-6 flex flex-wrap gap-2">
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
          <CreateTaskForm projects={projects} />
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
                  <form
                    action={toggleTask.bind(null, task.id)}
                    className="mt-0.5"
                  >
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

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      {task.project && <span>{task.project.name}</span>}
                      {task.dueDate && (
                        <span>
                          Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <EditTaskModal task={task} projects={projects} />
                    <DeleteTaskButton taskId={task.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}