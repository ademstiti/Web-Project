document.addEventListener("DOMContentLoaded", async function () {
  const currUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currUser) { window.location.href = "index.html"; return; }

  const res = await fetch(`/api/users/${currUser.id}`);
  const userData = await res.json();

  document.getElementById("profile-username").textContent = userData.username;
  document.getElementById("profile-handle").textContent = "@" + userData.username;
  document.getElementById("profile-bio").textContent = userData.bio || "No bio yet.";
  document.getElementById("stat-posts").textContent = userData.posts.length;
  document.getElementById("stat-followers").textContent = userData.followers.length;
  document.getElementById("stat-following").textContent = userData.following.length;

  const profilePostList = document.getElementById("profile-post-list");
  profilePostList.innerHTML = "";
  userData.posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
      <h3>${userData.username}</h3>
      <p>${post.content}</p>
      <small>${new Date(post.createdAt).toLocaleDateString()}</small>
    `;
    profilePostList.appendChild(postDiv);
  });

  const editUsernameBtn = document.getElementById("edit-username-btn");
  const usernameEditSection = document.getElementById("username-edit-section");
  const profileUsername = document.getElementById("profile-username");

  editUsernameBtn.classList.remove("hidden");
  editUsernameBtn.addEventListener("click", function () {
    usernameEditSection.classList.remove("hidden");
    profileUsername.classList.add("hidden");
    editUsernameBtn.classList.add("hidden");
  });

  document.getElementById("cancel-username-edit").addEventListener("click", function () {
    usernameEditSection.classList.add("hidden");
    profileUsername.classList.remove("hidden");
    editUsernameBtn.classList.remove("hidden");
  });

  const editBTN = document.getElementById("edit-profile-btn");
  const editForm = document.getElementById("edit-bio-form");
  const bioInput = document.getElementById("bio-input");
  const bioText = document.getElementById("profile-bio");
  const cancelBTN = document.getElementById("cancel-edit-btn");

  editBTN.classList.remove("hidden");
  editBTN.addEventListener("click", function () {
    editForm.classList.remove("hidden");
    bioInput.value = userData.bio;
  });

  cancelBTN.addEventListener("click", function () {
    editForm.classList.add("hidden");
  });

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newBio = bioInput.value.trim();
    bioText.textContent = newBio || "No bio yet.";
    editForm.classList.add("hidden");
  });
});
