import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to create API keys." }, { status: 401 });
  }

  const key = `sk_siteclaud_${nanoid(32)}`;
  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, key },
  });

  return NextResponse.json({ key: apiKey.key, createdAt: apiKey.createdAt });
}
