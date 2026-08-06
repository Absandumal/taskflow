import { prisma } from "@/lib/prisma";

export async function logActivity(
  userId: string,
  type: string,
  message: string
) {
  try {
    await prisma.activity.create({
      data: { userId, type, message },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}