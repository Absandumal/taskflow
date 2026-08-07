import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import {
  format,
  subDays,
  startOfDay,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  // --------------------------------------------------
  // Core metrics
  // --------------------------------------------------

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed || task.status === "DONE"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const todo = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inReview = tasks.filter(
    (task) => task.status === "IN_REVIEW"
  ).length;

  const overdue = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < startOfDay(now) &&
      task.status !== "DONE" &&
      !task.completed
  ).length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const active = total - completed;

  // --------------------------------------------------
  // Last 7 days
  // --------------------------------------------------

  const last7Days = eachDayOfInterval({
    start: subDays(now, 6),
    end: now,
  });

  const createdPerDay = last7Days.map((day) => ({
    label: format(day, "EEE"),
    full: format(day, "MMM d"),
    count: tasks.filter((task) =>
      isSameDay(new Date(task.createdAt), day)
    ).length,
  }));

  const completedPerDay = last7Days.map((day) => ({
    label: format(day, "EEE"),
    full: format(day, "MMM d"),
    count: tasks.filter(
      (task) =>
        (task.completed || task.status === "DONE") &&
        isSameDay(new Date(task.updatedAt), day)
    ).length,
  }));

  const maxCreated = Math.max(
    ...createdPerDay.map((day) => day.count),
    1
  );

  const maxCompleted = Math.max(
    ...completedPerDay.map((day) => day.count),
    1
  );

  const createdLast7Days = createdPerDay.reduce(
    (sum, day) => sum + day.count,
    0
  );

  const completedLast7Days = completedPerDay.reduce(
    (sum, day) => sum + day.count,
    0
  );

  // --------------------------------------------------
  // Priorities
  // --------------------------------------------------

  const priorities = {
    LOW: tasks.filter((task) => task.priority === "LOW").length,
    MEDIUM: tasks.filter((task) => task.priority === "MEDIUM").length,
    HIGH: tasks.filter((task) => task.priority === "HIGH").length,
    URGENT: tasks.filter((task) => task.priority === "URGENT").length,
  };

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">

        {/* ================================================== */}
        {/* Header */}
        {/* ================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16l4-5 3 3 5-7"
                    />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Productivity
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Understand your workload, track your progress, and see how
                your productivity is evolving.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Last 7 days
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* Metric Cards */}
        {/* ================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">

          <MetricCard
            label="Total tasks"
            value={total}
            description={`${active} still active`}
            tone="neutral"
            icon="tasks"
          />

          <MetricCard
            label="Completed"
            value={completed}
            description={`${completionRate}% completion rate`}
            tone="success"
            icon="check"
          />

          <MetricCard
            label="In progress"
            value={inProgress}
            description={`${todo} waiting to start`}
            tone="blue"
            icon="progress"
          />

          <MetricCard
            label="Overdue"
            value={overdue}
            description={
              overdue === 0
                ? "You're all caught up"
                : "Needs your attention"
            }
            tone={overdue > 0 ? "danger" : "neutral"}
            icon="alert"
          />

        </section>

        {/* ================================================== */}
        {/* Main Insight Row */}
        {/* ================================================== */}

        <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-5">

          {/* Completion */}
          <div className="rounded-2xl border border-emerald-500/15 bg-[var(--card)] p-6 shadow-sm lg:col-span-2">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    Overall progress
                  </h2>

                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Your overall task completion rate.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="relative h-48 w-48">
                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray={`${completionRate}, 100`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                    {completionRate}%
                  </span>

                  <span className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    completed
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-5 text-center">
              <div>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {completed}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Completed
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {active}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Remaining
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:col-span-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Task status
                </h2>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  See how your tasks are distributed across the workflow.
                </p>
              </div>

              <span className="rounded-lg bg-[var(--muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                {total} total
              </span>
            </div>

            <div className="mt-8 space-y-6">
              <StatusBar
                label="To Do"
                count={todo}
                total={total}
                indicator="bg-zinc-400"
              />

              <StatusBar
                label="In Progress"
                count={inProgress}
                total={total}
                indicator="bg-blue-500"
              />

              <StatusBar
                label="In Review"
                count={inReview}
                total={total}
                indicator="bg-purple-500"
              />

              <StatusBar
                label="Done"
                count={completed}
                total={total}
                indicator="bg-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* Activity Overview */}
        {/* ================================================== */}

        <section className="mb-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Activity overview
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Task creation and completion during the past week.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Created
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            <ChartCard
              title="Tasks created"
              total={createdLast7Days}
              subtitle="created this week"
              tone="accent"
            >
              <BarChart
                data={createdPerDay}
                max={maxCreated}
                barClass="bg-[var(--accent)]"
              />
            </ChartCard>

            <ChartCard
              title="Tasks completed"
              total={completedLast7Days}
              subtitle="completed this week"
              tone="success"
            >
              <BarChart
                data={completedPerDay}
                max={maxCompleted}
                barClass="bg-emerald-500"
              />
            </ChartCard>

          </div>
        </section>

        {/* ================================================== */}
        {/* Priority Distribution */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Priority distribution
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Understand how your workload is distributed by urgency.
              </p>
            </div>

            <span className="text-xs text-[var(--muted-foreground)]">
              {total} total tasks
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <PriorityCard
              label="Low"
              count={priorities.LOW}
              total={total}
              tone="neutral"
            />

            <PriorityCard
              label="Medium"
              count={priorities.MEDIUM}
              total={total}
              tone="blue"
            />

            <PriorityCard
              label="High"
              count={priorities.HIGH}
              total={total}
              tone="orange"
            />

            <PriorityCard
              label="Urgent"
              count={priorities.URGENT}
              total={total}
              tone="red"
            />

          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </AppShell>
  );
}

