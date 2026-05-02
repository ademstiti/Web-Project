import { deletePost } from "../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { authorId } = req.body;

  if (!authorId) {
    return res.status(400).json({ message: "authorId is required" });
  }

  const post = await deletePost(id, authorId);

  if (!post) {
    return res.status(403).json({ message: "Not found or not authorized" });
  }

  return res.status(200).json({ message: "Post deleted" });
}
