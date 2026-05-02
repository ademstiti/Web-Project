import { likePost, unlikePost } from "../../../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const { userId, action } = req.body; // action: "like" or "unlike"

  if (!userId || !action) {
    return res.status(400).json({ message: "userId and action are required" });
  }

  if (action === "like") {
    const like = await likePost(userId, id);
    return res.status(201).json(like);
  }

  if (action === "unlike") {
    const like = await unlikePost(userId, id);
    return res.status(200).json(like);
  }

  return res.status(400).json({ message: "action must be 'like' or 'unlike'" });
}
