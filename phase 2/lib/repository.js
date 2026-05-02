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