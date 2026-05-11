import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Use a valid email and an 8+ character password." }, { status: 400 });
  }

  const password = await bcrypt.hash(payload.data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: payload.data.email.toLowerCase(),
      name: payload.data.name,
      password,
      subscriptions: { create: { plan: "free", status: "trialing" } },
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("siteclaud_user", user.id, { httpOnly: true, sameSite: "lax", path: "/" });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
