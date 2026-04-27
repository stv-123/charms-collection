// js/log-in.js

// Auto-redirect if already logged in
document.addEventListener("DOMContentLoaded", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = "shop.html";
    }

    // Attach login form listener after DOM is loaded
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return; // safety check

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // stop page refresh

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert("Login failed: " + error.message);
                return;
            }

            alert("Login successful!");

            // redirect to shop
            window.location.href = "shop.html";

        } catch (err) {
            alert("Unexpected error: " + err.message);
        }
    });
});