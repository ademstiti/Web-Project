document.addEventListener("DOMContentLoaded", () => {
    const currUser = getCurrentUser();

    const postInput = document.getElementById("post-input");
    const postBTN = document.getElementById("post-btn");
    const feedList = document.getElementById("feed-list");

    postInput.addEventListener("input", function() {
        if(postInput.value.trim() ==="") {
            postBTN.disabled = true;}
            else{
                postBTN.disabled = false;
            }
    });

    postBTN.addEventListener("click", function(){
        const content = postInput.value.trim();
        if(content === "") {
            return;}
        const posts = getPosts();
        const newPost = {
            id:generateId(),
            userId:currUser.id,
            username:currUser.username,
            content:content,
            timestamp: new Date().toISOString(),
            likes:0,
            comment:[]};

            posts.push(newPost);
            savePosts(posts);

            postInput.value = "";
            postBTN.disabled = true;
            renderPosts();
    })

    function renderPosts() {
        const posts = getPosts();
        feedList.innerHTML = "";
        posts.forEach(post => {
            const postDiv = document.createElement("div");

            postDiv.innerHTML = `<h3>${post.username}</h3>
            <p>${post.content}</p>
            <small>${post.timestamp}</small>
            <p>Likes: ${post.likes}</p>
            <button onclick="likePost(${post.id})">like</button>
            <button onclick="deletePost(${post.id})">Delete</button>
            <input id="comment-${post.id}" type="text" placeholder="Add a comment">
            <button onclick="addcomment(${post.id})">comment</button>
            ${(post.comment || []).map(c => `<p><b>${c.username}:</b> ${c.text}</p>`).join("")}`;
            feedList.appendChild(postDiv);
        });

        }

    function deletePost(postId) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== postId);
        savePosts(posts);
        renderPosts();
    }

    function likePost(postId) {
        let posts = getPosts();
        posts = posts.map(post => {
            if(post.id === postId){
                post.likes +=1;
            }
            return post;
        });

        savePosts(posts);
        renderPosts();
    }
    function addcomment(postId) {
        const commInput = document.getElementById(`comment-${postId}`);
        const text = commInput.value.trim();

        if(text ==="") {
            return;
        }

        let posts = getPosts();
        posts = posts.map(post => {
            if(post.id === postId){
                if(!post.comment) {
                    post.comment = [];
                }
                post.comment.push({
                    username:currUser.username,
                    text:text
                });   
            }
            return post;
        });
        savePosts(posts);
        renderPosts();
    }

window.deletePost = deletePost;
window.likePost = likePost;
window.addcomment = addcomment;
renderPosts();




})