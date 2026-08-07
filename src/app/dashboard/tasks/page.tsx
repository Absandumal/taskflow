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

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const filter = params.filter || "all";

  const allTasks = await prisma.task.findMany({
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

  const tasks =
    filter === "active"
      ? allTasks.filter((t) => t.status !== "DONE" && !t.completed)
      : filter === "completed"
        ? allTasks.filter((t) => t.status === "DONE" || t.completed)
        : allTasks;

  const counts = {
    all: allTasks.length,
    active: allTasks.filter(
      (t) => t.status !== "DONE" && !t.completed
    ).length,
    completed: allTasks.filter(
      (t) => t.status === "DONE" || t.completed
    ).length,
  };

  const isCompleted = (task: (typeof allTasks)[number]) =>
    task.completed || task.status === "DONE";

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                My Tasks
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">
                Manage, organize, and keep track of everything you need to get
                done.
              </p>
            </div>

            {/* Task summary */}
            <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm sm:block">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Active
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-[var(--foreground)]">
                    {counts.active}
                  </p>
                </div>

                <div className="h-8 w-px bg-[var(--border)]" />

                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Completed
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {counts.completed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            {
              key: "all",
              label: "All Tasks",
              count: counts.all,
            },
            {
              key: "active",
              label: "Active",
              count: counts.active,
            },
            {
              key: "completed",
              label: "Completed",
              count: counts.completed,
            },
          ].map((item) => {
            const active = filter === item.key;

            return (
              <a
                key={item.key}
                href={`/dashboard/tasks?filter=${item.key}`}
                className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? item.key === "completed"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-sm dark:text-emerald-400"
                      : "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm"
                    : "border-transparent bg-[var(--muted)] text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.key === "completed" && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}

                {item.label}

                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    active
                      ? "bg-black/5 dark:bg-white/10"
                      : "bg-[var(--background)]"
                  }`}
                >
                  {item.count}
                </span>
              </a>
            );
          })}
        </div>

        {/* Quick Add */}
        <div className="mb-7 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/40 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Add a new task
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Capture something you need to get done.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <CreateTaskForm projects={projects} />
          </div>
        </div>

        {/* Task List */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          {/* List header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--muted)]/30 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-[var(--foreground)]">
                {filter === "completed"
                  ? "Completed Tasks"
                  : filter === "active"
                    ? "Active Tasks"
                    : "All Tasks"}
              </h2>

              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            {counts.completed > 0 && (
              <div className="hidden items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {counts.completed} completed
              </div>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)]">
                {filter === "completed" ? (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0"
                    />
                  </svg>
                )}
              </div>

              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {filter === "completed"
                  ? "No completed tasks"
                  : filter === "active"
                    ? "You're all caught up"
                    : "No tasks yet"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-[var(--muted-foreground)]">
                {filter === "completed"
                  ? "Completed tasks will appear here once you finish something."
                  : filter === "active"
                    ? "You've completed everything on your list. Nice work!"
                    : "Create your first task above and start organizing your work."}
              </p>
            </div>
          ) : (
            <ul>
              {tasks.map((task) => {
                const completed = isCompleted(task);

                return (
                  <li
                    key={task.id}
                    className={`group relative border-b border-[var(--border)] px-5 py-5 transition-all duration-200 last:border-b-0 sm:px-6 ${
                      completed
                        ? "bg-emerald-500/[0.035] hover:bg-emerald-500/[0.06]"
                        : "hover:bg-[var(--muted)]/30"
                    }`}
                  >
                    {/* Completed indicator */}
                    {completed && (
                      <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-emerald-500/70" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <form
                        action={toggleTask.bind(null, task.id)}
                        className="mt-0.5 shrink-0"
                      >
                        <button
                          type="submit"
                          aria-label={
                            completed
                              ? `Mark ${task.title} as active`
                              : `Complete ${task.title}`
                          }
                          className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                            completed
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:border-emerald-600 hover:bg-emerald-600"
                              : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                          }`}
                        >
                          {completed && (
                            <svg
                              className="h-3.5 w-3.5"
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
                            className={`text-[15px] font-semibold leading-6 transition-colors ${
                              completed
                                ? "text-emerald-700/70 line-through dark:text-emerald-400/70"
                                : "text-[var(--foreground)]"
                            }`}
                          >
                            {task.title}
                          </span>

                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>

                        {task.description && (
                          <p
                            className={`mt-1.5 line-clamp-2 max-w-3xl text-sm leading-6 ${
                              completed
                                ? "text-[var(--muted-foreground)]/70"
                                : "text-[var(--muted-foreground)]"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted-foreground)]">
                          {task.project && (
                            <span className="inline-flex items-center gap-1.5">
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                                />
                              </svg>
                              {task.project.name}
                            </span>
                          )}

                          {task.dueDate && (
                            <span
                              className={`inline-flex items-center gap-1.5 ${
                                !completed &&
                                new Date(task.dueDate) < new Date()
                                  ? "font-medium text-red-500"
                                  : ""
                              }`}
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                                />
                              </svg>
                              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </span>
                          )}

                          {completed && (
                            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                        <EditTaskModal
                          task={task}
                          projects={projects}
                        />

                        <DeleteTaskButton
                          taskId={task.id}
                          taskTitle={task.title}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </AppShell>
  );
}