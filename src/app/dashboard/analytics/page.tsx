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
      <div className="mx-auto w-full max-w-6xl px-1 pb-12">

        {/* ================================================== */}
        {/* Header */}
        {/* ================================================== */}

        <header className="mb-8">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            Productivity overview
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                Understand your workload, progress, and productivity at a
                glance.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
              Last 7 days
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* Metric Cards */}
        {/* ================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <MetricCard
            label="Total tasks"
            value={total}
            description={`${active} still active`}
          />

          <MetricCard
            label="Completed"
            value={completed}
            description={`${completionRate}% completion rate`}
            accent="success"
          />

          <MetricCard
            label="In progress"
            value={inProgress}
            description={`${todo} waiting to start`}
            accent="accent"
          />

          <MetricCard
            label="Overdue"
            value={overdue}
            description={
              overdue === 0
                ? "You're all caught up"
                : "Needs your attention"
            }
            accent={overdue > 0 ? "destructive" : undefined}
          />

        </section>

        {/* ================================================== */}
        {/* Main Insight Row */}
        {/* ================================================== */}

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Completion */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-2">

            <div>
              <h2 className="text-sm font-semibold">
                Overall progress
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                How much of your workload is complete.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="relative h-44 w-44">

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
                    stroke="var(--accent)"
                    strokeWidth="2.5"
                    strokeDasharray={`${completionRate}, 100`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-semibold tracking-tight">
                    {completionRate}%
                  </span>

                  <span className="mt-1 text-xs text-[var(--muted-foreground)]">
                    completed
                  </span>
                </div>

              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-5 text-center">

              <div>
                <p className="text-lg font-semibold">
                  {completed}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Completed
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {active}
                </p>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Remaining
                </p>
              </div>

            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 lg:col-span-3">

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Task status
                </h2>

                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Current distribution across your workflow.
                </p>
              </div>

              <span className="text-xs text-[var(--muted-foreground)]">
                {total} total
              </span>
            </div>

            <div className="mt-7 space-y-6">

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

          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-base font-semibold">
                Activity overview
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Task creation and completion over the past week.
              </p>
            </div>

            <div className="hidden items-center gap-4 text-xs text-[var(--muted-foreground)] sm:flex">
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Created */}
            <ChartCard
              title="Tasks created"
              total={createdLast7Days}
              subtitle="created this week"
            >
              <BarChart
                data={createdPerDay}
                max={maxCreated}
                barClass="bg-[var(--accent)]"
              />
            </ChartCard>

            {/* Completed */}
            <ChartCard
              title="Tasks completed"
              total={completedLast7Days}
              subtitle="completed this week"
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

        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                Priority distribution
              </h2>

              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                See how your workload is distributed by urgency.
              </p>
            </div>

            <span className="text-xs text-[var(--muted-foreground)]">
              {total} tasks
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
  accent,
}: {
  label: string;
  value: number;
  description: string;
  accent?: "success" | "accent" | "destructive";
}) {
  const valueColor =
    accent === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "destructive"
        ? "text-red-600 dark:text-red-400"
        : accent === "accent"
          ? "text-blue-600 dark:text-blue-400"
          : "text-[var(--foreground)]";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:bg-[var(--muted)]/30">

      <p className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-semibold tracking-tight ${valueColor}`}
      >
        {value}
      </p>

      <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
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
          <span className={`h-2 w-2 rounded-full ${indicator}`} />

          <span className="text-sm font-medium">
            {label}
          </span>
        </div>

        <span className="text-xs text-[var(--muted-foreground)]">
          {count} · {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={`h-full rounded-full ${indicator} transition-all duration-500`}
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
  children,
}: {
  title: string;
  total: number;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">

      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        </div>

        <span className="text-2xl font-semibold tracking-tight">
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
    <div className="flex h-44 items-end gap-2 sm:gap-3">

      {data.map((day) => {
        const height =
          day.count === 0
            ? 3
            : Math.max((day.count / max) * 100, 7);

        return (
          <div
            key={day.full}
            className="group flex h-full flex-1 flex-col items-center justify-end"
          >
            <div className="relative flex w-full flex-1 items-end justify-center">

              <div
                className={`w-full max-w-10 rounded-t-md ${barClass} opacity-75 transition-all duration-300 group-hover:opacity-100`}
                style={{
                  height: `${height}%`,
                }}
              />

              <div className="absolute bottom-full mb-2 hidden rounded-md border border-[var(--border)] bg-[var(--foreground)] px-2 py-1 text-[10px] font-medium text-[var(--background)] shadow-sm group-hover:block">
                {day.count}
              </div>

            </div>

            <span className="mt-3 text-[11px] text-[var(--muted-foreground)]">
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
    neutral:
      "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50",
    blue:
      "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30",
    orange:
      "border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/30",
    red:
      "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30",
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors hover:bg-[var(--muted)]/30 ${styles[tone]}`}
    >
      <p className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">
          {count}
        </span>

        <span className="text-xs text-[var(--muted-foreground)]">
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full bg-current opacity-50"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}