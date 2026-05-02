import { deleteComment } from "../../../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { commentId } = req.query;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const comment = await deleteComment(commentId, userId);

  if (!comment) {
    return res.status(403).json({ message: "Not found or not authorized" });
  }

  return res.status(200).json({ message: "Comment deleted" });
}
