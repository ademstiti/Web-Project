import { addFollow, deleteFollow } from "../../../../lib/repository";

export default async function handler(req, res) {
  const userId = req.query.id;
  const followerId = req.body.followerId;

  if (!followerId) {
    return res.status(400).json({ message: "followerId is required" });
  }

  if (Number(userId) === Number(followerId)) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  if (req.method === "POST") {
    const follow = await addFollow(followerId, userId);
    return res.status(201).json(follow);
  }

  if (req.method === "DELETE") {
    const follow = await deleteFollow(followerId, userId);
    return res.status(200).json(follow);
  }

  return res.status(405).json({ message: "Only POST or DELETE allowed" });
}