"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDisplayName(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  if (!name || name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }
  if (name.length > 50) {
    return { error: "Name must be 50 characters or less" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { success: true };
}