import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: payload.data.email.toLowerCase() } });
  const valid = user?.password ? await bcrypt.compare(payload.data.password, user.password) : false;

  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("siteclaud_user", user.id, { httpOnly: true, sameSite: "lax", path: "/" });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
