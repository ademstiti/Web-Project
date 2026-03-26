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

                const likesArray = Array.isArray(post.likes) ? post.likes : [];
                const isLiked = likesArray.includes(freshUser.id);
                const likeCount = likesArray.length;

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
                            <p>❤</p>
                            ${likeCount}
                        </button>
                        <button class="post-action" onclick="toggleComments(${post.id})">
                            <p>📩</p>
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
                                        <div class="comment-time"> ${c.timestamp || ""}</div>
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

        suggestionsList.innerHTML = "";
        users.forEach(user => {
            if (user.id === freshUser.id) 
                return; 
            const li = document.createElement("li");
            li.className = "suggestion-item";

             const isFollowing = (freshUser.following || []).includes(user.id);
             let buttonText = "Follow";
             let action = `followUser(${user.id})`;

             if (isFollowing) {
                buttonText = "Unfollow";
                action = `unfollowUser(${user.id})`;
             }

             li.innerHTML = `<img src="assets/default-avatar.svg" class="suggestion-avatar">
            <div class="suggestion-info">
                <span>${user.username}</span>
            </div>
            <button onclick="${action}">${buttonText}</button>
        `;

        suggestionsList.appendChild(li);
            });
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
                    text: text,
                    timestamp: new Date().toISOString()
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

    function unfollowUser(userId) {
        let currUser = getCurrentUser();
        let users = getUsers();
        currUser.following = currUser.following.filter(id => id !== userId);

        users = users.map(user => {
            if (user.id === currUser.id) {
                return currUser;
            }
            if (user.id === userId) {
                user.followers = user.followers.filter(id => id !== currUser.id);
            }
            return user;
        });
        setCurrentUser(currUser);
        saveUsers(users);
        renderSuggestions();
        renderFeed();   

    }
    window.unfollowUser = unfollowUser;

    // Initial render
    renderFeed();
    renderSuggestions();
});

document.getElementById('edit-username-btn').addEventListener('click', function() {
    document.getElementById('username-edit-section').classList.remove('hidden');
    document.getElementById('profile-username').classList.add('hidden');
    document.getElementById('edit-username-btn').classList.add('hidden');
});

// Save the new username
document.getElementById('save-username-btn').addEventListener('click', function() {
    const newUsername = document.getElementById('username-input').textContent.trim();
    if (newUsername === "") {
        alert("Username cannot be empty.");
        return;
    }

    document.getElementById('profile-username').textContent = newUsername;
    document.getElementById('username-edit-section').classList.add('hidden');
    document.getElementById('profile-username').classList.remove('hidden');
    document.getElementById('edit-username-btn').classList.remove('hidden');
    alert("Username updated successfully!");
});

function isUsernameTaken(username) {
    const users = getUsers();
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return true;
        }
    }
    return false;
}

function updateUsername(newUsername) {
    if (isUsernameTaken(newUsername)) {
        alert("This username is already taken. Please choose another one.");
        return;
    }
    
    const currUser = getCurrentUser();
    currUser.username = newUsername;
    setCurrentUser(currUser);
    
    alert("Username updated successfully!");
    renderFeed();
}