import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("siteclaud_user")?.value;

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, image: true, createdAt: true },
  });
}
