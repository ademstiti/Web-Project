document.addEventListener("DOMContentLoaded", () => {
    let currUser = getCurrentUser();
    if (!currUser) {
        window.location.href = "index.html";
        return;
    }

    // Update UI with current user data
    document.getElementById("nav-username").textContent = currUser.username;
    document.getElementById("nav-avatar").src = "assets/default-avatar.svg"; // Assuming default, or add avatar to user object
    document.getElementById("composer-avatar").src = "assets/default-avatar.svg";

    const postInput = document.getElementById("post-input");
    const postBTN = document.getElementById("post-btn");
    const charCount = document.getElementById("post-char-count");
    const feedList = document.getElementById("feed-list");
    const suggestionsList = document.getElementById("suggestions-list");

    // Helper function to get fresh current user from localStorage
    function getFreshCurrUser() {
        return getCurrentUser();
    }

    // Handle post input and character count
    postInput.addEventListener("input", function() {
        const length = postInput.value.length;
        charCount.textContent = `${length} / 280`;
        postBTN.disabled = length === 0 || length > 280;
    });

    // Handle post submission
    postBTN.addEventListener("click", function() {
        const freshUser = getFreshCurrUser();
        const content = postInput.value.trim();
        if (content === "" || content.length > 280) return;

        const posts = getPosts();
        const newPost = {
            id: generateId(),
            userId: freshUser.id,
            username: freshUser.username,
            content: content,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };

        posts.push(newPost);
        savePosts(posts);

        postInput.value = "";
        charCount.textContent = "0 / 280";
        postBTN.disabled = true;
        renderFeed();
    });

    // Render the feed (posts from followed users + own posts)
    function renderFeed() {
        const freshUser = getFreshCurrUser();
        const posts = getPosts();
        const followedUserIds = freshUser.following || [];
        const feedPosts = posts.filter(post => followedUserIds.includes(post.userId) || post.userId === freshUser.id);

        feedList.innerHTML = "";
        if (feedPosts.length === 0) {
            feedList.innerHTML = '<p class="empty-state" id="empty-feed-msg">Follow some users to see their posts here, or make your first post above!</p>';
        } else {
            feedPosts.forEach(post => {
                const postCard = document.createElement("div");
                postCard.className = "post-card";

                const isLiked = (post.likes || []).includes(freshUser.id);
                const likeCount = (post.likes || []).length;

                postCard.innerHTML = `
                    <div class="post-header">
                        <img src="assets/default-avatar.svg" alt="${post.username}" class="post-avatar">
                        <div>
                            <span class="post-author">${post.username}</span>
                            <span class="post-time">${new Date(post.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-footer">
                        <button class="post-action ${isLiked ? 'liked' : ''}" onclick="likePost(${post.id})">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            ${likeCount}
                        </button>
                        <button class="post-action" onclick="toggleComments(${post.id})">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            ${(post.comments || []).length}
                        </button>
                        ${post.userId === freshUser.id ? `<button class="post-delete-btn" onclick="deletePost(${post.id})">Delete</button>` : ''}
                    </div>
                    <div class="post-comments hidden" id="comments-${post.id}">
                        <div class="comment-composer">
                            <img src="assets/default-avatar.svg" alt="${freshUser.username}" class="comment-avatar">
                            <input type="text" class="comment-input" placeholder="Write a comment..." id="comment-input-${post.id}">
                            <button class="btn-comment" onclick="addComment(${post.id})">Post</button>
                        </div>
                        <div class="comment-list" id="comment-list-${post.id}">
                            ${(post.comments || []).map(c => `
                                <div class="comment-item">
                                    <img src="assets/default-avatar.svg" alt="${c.username}" class="comment-avatar">
                                    <div class="comment-body">
                                        <div class="comment-author">${c.username}</div>
                                        <div class="comment-text">${c.text}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                feedList.appendChild(postCard);
            });
        }
    }

    // Render suggestions (users to follow)
    function renderSuggestions() {
        const freshUser = getFreshCurrUser();
        const users = getUsers();
        const followedUserIds = freshUser.following || [];
        const suggestions = users.filter(user => user.id !== freshUser.id && !followedUserIds.includes(user.id)).slice(0, 5);

        suggestionsList.innerHTML = "";
        if (suggestions.length === 0) {
            suggestionsList.innerHTML = '<li class="suggestions-empty">No suggestions yet.</li>';
        } else {
            suggestions.forEach(user => {
                const li = document.createElement("li");
                li.className = "suggestion-item";
                li.innerHTML = `
                    <img src="assets/default-avatar.svg" alt="${user.username}" class="suggestion-avatar">
                    <div class="suggestion-info">
                        <a href="#" class="suggestion-name">${user.username}</a>
                        <span class="suggestion-handle">@${user.username}</span>
                    </div>
                    <button class="btn-follow-small" onclick="followUser(${user.id})">Follow</button>
                `;
                suggestionsList.appendChild(li);
            });
        }
    }

    // Delete post
    window.deletePost = function(postId) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== postId);
        savePosts(posts);
        renderFeed();
    };

    // Like/unlike post
    window.likePost = function(postId) {
        const freshUser = getFreshCurrUser();
        let posts = getPosts();
        posts = posts.map(post => {
            if (post.id === postId) {
                if (!post.likes) post.likes = [];
                const index = post.likes.indexOf(freshUser.id);
                if (index > -1) {
                    post.likes.splice(index, 1);
                } else {
                    post.likes.push(freshUser.id);
                }
            }
            return post;
        });
        savePosts(posts);
        renderFeed();
    };

    // Toggle comments visibility
    window.toggleComments = function(postId) {
        const commentsDiv = document.getElementById(`comments-${postId}`);
        commentsDiv.classList.toggle("hidden");
    };

    // Add comment
    window.addComment = function(postId) {
        const freshUser = getFreshCurrUser();
        const input = document.getElementById(`comment-input-${postId}`);
        const text = input.value.trim();
        if (text === "") return;

        let posts = getPosts();
        posts = posts.map(post => {
            if (post.id === postId) {
                if (!post.comments) post.comments = [];
                post.comments.push({
                    username: freshUser.username,
                    text: text
                });
            }
            return post;
        });
        savePosts(posts);
        input.value = "";
        renderFeed();
    };

    // Follow user
    window.followUser = function(userId) {
        const freshUser = getFreshCurrUser();
        
        // Check if already following
        if (freshUser.following && freshUser.following.includes(userId)) {
            return;
        }

        let users = getUsers();
        users = users.map(user => {
            if (user.id === freshUser.id) {
                if (!user.following) user.following = [];
                // Only add if not already following
                if (!user.following.includes(userId)) {
                    user.following.push(userId);
                }
            }
            if (user.id === userId) {
                if (!user.followers) user.followers = [];
                // Only add if not already a follower
                if (!user.followers.includes(freshUser.id)) {
                    user.followers.push(freshUser.id);
                }
            }
            return user;
        });
        saveUsers(users);
        
        // Update currUser in memory and localStorage
        const updatedCurrUser = users.find(u => u.id === freshUser.id);
        currUser = updatedCurrUser;
        setCurrentUser(updatedCurrUser);
        
        renderFeed();
        renderSuggestions();
    };

    // Initial render
    renderFeed();
    renderSuggestions();
});