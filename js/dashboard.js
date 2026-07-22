const welcomeText = document.querySelector("#welcomeText");
const liveClock = document.querySelector("#liveClock");

const sessionData = localStorage.getItem("crm_session");

if (sessionData) {
    const user = JSON.parse(sessionData);
    
    const fullName = user.fullname || "User";
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
    
    savedClients.slice(0, 5).forEach((client, index) => {
        const formattedDate = client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : 'N/A';

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${client.name || ''}</td>
            <td>${client.company || ''}</td>
            <td><span class="badge">${client.status || ''}</span></td>
            <td>${formattedDate}</td>
        `;

        tableBody.appendChild(newRow);
    });
}

//this takes name and email from local storage and it will display on the aside
document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const sessionData = localStorage.getItem("crm_session");

    if (sessionData) {
        const user = JSON.parse(sessionData);
        
        if (profileName) {
            profileName.textContent = user.fullname || "User";
        }
        if (profileEmail) {
            profileEmail.textContent = user.email || "user@example.com";
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const clients = JSON.parse(localStorage.getItem("crm_clients")) || [];

    // Total Clients
    const totalClientsEl = document.getElementById("totalClients");
    if (totalClientsEl) {
        totalClientsEl.textContent = clients.length;
    }

    // Active Deals (არც Won და არც Lost)
    const activeDealsEl = document.getElementById("activeDeals");
    if (activeDealsEl) {
        const activeDealsCount = clients.filter(client => 
            client.status && client.status !== "Won" && client.status !== "Lost"
        ).length;
        activeDealsEl.textContent = activeDealsCount; 
    }

    // Won Revenue
    const wonRevenueEl = document.getElementById("wonRevenue");
    if (wonRevenueEl) {
        const totalWonRevenue = clients
            .filter(client => client.status === "Won")
            .reduce((sum, client) => sum + Number(client.dealValue || 0), 0);
        
        wonRevenueEl.textContent = `$${totalWonRevenue.toLocaleString()}`;
    }

    // New This Week (ზუსტი ფორმულა მოთხოვნიდან)
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

        const pipelineCounts = {
        Lead: clients.filter(clients => clients.status === "Lead").length,
        Contacted: clients.filter(clients => clients.status === "Contacted").length,
        Won: clients.filter(clients => clients.status === "Won").length,
        Lost: clients.filter(clients => clients.status === "Lost").length
    };

    const leadEl = document.getElementById("pipelineLead");
    const contactedEl = document.getElementById("pipelineContacted");
    const wonEl = document.getElementById("pipelineWon");
    const lostEl = document.getElementById("pipelineLost");

    if (leadEl) leadEl.textContent = pipelineCounts.Lead;
    if (contactedEl) contactedEl.textContent = pipelineCounts.Contacted;
    if (wonEl) wonEl.textContent = pipelineCounts.Won;
    if (lostEl) lostEl.textContent = pipelineCounts.Lost;
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