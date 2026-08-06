"use client";

import { deleteTaskWithToast } from "@/components/ui/toast-actions";

export function DeleteTaskButton({ taskId }: { taskId: string }) {
  return (
    <button
      type="button"
      onClick={() => deleteTaskWithToast(taskId)}
      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--destructive)]"
    >
      Delete
    </button>
  );
}