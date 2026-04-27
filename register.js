// js/register.js

async function register(event) {

    event.preventDefault(); // stop page refresh

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert("Error: " + error.message);
            return;
        }

        alert("Registration successful! You can now login.");

        // redirect to login page
        window.location.href = "log-in.html";

    } catch (err) {

        alert("Unexpected error: " + err.message);

    }

}