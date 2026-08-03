"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  const description = (formData.get("description") as string) || null;

  await prisma.project.create({
    data: {
      name: name.trim(),
      description,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
}