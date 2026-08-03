"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  if (!title || title.trim() === "") {
    return;
  }

  await prisma.task.create({
    data: {
      title: title.trim(),
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function toggleTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/dashboard");
}