import { Priority } from "@prisma/client";
import { cn } from "@/lib/utils";

const styles: Record<Priority, string> = {
  LOW: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  MEDIUM: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  HIGH: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  URGENT: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        styles[priority]
      )}
    >
      {priority}
    </span>
  );
}