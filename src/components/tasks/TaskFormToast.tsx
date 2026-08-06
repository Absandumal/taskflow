"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function CreateTaskButton({
  children = "Add Task",
}: {
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      toast.success("Task created");
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Adding..." : children}
    </button>
  );
}