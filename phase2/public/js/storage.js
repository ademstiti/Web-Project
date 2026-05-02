function saveUsers (users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function savePosts (posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function generateId() {
    return Date.now();
}