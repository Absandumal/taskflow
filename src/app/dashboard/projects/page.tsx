import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { createProject } from "@/app/actions/projects";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        select: {
          id: true,
          completed: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalProjects = projects.length;

  const totalTasks = projects.reduce(
    (sum, project) => sum + project.tasks.length,
    0
  );

  const completedTasks = projects.reduce(
    (sum, project) =>
      sum + project.tasks.filter((task) => task.completed || task.status === "DONE").length,
    0
  );

  const activeTasks = totalTasks - completedTasks;

  const overallProgress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
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
                      d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Projects
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">
                Organize related tasks, track progress, and keep every
                initiative moving forward.
              </p>
            </div>

            <Link
              href="/dashboard/tasks"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium shadow-sm transition-all hover:bg-[var(--muted)] hover:shadow-md"
            >
              View all tasks
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        {/* Overview Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Projects */}
          <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                  Total projects
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {totalProjects}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
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
                    d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
              Organized workspaces
            </p>
          </div>

          {/* Tasks */}
          <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                  Total tasks
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {totalTasks}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7h-2M9 5a3 3 0 006 0"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">
                {activeTasks}
              </span>{" "}
              still active
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.035] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700/80 dark:text-emerald-400/80">
                  Overall progress
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {overallProgress}%
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-500/10">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-emerald-700/70 dark:text-emerald-400/70">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </section>

        {/* Create Project */}
        <section className="mb-9 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-md">
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/30 px-5 py-4 sm:px-6">
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
                  Create a project
                </h2>

                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  Start a focused workspace for a goal, project, or deliverable.
                </p>
              </div>
            </div>
          </div>

          <form action={createProject} className="p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
              <div>
                <label
                  htmlFor="project-name"
                  className="mb-1.5 block text-xs font-medium text-[var(--foreground)]"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  name="name"
                  placeholder="e.g. Portfolio redesign"
                  required
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-1.5 block text-xs font-medium text-[var(--foreground)]"
                >
                  Description
                </label>

                <input
                  id="project-description"
                  type="text"
                  name="description"
                  placeholder="What are you working toward?"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </div>

              <button
                type="submit"
                className="h-11 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
              >
                Create project
              </button>
            </div>
          </form>
        </section>

        {/* Projects heading */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Your projects
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {projects.length === 0
                ? "Your projects will appear here."
                : `${projects.length} ${
                    projects.length === 1 ? "project" : "projects"
                  } in your workspace`}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)]">
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
                  d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
              No projects yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
              Create your first project above to group tasks, track progress,
              and keep your work organized.
            </p>
          </section>
        ) : (
          /* Project Grid */
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const taskCount = project.tasks.length;

              const doneCount = project.tasks.filter(
                (task) => task.completed || task.status === "DONE"
              ).length;

              const activeCount = project.tasks.filter(
                (task) => !task.completed && task.status !== "DONE"
              ).length;

              const progress =
                taskCount === 0
                  ? 0
                  : Math.round((doneCount / taskCount) * 100);

              const isComplete = taskCount > 0 && progress === 100;

              return (
                <article
                  key={project.id}
                  className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border bg-[var(--card)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    isComplete
                      ? "border-emerald-500/25"
                      : "border-[var(--border)]"
                  }`}
                >
                  {/* Completion accent */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-0.5 ${
                      isComplete ? "bg-emerald-500" : "bg-[var(--primary)]/40"
                    }`}
                  />

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isComplete
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-[var(--primary)]/10 text-[var(--primary)]"
                          }`}
                        >
                          {isComplete ? (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
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
                                d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold leading-snug text-[var(--foreground)]">
                            {project.name}
                          </h3>

                          {isComplete && (
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {project.description ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--muted-foreground)]">
                          {project.description}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm italic text-[var(--muted-foreground)]">
                          No description
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
                      <DeleteProjectButton
                        projectId={project.id}
                        projectName={project.name}
                      />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-auto pt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isComplete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {progress}% complete
                      </span>

                      <span className="text-xs text-[var(--muted-foreground)]">
                        {doneCount}/{taskCount} tasks
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete
                            ? "bg-emerald-500"
                            : "bg-[var(--accent)]"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span>
                          <span className="font-medium text-[var(--foreground)]">
                            {activeCount}
                          </span>{" "}
                          active
                        </span>

                        <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

                        <span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {doneCount}
                          </span>{" "}
                          done
                        </span>
                      </div>

                      <Link
                        href="/dashboard/tasks"
                        className="text-xs font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        View tasks →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="h-8" />
      </div>
    </AppShell>
  );
}