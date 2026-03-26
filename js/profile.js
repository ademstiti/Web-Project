document.addEventListener("DOMContentLoaded", function() {
    const currUser = getCurrentUser();
    const posts = getPosts();

    document.getElementById("profile-username").textContent = currUser.username;
    document.getElementById("profile-handle").textContent = "@" + currUser.username;
    document.getElementById("profile-bio").textContent = currUser.bio || "No bio yet.";

    const userPosts = posts.filter(post => post.userId === currUser.id);
    document.getElementById("stat-posts").textContent = userPosts.length;
    document.getElementById("stat-followers").textContent = currUser.followers ? currUser.followers.length : 0;
    document.getElementById("stat-following").textContent = currUser.following ? currUser.following.length : 0;
    
    const profilePostList = document.getElementById("profile-post-list");
    profilePostList.innerHTML = "";

    userPosts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = 
        `<h3>${post.username}</h3>
        <p>${post.content}</p>
        <small>${post.timestamp}</small>`;

        profilePostList.appendChild(postDiv);
    });

    const editUsernameBtn = document.getElementById('edit-username-btn');
    const usernameEditSection = document.getElementById('username-edit-section');
    const profileUsername = document.getElementById('profile-username');

    editUsernameBtn.classList.remove('hidden');
    editUsernameBtn.addEventListener('click', function() {
        usernameEditSection.classList.remove('hidden');
        profileUsername.classList.add('hidden');
        editUsernameBtn.classList.add('hidden');
    });

    document.getElementById('cancel-username-edit').addEventListener('click', function() {
        usernameEditSection.classList.add('hidden');
        profileUsername.classList.remove('hidden');
        editUsernameBtn.classList.remove('hidden');
    });

    document.getElementById('save-username-btn').addEventListener('click', function() {
        const newUsername = document.getElementById('username-input').value.trim();
        
        if (newUsername === "") {
            alert("Username cannot be empty.");
            return;
        }

        if (isUsernameTaken(newUsername)) {
            alert("This username is already taken. Please choose another one.");
            return;
        }

        currUser.username = newUsername;
        setCurrentUser(currUser);

        document.getElementById('profile-username').textContent = newUsername;
        
        usernameEditSection.classList.add('hidden');
        profileUsername.classList.remove('hidden');
        editUsernameBtn.classList.remove('hidden');
        
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

    const editBTN = document.getElementById("edit-profile-btn");
    const editForm = document.getElementById("edit-bio-form");
    const bioInput = document.getElementById("bio-input");
    const bioText = document.getElementById("profile-bio");
    const cancelBTN = document.getElementById("cancel-edit-btn");
    editBTN.classList.remove("hidden");
    editBTN.addEventListener("click", function() {
        editForm.classList.remove("hidden");
        bioInput.value = currUser.bio;
    });

    cancelBTN.addEventListener("click", function() {
        editForm.classList.add("hidden");
    });

    editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const newBio = bioInput.value.trim();
        currUser.bio = newBio;
        setCurrentUser(currUser);
        let users = getUsers();
        users = users.map(user => {
            if(user.id === currUser.id) {
                return currUser;
            }
            return user;
        });
        saveUsers(users);
        bioText.textContent = newBio || "No bio yet.";
        editForm.classList.add("hidden");
    });

});