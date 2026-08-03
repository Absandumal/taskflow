"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { format } from "date-fns";

export function TaskCard({
  task,
  isDragging = false,
}: {
  task: Task;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 active:cursor-grabbing ${
        isDragging || isSortableDragging
          ? "opacity-90 shadow-lg ring-2 ring-[var(--accent)]"
          : "hover:border-[var(--muted-foreground)]/40"
      }`}
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="text-xs text-[var(--muted-foreground)]">
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>
    </div>
  );
}