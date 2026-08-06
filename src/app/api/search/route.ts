import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 1) {
    return NextResponse.json({ tasks: [], projects: [] });
  }

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: session.user.id,
        title: { contains: q, mode: "insensitive" },
      },
      take: 8,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        completed: true,
      },
    }),
    prisma.project.findMany({
      where: {
        userId: session.user.id,
        name: { contains: q, mode: "insensitive" },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    }),
  ]);

  return NextResponse.json({ tasks, projects });
}