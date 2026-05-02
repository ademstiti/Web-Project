import { getUser } from "../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  const id = req.query.id;

  const user = await getUser(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}