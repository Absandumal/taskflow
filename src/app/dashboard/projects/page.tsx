import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { createProject } from "@/app/actions/projects";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        select: { id: true, completed: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.completed).length,
    0
  );
  const overallProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-6xl px-1 pb-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Projects
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Group related work, track progress, and keep every initiative
                moving forward.
              </p>
            </div>

            <Link
              href="/dashboard/tasks"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
            >
              View tasks →
            </Link>
          </div>
        </header>

        {/* Overview stats */}
        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Projects</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalProjects}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">
              Tasks across projects
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalTasks}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                Overall progress
              </p>
              <span className="text-xs font-medium">{overallProgress}%</span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {completedTasks}
              <span className="text-base font-normal text-[var(--muted-foreground)]">
                {" "}
                done
              </span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Create Project */}
        <section className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-sm font-semibold">New project</h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Start a focused workspace for a goal or deliverable.
            </p>
          </div>

          <form action={createProject} className="space-y-4 p-5">
            <input
              type="text"
              name="name"
              placeholder="Project name"
              required
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Create Project
            </button>
          </form>
        </section>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-20 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)] text-lg">
              ⌗
            </div>
            <h3 className="mt-4 text-sm font-semibold">No projects yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
              Create your first project to group tasks, track progress, and stay
              organized.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const taskCount = project.tasks.length;
              const doneCount = project.tasks.filter((t) => t.completed).length;
              const activeCount = project.tasks.filter(
                (t) => !t.completed && t.status !== "DONE"
              ).length;
              const progress =
                taskCount === 0
                  ? 0
                  : Math.round((doneCount / taskCount) * 100);

              return (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold leading-snug">
                        {project.name}
                      </h3>
                      {project.description ? (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[var(--muted-foreground)]">
                          {project.description}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-sm italic text-[var(--muted-foreground)]">
                          No description
                        </p>
                      )}
                    </div>

                    <DeleteProjectButton
                      projectId={project.id}
                      projectName={project.name}
                    />
                  </div>

                  <div className="mt-auto space-y-3 pt-4">
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="font-medium text-[var(--foreground)]">
                        {progress}% complete
                      </span>
                      <span>
                        {doneCount}/{taskCount} tasks
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                      <span>{activeCount} active</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
                      <span>{doneCount} done</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </AppShell>
  );
}