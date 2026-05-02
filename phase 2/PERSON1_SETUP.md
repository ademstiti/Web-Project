# Person 1 — Setup Instructions

## Step 1: Install dependencies
```bash
npm install
```

## Step 2: Generate Prisma client
```bash
npx prisma generate
```

## Step 3: Create the database & run migration
```bash
npx prisma migrate dev --name init
```
This creates `prisma/zero.db` (your SQLite database file).

## Step 4: Seed the database with demo data
```bash
npm run db:seed
```

## Step 5: Verify data (optional — opens browser UI)
```bash
npm run db:studio
```
Opens at http://localhost:5555 — you can browse all tables.

## Step 6: Start the dev server
```bash
npm run dev
```
Opens at http://localhost:3000

---

## What was created:
- `prisma/schema.prisma` — 5 tables: User, Post, Like, Comment, Follow
- `prisma/seed.js` — 8 users, 15 posts, 55 likes, 25 comments, 24 follows
- `package.json` — all dependencies
- `.env` — database URL
- `next.config.js` — Next.js config

## Hand off to Person 2 & 3:
Once migration runs successfully, share the project folder.
Person 2 & 3 can start building repository and APIs immediately.
