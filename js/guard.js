//this is a function to check authorization
function checkAuth() {
    const session = localStorage.getItem("crm_session");
    const currentPage = window.location.pathname;

    const isPublicPage = currentPage.includes("index.html") || currentPage.endsWith("/") || currentPage.includes("login");

    if (isPublicPage && session) {
        window.location.href = "dashboard.html";
    }
}

checkAuth();