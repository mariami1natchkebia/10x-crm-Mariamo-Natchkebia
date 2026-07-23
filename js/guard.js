//this is a function to check authorization
function checkAuth() {
    const session = localStorage.getItem("crm_session") || sessionStorage.getItem("crm_session");
    const currentPage = window.location.pathname;

    const isPublicPage = currentPage.includes("index.html") || currentPage.endsWith("/") || currentPage.includes("signup.html");
    const isProtectedPage = currentPage.includes("dashboard.html");

    if (isPublicPage && session) {
        window.location.href = "dashboard.html";
    }

    if (isProtectedPage && !session) {
        window.location.href = "index.html";
    }
}

checkAuth();


//logout
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("crm_session");
        sessionStorage.removeItem("crm_session");
        window.location.href = "index.html";
    });
}