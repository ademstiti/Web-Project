import {
  getTotals,
  getMostActiveUser,
  getMostLikedPost,
  getMostCommentedPost,
  getAvgFollowers,
  getNewestUsers,
} from "../../lib/repository";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const [totals, mostActiveUser, mostLikedPost, mostCommentedPost, avgFollowers, newestUsers] =
    await Promise.all([
      getTotals(),
      getMostActiveUser(),
      getMostLikedPost(),
      getMostCommentedPost(),
      getAvgFollowers(),
      getNewestUsers(),
    ]);

  return res.status(200).json({
    totals,
    mostActiveUser,
    mostLikedPost,
    avgFollowers,
    mostCommentedPost,
    newestUsers,
  });
}
