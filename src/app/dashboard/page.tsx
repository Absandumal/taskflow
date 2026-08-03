import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { AppShell } from "@/components/layout/AppShell";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="max-w-3xl">
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

        {/* Add Task Form */}
        <form action={createTask} className="mb-8 flex gap-3">
          <input
            type="text"
            name="title"
            placeholder="Add a new task..."
            required
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          {tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-[var(--muted-foreground)]">
                No tasks yet. Add your first task above and start making progress.
              </p>
            </div>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <form action={toggleTask.bind(null, task.id)}>
                      <button
                        type="submit"
                        className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                          task.completed
                            ? "border-[var(--success)] bg-[var(--success)] text-white"
                            : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                        }`}
                      >
                        {task.completed && (
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

                    <span
                      className={`text-sm ${
                        task.completed
                          ? "text-[var(--muted-foreground)] line-through"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {task.title}
                    </span>
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
    </AppShell>
  );
}