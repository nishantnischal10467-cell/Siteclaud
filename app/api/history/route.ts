import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();

  const conversions = await prisma.conversion.findMany({
    where: user ? { userId: user.id } : {},
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      url: true,
      title: true,
      wordCount: true,
      characterCount: true,
      tokenEstimate: true,
      createdAt: true,
    },
  }).catch(() => []);

  return NextResponse.json({ conversions });
}
