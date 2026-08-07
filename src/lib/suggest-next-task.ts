import { Priority, Task, TaskStatus } from "@prisma/client";

type TaskLike = Pick<
  Task,
  "id" | "title" | "priority" | "dueDate" | "status" | "completed" | "description"
>;

const priorityScore: Record<Priority, number> = {
  URGENT: 100,
  HIGH: 70,
  MEDIUM: 40,
  LOW: 15,
};

function dueDateScore(dueDate: Date | null, now: Date): number {
  if (!dueDate) return 10;

  const due = new Date(dueDate);
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  const startDue = new Date(due);
  startDue.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (startDue.getTime() - startToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return 120; // overdue
  if (diffDays === 0) return 90; // due today
  if (diffDays === 1) return 70; // tomorrow
  if (diffDays <= 3) return 50;
  if (diffDays <= 7) return 30;
  return 15;
}

function statusBonus(status: TaskStatus): number {
  if (status === "IN_PROGRESS") return 25;
  if (status === "IN_REVIEW") return 10;
  if (status === "TODO") return 5;
  return 0;
}

export function scoreTask(task: TaskLike, now = new Date()): number {
  if (task.completed || task.status === "DONE") return -1;

  return (
    priorityScore[task.priority] +
    dueDateScore(task.dueDate, now) +
    statusBonus(task.status)
  );
}

export function suggestNextTask<T extends TaskLike>(
  tasks: T[],
  now = new Date()
): { task: T; score: number; reasons: string[] } | null {
  const active = tasks.filter((t) => !t.completed && t.status !== "DONE");
  if (active.length === 0) return null;

  const ranked = active
    .map((task) => {
      const score = scoreTask(task, now);
      const reasons: string[] = [];

      if (task.priority === "URGENT") reasons.push("Urgent priority");
      else if (task.priority === "HIGH") reasons.push("High priority");

      if (task.dueDate) {
        const due = new Date(task.dueDate);
        const startToday = new Date(now);
        startToday.setHours(0, 0, 0, 0);
        const startDue = new Date(due);
        startDue.setHours(0, 0, 0, 0);
        const diffDays = Math.round(
          (startDue.getTime() - startToday.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) reasons.push("Overdue");
        else if (diffDays === 0) reasons.push("Due today");
        else if (diffDays === 1) reasons.push("Due tomorrow");
        else if (diffDays <= 3) reasons.push("Due soon");
      }

      if (task.status === "IN_PROGRESS") reasons.push("Already in progress");

      if (reasons.length === 0) reasons.push("Next available task");

      return { task, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0] ?? null;
}