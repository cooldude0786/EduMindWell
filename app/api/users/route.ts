import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function requireUser(req: Request) {
  return getToken({ req: req as any });
}

export async function GET(req: Request) {
  if (!(await requireUser(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, isActive: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "asc" },
    });
    return Response.json(users);
  } catch (error) {
    console.error("List admin users error:", error);
    return Response.json({ error: "Could not load users. Apply the latest database migration first." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireUser(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { name, email, password } = await req.json();
  if (!email || !password || password.length < 8) return Response.json({ error: "Email and password of at least 8 characters are required" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (exists) return Response.json({ error: "A user with this email already exists" }, { status: 409 });
  const user = await prisma.user.create({ data: { name: name?.trim() || null, email: email.toLowerCase().trim(), password: await bcrypt.hash(password, 10) } });
  return Response.json({ id: user.id, name: user.name, email: user.email, isActive: user.isActive }, { status: 201 });
}

export async function PATCH(req: Request) {
  const token = await requireUser(req);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, isActive } = await req.json();
  if (!id || typeof isActive !== "boolean") return Response.json({ error: "User id and isActive are required" }, { status: 400 });
  if (id === token.sub && !isActive) return Response.json({ error: "You cannot suspend your own account" }, { status: 400 });
  const user = await prisma.user.update({ where: { id }, data: { isActive }, select: { id: true, isActive: true } });
  return Response.json(user);
}

export async function DELETE(req: Request) {
  const token = await requireUser(req);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id || id === token.sub) return Response.json({ error: "Invalid user id" }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return Response.json({ message: "User deleted" });
}
