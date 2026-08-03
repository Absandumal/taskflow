"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@prisma/client";
import { TaskCard } from "./TaskCard";

export function Column({
  id,
  title,
  tasks,
}: {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[420px] flex-col rounded-xl border bg-[var(--card)] transition-colors ${
        isOver ? "border-[var(--accent)]" : "border-[var(--border)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 p-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="py-8 text-center text-xs text-[var(--muted-foreground)]">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}