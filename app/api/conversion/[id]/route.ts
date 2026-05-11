import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  await prisma.conversion.deleteMany({
    where: {
      id,
      ...(user ? { userId: user.id } : {}),
    },
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
