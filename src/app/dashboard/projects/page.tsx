import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { createProject, deleteProject } from "@/app/actions/projects";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: {
        select: { id: true, completed: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Organize your work into focused projects.
          </p>
        </div>

        {/* Create Project */}
        <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-sm font-medium">New Project</h2>
          <form action={createProject} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Project name"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            >
              Create Project
            </button>
          </form>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
            <p className="text-[var(--muted-foreground)]">
              No projects yet. Create your first project to organize your tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const totalTasks = project.tasks.length;
              const completedTasks = project.tasks.filter((t) => t.completed).length;
              const progress =
                totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

              return (
                <div
                  key={project.id}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-medium leading-snug">{project.name}</h3>
                    <form action={deleteProject.bind(null, project.id)}>
                      <button
                        type="submit"
                        className="text-xs text-[var(--muted-foreground)] opacity-0 transition-opacity hover:text-[var(--destructive)] group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </form>
                  </div>

                  {project.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                      {project.description}
                    </p>
                  )}

                  <div className="mb-2">
                    <div className="mb-1.5 flex justify-between text-xs text-[var(--muted-foreground)]">
                      <span>{progress}% complete</span>
                      <span>
                        {completedTasks}/{totalTasks} tasks
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}