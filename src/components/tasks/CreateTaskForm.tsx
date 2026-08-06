"use client";

import { createTaskWithToast } from "@/components/ui/toast-actions";

export function CreateTaskForm({
  projects,
}: {
  projects: { id: string; name: string }[];
}) {
  return (
    <form action={createTaskWithToast} className="space-y-3">
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
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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

        <select
          name="projectId"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dueDate"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />

        <button
          type="submit"
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 sm:ml-auto"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}