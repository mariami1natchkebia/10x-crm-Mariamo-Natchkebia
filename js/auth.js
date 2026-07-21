const API_URL = "https://dummyjson.com/users";

const loginForm = document.querySelector(".login");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const errorMessage = document.querySelector("#errorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;


    //this is a function for email validation
    if (!emailValue) {
        errorMessage.textContent = "Email is required";
        errorMessage.style.display = "block";
        errorMessage.style.color = "#ED4337";
        return;
    }


    //this is a function for password validation

    if (!passwordValue) {
        errorMessage.textContent = "Password is required";
        errorMessage.style.display = "block";
        errorMessage.style.color = "#ED4337";
        return;
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const users = data.users;

        const validUser = users.find(
            (user) => user.email.toLowerCase() === emailValue.toLowerCase() && user.password === passwordValue
        );

        if (validUser) {
            errorMessage.style.display = "none";
            localStorage.setItem("crm_session", JSON.stringify(validUser));
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = "Invalid email or password";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error( error);
        errorMessage.textContent = "Try again later!";
        errorMessage.style.display = "block";
    }
});


