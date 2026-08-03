"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus, Priority } from "@prisma/client";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  const description = (formData.get("description") as string) || null;
  const priority = (formData.get("priority") as Priority) || "MEDIUM";
  const dueDateRaw = formData.get("dueDate") as string;

  await prisma.task.create({
    data: {
      title: title.trim(),
      description,
      priority,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
}

export async function toggleTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== session.user.id) throw new Error("Unauthorized");

  const newCompleted = !task.completed;

  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: newCompleted,
      status: newCompleted ? "DONE" : "TODO",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      completed: status === "DONE",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
}