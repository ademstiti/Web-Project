import { addComment } from "../../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: "userId and content are required" });
  }

  const comment = await addComment(userId, id, content);
  return res.status(201).json(comment);
}
