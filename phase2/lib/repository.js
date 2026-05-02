import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addUser(username, email, password) {
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });

  return user;
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

export async function checkLogin(email, password) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  return user;
}

export async function getUser(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      posts: true,
      followers: true,
      following: true,
    },
  });

  return user;
}

export async function addFollow(followerId, followingId) {
  const follow = await prisma.follow.create({
    data: {
      followerId: Number(followerId),
      followingId: Number(followingId),
    },
  });

  return follow;
}

export async function deleteFollow(followerId, followingId) {
  const follow = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
    },
  });

  return follow;
}


export async function getFeed(userId) {
  return prisma.post.findMany({
    where: {
      OR: [
        { author: { followers: { some: { followerId: Number(userId) } } } },
        { authorId: Number(userId) },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, username: true, avatar: true } } },
      },
    },
  });
}

export async function createPost(content, authorId) {
  const post = await prisma.post.create({
    data: { content, authorId: Number(authorId) },
    include: {
      author: { select: { id: true, username: true, avatar: true } },
      likes: { select: { userId: true } },
      comments: true,
    },
  });

  return post;
}

export async function deletePost(id, authorId) {
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

  if (!post || post.authorId !== Number(authorId)) return null;

  await prisma.post.delete({ where: { id: Number(id) } });

  return post;
}


export async function likePost(userId, postId) {
  const like = await prisma.like.create({
    data: { userId: Number(userId), postId: Number(postId) },
  });

  return like;
}

export async function unlikePost(userId, postId) {
  const like = await prisma.like.delete({
    where: {
      userId_postId: { userId: Number(userId), postId: Number(postId) },
    },
  });

  return like;
}


export async function addComment(userId, postId, content) {
  const comment = await prisma.comment.create({
    data: { userId: Number(userId), postId: Number(postId), content },
    include: { user: { select: { id: true, username: true, avatar: true } } },
  });

  return comment;
}

export async function deleteComment(commentId, userId) {
  const comment = await prisma.comment.findUnique({ where: { id: Number(commentId) } });

  if (!comment || comment.userId !== Number(userId)) return null;

  await prisma.comment.delete({ where: { id: Number(commentId) } });

  return comment;
}
//  Statistics 

export async function getTotals() {
  const [users, posts, likes, comments] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.like.count(),
    prisma.comment.count(),
  ]);
  return { users, posts, likes, comments };
}

export async function getMostActiveUser() {
  return prisma.user.findFirst({
    orderBy: { posts: { _count: "desc" } },
    select: {
      id: true,
      username: true,
      avatar: true,
      _count: { select: { posts: true } },
    },
  });
}

export async function getMostLikedPost() {
  return prisma.post.findFirst({
    orderBy: { likes: { _count: "desc" } },
    select: {
      id: true,
      content: true,
      author: { select: { username: true } },
      _count: { select: { likes: true } },
    },
  });
}

export async function getMostCommentedPost() {
  return prisma.post.findFirst({
    orderBy: { comments: { _count: "desc" } },
    select: {
      id: true,
      content: true,
      author: { select: { username: true } },
      _count: { select: { comments: true } },
    },
  });
}

export async function getAvgFollowers() {
  const [totalFollows, totalUsers] = await Promise.all([
    prisma.follow.count(),
    prisma.user.count(),
  ]);
  if (totalUsers === 0) return "0.00";
  return (totalFollows / totalUsers).toFixed(2);
}

export async function getNewestUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, username: true, avatar: true, createdAt: true },
  });
}