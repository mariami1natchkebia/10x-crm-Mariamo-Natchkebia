const loginForm = document.querySelector(".login");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const errorMessage = document.querySelector("#errorMessage");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;

    if (!emailValue) {
        errorMessage.textContent = "Email is required";
        errorMessage.style.display = "block";
        return;
    }

    if (!passwordValue) {
        errorMessage.textContent = "Password is required";
        errorMessage.style.display = "block";
        return;
    }

    const users = JSON.parse(localStorage.getItem("crm_users")) || [];

    const validUser = users.find(
        (user) => user.email.toLowerCase() === emailValue && user.password === passwordValue
    );

    if (validUser) {
        errorMessage.style.display = "none";
        const session = {
            userId: validUser.id,
            email: validUser.email,
            loggedIn: true
        };
        localStorage.setItem("crm_session", JSON.stringify(session));
        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Invalid email or password";
        errorMessage.style.display = "block";
    }
});