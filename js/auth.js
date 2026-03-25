document.addEventListener("DOMContentLoaded", ()=> {
    const form = document.querySelector(".auth-form");
    if (document.getElementById("reg-email")){
        form.addEventListener("submit",function(e){
            e.preventDefault();
            const username = document.getElementById("reg-username").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const password = document.getElementById("reg-password").value.trim();
            const confirmPassword = document.getElementById("reg-confirm").value.trim();

            if (!username || !email || !password || !confirmPassword) {
                alert("please fill in all fields");
                return; 
            }
            if (password !== confirmPassword) {
                alert("passwords do not match");
                return;
            }
            
            const users = getUsers();

            const usedEmail = users.find(user => user.email === email);
            if(usedEmail) {
                alert("email is already used");
                return;
            }

            const newuser = {
                id:generateId(),
                username:username,
                email:email,
                password:password,
                bio:"",
                followers:[],
                following:[]
            };

            users.push(newuser);
            saveUsers(users);

            alert("account created");
            window.location.href = "index.html";

        });
    }

    if (document.getElementById("login-email")){
    form.addEventListener("submit", function(e){
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if(!user) {
            alert("incorrect email or password");
            return;
        }

        setCurrentUser(user);
        alert("login successful");
        window.location.href = "feed.html";


    });
}
});
