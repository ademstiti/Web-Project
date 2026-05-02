import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  const users = await prisma.user.findMany({
    select: { id: true, username: true, avatar: true },
  });
  return res.status(200).json(users);
}
