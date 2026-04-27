// js/auth.js

// Check if user is logged in
async function checkAuth() {

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {

        // user not logged in → redirect to login
        window.location.href = "login.html";

    }

}


// Logout function
async function logout() {

    await supabaseClient.auth.signOut();

    alert("Logged out successfully");

    window.location.href = "login.html";

}