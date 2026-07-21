const welcomeText = document.querySelector("#welcomeText");
const liveClock = document.querySelector("#liveClock");

const sessionData = localStorage.getItem("crm_session");

if (sessionData) {
    const user = JSON.parse(sessionData);
    
    const fullName = user.fullname || user.name || "User";
    const firstName = fullName.split(" ")[0];

    welcomeText.textContent = `Welcome back, ${firstName}!`;
}

// live clock
function updateClock() {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    liveClock.textContent = `${dateStr} ${timeStr}`;
}

setInterval(updateClock, 1000);
updateClock(); 