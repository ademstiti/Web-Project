import { getFeed, createPost } from "../../../lib/repository";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const posts = await getFeed(userId);
    return res.status(200).json(posts);
  }

  if (req.method === "POST") {
    const { content, authorId } = req.body;

    if (!content || !authorId) {
      return res.status(400).json({ message: "content and authorId are required" });
    }

    const post = await createPost(content, authorId);
    return res.status(201).json(post);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
