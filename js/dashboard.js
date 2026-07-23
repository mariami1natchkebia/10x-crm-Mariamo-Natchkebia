const welcomeText = document.querySelector("#welcomeText");
const liveClock = document.querySelector("#liveClock");

const currentUser = getCurrentUser();

if (currentUser) {
    const fullName = currentUser.fullname || "User";
    const firstName = fullName.split(" ")[0];

    welcomeText.textContent = `Welcome back, ${firstName}!`;
}

// live clock
function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    liveClock.textContent = `${dateStr} ${timeStr}`;
}

setInterval(updateClock, 1000);
updateClock(); 

const savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
const tableBody = document.querySelector('.clients-table tbody');

if (tableBody) {
    tableBody.innerHTML = '';
    
    savedClients.slice(0, 5).forEach((client) => {
        const initials = client.name ? client.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "CL";

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <div class="client-info-cell">
                    <div class="client-avatar">${initials}</div>
                    <div class="client-details-text">
                        <span class="client-name">${client.name}</span>
                        <span class="client-subtext">${client.company || 'N/A'}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge">${client.status || ''}</span></td>
        `;

        tableBody.appendChild(newRow);
    });
}

function getCurrentUser() {
    const sessionData = localStorage.getItem('crm_session');
    if (!sessionData) return null;
    let session;
    try {
        session = JSON.parse(sessionData);
    } catch (e) {
        return null;
    }
    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    return users.find(u =>
        (session.userId !== undefined && String(u.id) === String(session.userId)) ||
        (session.email && u.email === session.email)
    ) || null;
}

//this takes name and email from crm_users and displays them on the aside
document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const user = getCurrentUser();

    if (user) {
        if (profileName) profileName.textContent = user.fullname || "User";
        if (profileEmail) profileEmail.textContent = user.email || "user@example.com";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];

    // total clients
    const totalClientsEl = document.getElementById("totalClients");
    if (totalClientsEl) {
        totalClientsEl.textContent = clients.length;
    }

    // active deals
    const activeDealsEl = document.getElementById("activeDeals");
    if (activeDealsEl) {
        const activeDealsCount = clients.filter(client => 
            client.status && client.status !== "Won" && client.status !== "Lost"
        ).length;
        activeDealsEl.textContent = activeDealsCount; 
    }

    // won revenue
    const wonRevenueEl = document.getElementById("wonRevenue");
    if (wonRevenueEl) {
        const totalWonRevenue = clients
            .filter(client => client.status === "Won")
            .reduce((sum, client) => sum + Number(client.dealValue || 0), 0);
        
        wonRevenueEl.textContent = `$${totalWonRevenue.toLocaleString()}`;
    }

    // new this week
    const newThisWeekEl = document.getElementById("newThisWeek");
    if (newThisWeekEl) {
        const newClientsCount = clients.filter(client => {
            if (!client.createdAt) return false;
            const diffTime = Date.now() - new Date(client.createdAt).getTime();
            const diffDays = diffTime / 86400000;
            return diffDays <= 7;
        }).length;

        newThisWeekEl.textContent = newClientsCount;
    }

});



//this function counts and fills pipeline overview
document.addEventListener("DOMContentLoaded", () => {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];
    const totalClients = clients.length; 

    //this counts information from clients page
    const counts = {
        lead: clients.filter(clients => clients.status === "Lead").length,
        contacted: clients.filter(clients => clients.status === "Contacted").length,
        won: clients.filter(clients => clients.status === "Won").length,
        lost: clients.filter(clients => clients.status === "Lost").length
    };

    //this shows progress bar anyways
    function updatePipelineItem(countId, percentageId, progressId, count) {
        const countEl = document.getElementById(countId);
        const percentageEl = document.getElementById(percentageId);
        const progressEl = document.getElementById(progressId);

        if (countEl) countEl.textContent = count;
        
        const percentage = totalClients > 0 ? Math.round((count / totalClients) * 100) : 0;
        
        if (percentageEl) {
            percentageEl.textContent = `${percentage}%`;
        }
        
        if (progressEl) {
            progressEl.style.width = `${percentage}%`;
        }
    }


    //this updates status of overview
    updatePipelineItem("leadCount", "leadPercentage", "leadProgress", counts.lead);
    updatePipelineItem("contactedCount", "contactedPercentage", "contactedProgress", counts.contacted);
    updatePipelineItem("wonCount", "wonPercentage", "wonProgress", counts.won);
    updatePipelineItem("lostCount", "lostPercentage", "lostProgress", counts.lost);
});