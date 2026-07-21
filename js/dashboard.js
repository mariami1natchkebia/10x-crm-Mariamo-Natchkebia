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

const savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
const tableBody = document.querySelector('.clients-table tbody');

if (tableBody) {
    tableBody.innerHTML = '';
    
    savedClients.slice(0, 5).forEach((client, index) => {
        const formattedDate = new Date(client.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${client.name}</td>
            <td>${client.company}</td>
            <td><span class="badge">${client.status}</span></td>
            <td>${formattedDate}</td>
        `;

        tableBody.appendChild(newRow);
    });
}