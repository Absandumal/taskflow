import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { Board } from "@/components/board/Board";

export default async function BoardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell userName={session.user.name || session.user.email}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Board</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Drag tasks between columns to update their status.
        </p>
      </div>

      <Board tasks={tasks} />
    </AppShell>
  );
}