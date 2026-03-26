document.addEventListener("DOMContentLoaded", ()=> {
    const form = document.querySelector(".auth-form");
    if (document.getElementById("reg-email")){
        form.addEventListener("submit",function(e){
            e.preventDefault();
            const username = document.getElementById("reg-username").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const password = document.getElementById("reg-password").value.trim();
            const confirmPassword = document.getElementById("reg-confirm").value.trim();

            clearError("register-error")

            if (!username || !email || !password || !confirmPassword) {
                showError("register-error" ,"please fill in all fields");
                return; 
            }
            if (password.length < 8) {
                showError("register-error", "Password must be at least 8 characters");
                return;
            }
            if (!/[A-Z]/.test(password)) {
                showError("register-error", "Password must contain at least one uppercase letter");
                return;
            }
            if (password !== confirmPassword) {
                showError("register-error", "passwords do not match");
                return;
            }
            
            const users = getUsers();

            const usedEmail = users.find(user => user.email === email);
            if(usedEmail) {
                showError("register-error", "email is already used");
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

            window.location.href = "index.html";

        });
    }

    if (document.getElementById("login-email")){
    form.addEventListener("submit", function(e){
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        clearError("login-error");

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if(!user) {
            showError("login-error", "incorrect email or password");
            return;
        }

        setCurrentUser(user);
        window.location.href = "feed.html";


    });
}

function showError(elementId,message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function clearError(elementId) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
}
});
