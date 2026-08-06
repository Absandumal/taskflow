"use client";

import { useState } from "react";
import { updateTask } from "@/app/actions/tasks";
import { Task, Project } from "@prisma/client";
import { X } from "lucide-react";

type TaskWithProject = Task & {
  project?: { id: string; name: string } | null;
};

export function EditTaskModal({
  task,
  projects,
}: {
  task: TaskWithProject;
  projects: Project[];
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateTask(formData);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Task</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <input type="hidden" name="taskId" value={task.id} />

              <div>
                <label className="mb-1.5 block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={task.title}
                  required
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={task.description || ""}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={task.status}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={task.priority}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Due date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={
                      task.dueDate
                        ? new Date(task.dueDate).toISOString().slice(0, 10)
                        : ""
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Project
                  </label>
                  <select
                    name="projectId"
                    defaultValue={task.projectId || ""}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}