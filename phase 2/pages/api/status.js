import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const [
    totalUsers,
    totalPosts,
    totalLikes,
    totalComments,
    mostActiveUser,
    mostLikedPost,
    avgFollowersRaw,
    mostCommentedPost,
    newestUsers,
  ] = await Promise.all([
    // 1. Total counts
    prisma.user.count(),
    prisma.post.count(),
    prisma.like.count(),
    prisma.comment.count(),

    // 2. Most active user (most posts)
    prisma.user.findFirst({
      orderBy: { posts: { _count: "desc" } },
      select: {
        id: true,
        username: true,
        avatar: true,
        _count: { select: { posts: true } },
      },
    }),

    // 3. Most liked post
    prisma.post.findFirst({
      orderBy: { likes: { _count: "desc" } },
      select: {
        id: true,
        content: true,
        author: { select: { username: true } },
        _count: { select: { likes: true } },
      },
    }),

    // 4. Average followers per user
    prisma.follow.groupBy({
      by: ["followingId"],
      _count: { followingId: true },
    }),

    // 5. Most commented post
    prisma.post.findFirst({
      orderBy: { comments: { _count: "desc" } },
      select: {
        id: true,
        content: true,
        author: { select: { username: true } },
        _count: { select: { comments: true } },
      },
    }),

    // 6. Newest 5 users
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, username: true, avatar: true, createdAt: true },
    }),
  ]);

  const avgFollowers =
    avgFollowersRaw.length === 0
      ? 0
      : (
          avgFollowersRaw.reduce((sum, u) => sum + u._count.followingId, 0) /
          totalUsers
        ).toFixed(2);

  return res.status(200).json({
    totals: { users: totalUsers, posts: totalPosts, likes: totalLikes, comments: totalComments },
    mostActiveUser,
    mostLikedPost,
    avgFollowers,
    mostCommentedPost,
    newestUsers,
  });
}
