import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.loading}>Loading stats...</p>;

  const { totals, mostActiveUser, mostLikedPost, avgFollowers, mostCommentedPost, newestUsers } = stats;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Platform Statistics</h1>

      {/* Stat 1 — Totals */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Overview</h2>
        <div style={styles.grid}>
          <StatCard label="Total Users" value={totals.users} />
          <StatCard label="Total Posts" value={totals.posts} />
          <StatCard label="Total Likes" value={totals.likes} />
          <StatCard label="Total Comments" value={totals.comments} />
        </div>
      </section>

      {/* Stat 2 — Most active user */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Most Active User</h2>
        <div style={styles.card}>
          <p style={styles.highlight}>@{mostActiveUser?.username}</p>
          <p style={styles.sub}>{mostActiveUser?._count.posts} posts</p>
        </div>
      </section>

      {/* Stat 3 — Most liked post */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Most Liked Post</h2>
        <div style={styles.card}>
          <p style={styles.sub}>by @{mostLikedPost?.author.username}</p>
          <p style={styles.postContent}>&quot;{mostLikedPost?.content}&quot;</p>
          <p style={styles.highlight}>{mostLikedPost?._count.likes} likes</p>
        </div>
      </section>

      {/* Stat 4 — Average followers */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Average Followers per User</h2>
        <div style={styles.card}>
          <p style={styles.highlight}>{avgFollowers}</p>
        </div>
      </section>

      {/* Stat 5 — Most commented post */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Most Commented Post</h2>
        <div style={styles.card}>
          <p style={styles.sub}>by @{mostCommentedPost?.author.username}</p>
          <p style={styles.postContent}>&quot;{mostCommentedPost?.content}&quot;</p>
          <p style={styles.highlight}>{mostCommentedPost?._count.comments} comments</p>
        </div>
      </section>

      {/* Stat 6 — Newest users */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Newest 5 Users</h2>
        <div style={styles.grid}>
          {newestUsers.map((u) => (
            <div key={u.id} style={styles.card}>
              <p style={styles.highlight}>@{u.username}</p>
              <p style={styles.sub}>
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.highlight}>{value}</p>
      <p style={styles.sub}>{label}</p>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "sans-serif",
    backgroundColor: "#0f0f0f",
    minHeight: "100vh",
    color: "#fff",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#fff",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    color: "#888",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "1.25rem",
  },
  highlight: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
  },
  sub: {
    fontSize: "0.85rem",
    color: "#888",
    margin: "0.25rem 0 0",
  },
  postContent: {
    fontSize: "0.95rem",
    color: "#ccc",
    margin: "0.5rem 0",
    fontStyle: "italic",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    fontFamily: "sans-serif",
    color: "#888",
  },
};