/* ============================================================
   Metric Card
============================================================ */

function MetricCard({
  label,
  value,
  description,
  tone,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  tone: "neutral" | "success" | "blue" | "danger";
  icon: "tasks" | "check" | "progress" | "alert";
}) {
  const styles = {
    neutral: {
      value: "text-[var(--foreground)]",
      icon: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    },
    success: {
      value: "text-emerald-600 dark:text-emerald-400",
      icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    blue: {
      value: "text-blue-600 dark:text-blue-400",
      icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    danger: {
      value: "text-red-600 dark:text-red-400",
      icon: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  };

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)]">
            {label}
          </p>

          <p
            className={`mt-3 text-3xl font-bold tracking-tight ${styles[tone].value}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone].icon}`}
        >
          {icon === "check" && (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          {icon === "tasks" && (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7h-2M9 5a3 3 0 006 0"
              />
            </svg>
          )}

          {icon === "progress" && (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-6"
              />
            </svg>
          )}

          {icon === "alert" && (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 4.4l-7.1 12.3A2 2 0 005 20h14a2 2 0 001.8-3.3L13.7 4.4a2 2 0 00-3.4 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   Status Bar
============================================================ */

function StatusBar({
  label,
  count,
  total,
  indicator,
}: {
  label: string;
  count: number;
  total: number;
  indicator: string;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${indicator}`} />

          <span className="text-sm font-medium">
            {label}
          </span>
        </div>

        <span className="text-xs font-medium text-[var(--muted-foreground)]">
          {count} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full ${indicator} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Chart Card
============================================================ */

function ChartCard({
  title,
  total,
  subtitle,
  tone,
  children,
}: {
  title: string;
  total: number;
  subtitle: string;
  tone: "accent" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-[var(--card)] p-6 shadow-sm ${
        tone === "success"
          ? "border-emerald-500/15"
          : "border-[var(--border)]"
      }`}
    >
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        </div>

        <span
          className={`text-2xl font-bold tracking-tight ${
            tone === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-[var(--foreground)]"
          }`}
        >
          {total}
        </span>
      </div>

      <div className="mt-7">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Bar Chart
============================================================ */

function BarChart({
  data,
  max,
  barClass,
}: {
  data: {
    label: string;
    full: string;
    count: number;
  }[];
  max: number;
  barClass: string;
}) {
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-3">
      {data.map((day) => {
        const height =
          day.count === 0
            ? 3
            : Math.max((day.count / max) * 100, 8);

        return (
          <div
            key={day.full}
            className="group flex h-full flex-1 flex-col items-center justify-end"
          >
            <div className="relative flex w-full flex-1 items-end justify-center">
              <div
                className={`w-full max-w-12 rounded-t-lg ${barClass} opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-110`}
                style={{
                  height: `${height}%`,
                }}
              />

              <div className="absolute bottom-full mb-2 hidden rounded-lg border border-[var(--border)] bg-[var(--foreground)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--background)] shadow-lg group-hover:block">
                {day.count} {day.count === 1 ? "task" : "tasks"}
              </div>
            </div>

            <span className="mt-3 text-[11px] font-medium text-[var(--muted-foreground)]">
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Priority Card
============================================================ */

function PriorityCard({
  label,
  count,
  total,
  tone,
}: {
  label: string;
  count: number;
  total: number;
  tone: "neutral" | "blue" | "orange" | "red";
}) {
  const percentage =
    total === 0 ? 0 : Math.round((count / total) * 100);

  const styles = {
    neutral: {
      card: "border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40",
      dot: "bg-zinc-400",
      text: "text-zinc-600 dark:text-zinc-400",
    },

    blue: {
      card: "border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20",
      dot: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },

    orange: {
      card: "border-orange-200 bg-orange-50/50 dark:border-orange-900/60 dark:bg-orange-950/20",
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
    },

    red: {
      card: "border-red-200 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20",
      dot: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    },
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${styles[tone].card}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${styles[tone].dot}`}
        />

        <p className="text-xs font-semibold text-[var(--foreground)]">
          {label}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight">
          {count}
        </span>

        <span className={`text-xs font-semibold ${styles[tone].text}`}>
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full ${styles[tone].dot} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}