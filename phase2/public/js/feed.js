document.addEventListener("DOMContentLoaded", async () => {
  const currUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currUser) { window.location.href = "index.html"; return; }

  document.getElementById("nav-username").textContent = currUser.username;
  document.getElementById("nav-avatar").src = "assets/default-avatar.svg";
  document.getElementById("composer-avatar").src = "assets/default-avatar.svg";

  const postInput = document.getElementById("post-input");
  const postBTN = document.getElementById("post-btn");
  const charCount = document.getElementById("post-char-count");
  const feedList = document.getElementById("feed-list");
  const suggestionsList = document.getElementById("suggestions-list");

  postInput.addEventListener("input", function () {
    const length = postInput.value.length;
    charCount.textContent = `${length} / 280`;
    postBTN.disabled = length === 0 || length > 280;
  });

  postBTN.addEventListener("click", async function () {
    const content = postInput.value.trim();
    if (!content || content.length > 280) return;

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorId: currUser.id }),
    });

    postInput.value = "";
    charCount.textContent = "0 / 280";
    postBTN.disabled = true;
    await renderFeed();
  });

  async function renderFeed() {
    const res = await fetch(`/api/posts?userId=${currUser.id}`);
    const posts = await res.json();

    feedList.innerHTML = "";
    if (posts.length === 0) {
      feedList.innerHTML = '<p class="empty-state">Follow some users to see their posts here, or make your first post above!</p>';
      return;
    }

    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";

      const likedByMe = post.likes.some((l) => l.userId === currUser.id);
      const likeCount = post.likes.length;
      const commentCount = post.comments.length;

      postCard.innerHTML = `
        <div class="post-header">
          <img src="assets/default-avatar.svg" alt="${post.author.username}" class="post-avatar">
          <div>
            <span class="post-author">${post.author.username}</span>
            <span class="post-time">${new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-footer">
          <button class="post-action ${likedByMe ? "liked" : ""}" onclick="toggleLike(${post.id}, ${likedByMe})">
            <p>❤</p> ${likeCount}
          </button>
          <button class="post-action" onclick="toggleComments(${post.id})">
            <p>📩</p> ${commentCount}
          </button>
          ${post.author.id === currUser.id ? `<button class="post-delete-btn" onclick="deletePost(${post.id})">Delete</button>` : ""}
        </div>
        <div class="post-comments hidden" id="comments-${post.id}">
          <div class="comment-composer">
            <img src="assets/default-avatar.svg" class="comment-avatar">
            <input type="text" class="comment-input" placeholder="Write a comment..." id="comment-input-${post.id}">
            <button class="btn-comment" onclick="addComment(${post.id})">Post</button>
          </div>
          <div class="comment-list" id="comment-list-${post.id}">
            ${post.comments.map((c) => `
              <div class="comment-item">
                <img src="assets/default-avatar.svg" class="comment-avatar">
                <div class="comment-body">
                  <div class="comment-author">${c.user.username}</div>
                  <div class="comment-text">${c.content}</div>
                  <div class="comment-time">${new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
      feedList.appendChild(postCard);
    });
  }

  async function renderSuggestions() {
    const [usersRes, userRes] = await Promise.all([
      fetch("/api/users"),
      fetch(`/api/users/${currUser.id}`),
    ]);
    const users = await usersRes.json();
    const userData = await userRes.json();
    const followingIds = userData.following.map((f) => f.followingId);

    suggestionsList.innerHTML = "";
    users.forEach((user) => {
      if (user.id === currUser.id) return;
      const isFollowing = followingIds.includes(user.id);
      const li = document.createElement("li");
      li.className = "suggestion-item";
      li.innerHTML = `
        <img src="assets/default-avatar.svg" class="suggestion-avatar">
        <div class="suggestion-info"><span>${user.username}</span></div>
        <button onclick="${isFollowing ? "unfollowUser" : "followUser"}(${user.id})">${isFollowing ? "Unfollow" : "Follow"}</button>
      `;
      suggestionsList.appendChild(li);
    });
  }

  window.deletePost = async function (postId) {
    await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId: currUser.id }),
    });
    await renderFeed();
  };

  window.toggleLike = async function (postId, isLiked) {
    await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currUser.id, action: isLiked ? "unlike" : "like" }),
    });
    await renderFeed();
  };

  window.toggleComments = function (postId) {
    document.getElementById(`comments-${postId}`).classList.toggle("hidden");
  };

  window.addComment = async function (postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currUser.id, content }),
    });
    input.value = "";
    await renderFeed();
  };

  window.followUser = async function (userId) {
    await fetch(`/api/users/${userId}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: currUser.id }),
    });
    await renderFeed();
    await renderSuggestions();
  };

  window.unfollowUser = async function (userId) {
    await fetch(`/api/users/${userId}/follow`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: currUser.id }),
    });
    await renderFeed();
    await renderSuggestions();
  };

  await renderFeed();
  await renderSuggestions();
});
