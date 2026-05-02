document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".auth-form");

  if (document.getElementById("reg-email")) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const confirmPassword = document.getElementById("reg-confirm").value.trim();

      clearError("register-error");

      if (!username || !email || !password || !confirmPassword) {
        showError("register-error", "please fill in all fields");
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

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showError("register-error", data.message || "Registration failed");
        return;
      }

      window.location.href = "index.html";
    });
  }

  if (document.getElementById("login-email")) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      clearError("login-error");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showError("login-error", data.message || "Incorrect email or password");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data));
      window.location.href = "feed.html";
    });
  }

  function showError(elementId, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.classList.remove("hidden");
  }

  function clearError(elementId) {
    const el = document.getElementById(elementId);
    el.textContent = "";
    el.classList.add("hidden");
  }
});
