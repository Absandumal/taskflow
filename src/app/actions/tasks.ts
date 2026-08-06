"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus, Priority } from "@prisma/client";
import { logActivity } from "@/lib/activity";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  if (!title?.trim()) return;

  const description = (formData.get("description") as string) || null;
  const priority = (formData.get("priority") as Priority) || "MEDIUM";
  const dueDateRaw = formData.get("dueDate") as string;
  const projectId = (formData.get("projectId") as string) || null;

  // If a project is selected, make sure it belongs to this user
  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) throw new Error("Unauthorized");
  }

  await prisma.task.create({
    data: {
      title: title.trim(),
      description,
      priority,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      projectId: projectId || null,
      userId: session.user.id,
    },
  });

  await logActivity(
    session.user.id,
    "task_created",
    `Created task "${title.trim()}"`
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
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

export async function updateTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as TaskStatus;
  const priority = formData.get("priority") as Priority;
  const dueDateRaw = formData.get("dueDate") as string;
  const projectId = (formData.get("projectId") as string) || null;

  if (!taskId || !title?.trim()) return;

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) throw new Error("Unauthorized");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: title.trim(),
      description,
      status,
      priority,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      projectId: projectId || null,
      completed: status === "DONE",
    },
  });

  await logActivity(
    session.user.id,
    "task_updated",
    `Updated task "${title.trim()}"`
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/board");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
}