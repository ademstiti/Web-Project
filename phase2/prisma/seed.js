// ============================================================
// seed.js — Populate ZeRo database with demo data
// Run with: npm run db:seed
// ============================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Clear existing data (order matters due to foreign keys) ──
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Cleared existing data');

  // ── Create Users ─────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'islam_dev',
        email:    'islam@zero.com',
        password: 'Pass1234!',
        bio:      'CS student at Qatar University 🎓 | Building cool stuff',
      }
    }),
    prisma.user.create({
      data: {
        username: 'sara_codes',
        email:    'sara@zero.com',
        password: 'Pass1234!',
        bio:      'Frontend developer. Coffee & code ☕',
      }
    }),
    prisma.user.create({
      data: {
        username: 'ahmed_q',
        email:    'ahmed@zero.com',
        password: 'Pass1234!',
        bio:      'Tech enthusiast from Qatar 🇶🇦',
      }
    }),
    prisma.user.create({
      data: {
        username: 'layla_m',
        email:    'layla@zero.com',
        password: 'Pass1234!',
        bio:      'Designer & photographer 📷',
      }
    }),
    prisma.user.create({
      data: {
        username: 'khalid_x',
        email:    'khalid@zero.com',
        password: 'Pass1234!',
        bio:      'Software engineer | Open source contributor',
      }
    }),
    prisma.user.create({
      data: {
        username: 'noura_tech',
        email:    'noura@zero.com',
        password: 'Pass1234!',
        bio:      'AI & machine learning researcher 🤖',
      }
    }),
    prisma.user.create({
      data: {
        username: 'omar_builds',
        email:    'omar@zero.com',
        password: 'Pass1234!',
        bio:      'Full stack dev | Node.js & React',
      }
    }),
    prisma.user.create({
      data: {
        username: 'fatma_ui',
        email:    'fatma@zero.com',
        password: 'Pass1234!',
        bio:      'UI/UX designer making things beautiful ✨',
      }
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // ── Create Posts ─────────────────────────────────────────────
  const posts = await Promise.all([
    prisma.post.create({ data: { content: 'Just shipped my first Next.js app! The routing system is so clean 🚀', authorId: users[0].id, createdAt: new Date('2026-04-01T10:00:00Z') }}),
    prisma.post.create({ data: { content: 'Flexbox vs Grid — both have their place. Stop the war 😂 Use the right tool for the job.', authorId: users[1].id, createdAt: new Date('2026-04-02T11:00:00Z') }}),
    prisma.post.create({ data: { content: 'Qatar is becoming such a tech hub. Excited to see what the next 5 years bring 🇶🇦', authorId: users[2].id, createdAt: new Date('2026-04-03T09:00:00Z') }}),
    prisma.post.create({ data: { content: 'Golden hour photography is therapeutic. No filter needed when the light is right 🌅', authorId: users[3].id, createdAt: new Date('2026-04-04T16:00:00Z') }}),
    prisma.post.create({ data: { content: 'Open source contribution tip: start with documentation. Most projects desperately need it.', authorId: users[4].id, createdAt: new Date('2026-04-05T08:00:00Z') }}),
    prisma.post.create({ data: { content: 'The difference between AI and ML explained in one sentence: ML is a subset of AI. There I saved you 3 YouTube videos 😄', authorId: users[5].id, createdAt: new Date('2026-04-06T14:00:00Z') }}),
    prisma.post.create({ data: { content: 'Built a REST API in 20 minutes with Next.js API routes. The future of full stack is here.', authorId: users[6].id, createdAt: new Date('2026-04-07T10:30:00Z') }}),
    prisma.post.create({ data: { content: 'Dark mode is not just a trend — it is accessibility. Not everyone is comfortable with bright screens.', authorId: users[7].id, createdAt: new Date('2026-04-08T12:00:00Z') }}),
    prisma.post.create({ data: { content: 'localStorage is great for prototypes but please use a real database for production 🙏', authorId: users[0].id, createdAt: new Date('2026-04-09T09:00:00Z') }}),
    prisma.post.create({ data: { content: 'CSS Grid changed my life. Two years ago I was crying over floats. Now I sleep peacefully.', authorId: users[1].id, createdAt: new Date('2026-04-10T15:00:00Z') }}),
    prisma.post.create({ data: { content: 'Prisma ORM makes database queries feel like writing JavaScript. Absolutely love it.', authorId: users[4].id, createdAt: new Date('2026-04-11T11:00:00Z') }}),
    prisma.post.create({ data: { content: 'Finals week survival kit: coffee, dark theme, lo-fi music, and Stack Overflow 📚', authorId: users[2].id, createdAt: new Date('2026-04-12T22:00:00Z') }}),
    prisma.post.create({ data: { content: 'Just hit 100 GitHub stars on my repo! Never thought anyone would use my code 😭❤️', authorId: users[6].id, createdAt: new Date('2026-04-13T18:00:00Z') }}),
    prisma.post.create({ data: { content: 'Design tip: whitespace is not empty space. It is breathing room for your content.', authorId: users[7].id, createdAt: new Date('2026-04-14T10:00:00Z') }}),
    prisma.post.create({ data: { content: 'Hot take: TypeScript saves more time than it costs. Fight me.', authorId: users[5].id, createdAt: new Date('2026-04-15T13:00:00Z') }}),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // ── Create Follows ────────────────────────────────────────────
  const followPairs = [
    [0, 1], [0, 2], [0, 4], [0, 5],
    [1, 0], [1, 2], [1, 7],
    [2, 0], [2, 3], [2, 6],
    [3, 0], [3, 1], [3, 7],
    [4, 0], [4, 5], [4, 6],
    [5, 1], [5, 4], [5, 6],
    [6, 0], [6, 2], [6, 4],
    [7, 1], [7, 3], [7, 5],
  ];

  await Promise.all(
    followPairs.map(([followerIdx, followingIdx]) =>
      prisma.follow.create({
        data: {
          followerId:  users[followerIdx].id,
          followingId: users[followingIdx].id,
        }
      })
    )
  );

  console.log(`✅ Created ${followPairs.length} follows`);

  // ── Create Likes ──────────────────────────────────────────────
  const likePairs = [
    [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
    [0, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [4, 2],
    [0, 3], [1, 3], [5, 3], [6, 3],
    [0, 4], [2, 4], [3, 4], [7, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
    [0, 6], [1, 6], [5, 6],
    [0, 7], [2, 7], [4, 7], [6, 7],
    [1, 8], [3, 8], [5, 8],
    [0, 9], [2, 9], [4, 9], [6, 9],
    [0, 10], [1, 10], [2, 10], [3, 10],
    [1, 11], [4, 11],
    [0, 12], [1, 12], [3, 12], [5, 12], [7, 12],
    [0, 13], [2, 13], [4, 13],
    [0, 14], [1, 14], [2, 14], [3, 14], [4, 14], [5, 14],
  ];

  await Promise.all(
    likePairs.map(([userIdx, postIdx]) =>
      prisma.like.create({
        data: {
          userId: users[userIdx].id,
          postId: posts[postIdx].id,
        }
      })
    )
  );

  console.log(`✅ Created ${likePairs.length} likes`);

  // ── Create Comments ───────────────────────────────────────────
  const commentsData = [
    { userIdx: 1, postIdx: 0,  content: 'Next.js is amazing! Which version are you using?' },
    { userIdx: 2, postIdx: 0,  content: 'Congrats! Keep building 🔥' },
    { userIdx: 3, postIdx: 0,  content: 'What was the hardest part?' },
    { userIdx: 0, postIdx: 1,  content: 'Grid for layout, Flexbox for components. That is my rule.' },
    { userIdx: 4, postIdx: 1,  content: 'Finally someone said it 😂' },
    { userIdx: 0, postIdx: 2,  content: 'QU represent! 🇶🇦' },
    { userIdx: 5, postIdx: 2,  content: 'The startup scene is growing so fast here.' },
    { userIdx: 0, postIdx: 3,  content: 'Stunning shot! What camera do you use?' },
    { userIdx: 2, postIdx: 3,  content: 'This is desktop wallpaper material 🌅' },
    { userIdx: 1, postIdx: 4,  content: 'This is such good advice. Docs are underrated.' },
    { userIdx: 6, postIdx: 4,  content: 'Started with docs on my first open source project too!' },
    { userIdx: 0, postIdx: 5,  content: 'Haha I needed those 3 videos though 😅' },
    { userIdx: 3, postIdx: 5,  content: 'Actually a perfect explanation.' },
    { userIdx: 0, postIdx: 6,  content: 'Next.js API routes are so underrated.' },
    { userIdx: 4, postIdx: 6,  content: 'Agreed! Combined with Prisma it is unstoppable.' },
    { userIdx: 1, postIdx: 7,  content: 'Dark mode for life 🌙' },
    { userIdx: 5, postIdx: 7,  content: 'Accessibility angle is so important. More people should think about this.' },
    { userIdx: 1, postIdx: 8,  content: 'This hit different after debugging localStorage for 3 hours 😭' },
    { userIdx: 2, postIdx: 9,  content: 'Float gang represent... just kidding never again 😂' },
    { userIdx: 0, postIdx: 10, content: 'Prisma + Next.js is the best combo right now.' },
    { userIdx: 3, postIdx: 11, content: 'Sending strength to all students ✊' },
    { userIdx: 7, postIdx: 12, content: 'Well deserved! What is the project about?' },
    { userIdx: 0, postIdx: 13, content: 'Such a clean design perspective.' },
    { userIdx: 2, postIdx: 14, content: 'TypeScript saved me last week. 100% agree.' },
    { userIdx: 6, postIdx: 14, content: 'The initial setup cost is so worth it.' },
  ];

  await Promise.all(
    commentsData.map(({ userIdx, postIdx, content }) =>
      prisma.comment.create({
        data: {
          content,
          userId: users[userIdx].id,
          postId: posts[postIdx].id,
        }
      })
    )
  );

  console.log(`✅ Created ${commentsData.length} comments`);

  // ── Summary ───────────────────────────────────────────────────
  console.log('\n🎉 Database seeded successfully!');
  console.log('─────────────────────────────────');
  console.log(`👤 Users:    ${users.length}`);
  console.log(`📝 Posts:    ${posts.length}`);
  console.log(`❤️  Likes:    ${likePairs.length}`);
  console.log(`💬 Comments: ${commentsData.length}`);
  console.log(`👥 Follows:  ${followPairs.length}`);
  console.log('─────────────────────────────────');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
