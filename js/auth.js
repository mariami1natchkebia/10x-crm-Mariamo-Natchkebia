const loginForm = document.querySelector(".login");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const errorMessage = document.querySelector("#errorMessage");
const rmCheck = document.querySelector("#rememberMe");


//checks local storage
const savedEmail = localStorage.getItem("email") || sessionStorage.getItem("email");
const savedPass = localStorage.getItem("password") || sessionStorage.getItem("password");

if (savedEmail && savedPass) {
    rmCheck.checked = true;
    passwordInput.value = savedPass;
    emailInput.value = savedEmail;
} else {
    rmCheck.checked = false;
    passwordInput.value = "";
    emailInput.value = "";
}

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
        
        // function for remember user
        if (rmCheck.checked && emailInput.value !== "" && passwordInput.value !== "") {
            localStorage.setItem("email", emailInput.value);
            localStorage.setItem("password", passwordInput.value);
            localStorage.setItem("checkbox", "true");

            sessionStorage.clear();
        } else {
            sessionStorage.setItem("email", emailInput.value);
            sessionStorage.setItem("password", passwordInput.value);
            
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.removeItem("checkbox");
        }

        const session = {
            userId: validUser.id,
            email: validUser.email,
            loggedIn: true
        };

        if (rmCheck.checked) {
            localStorage.setItem("crm_session", JSON.stringify(session));
            sessionStorage.removeItem("crm_session");
        } else {
            sessionStorage.setItem("crm_session", JSON.stringify(session));
            localStorage.removeItem("crm_session");
        }

        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Invalid email or password";
        errorMessage.style.display = "block";
    }
});