const API_URL = "https://dummyjson.com/users";

const modalOverlay = document.getElementById('addClientModal');
const addClientBtn = document.querySelector('.add-client-btn'); 
const closeBtn = document.querySelector('.modal-close-btn');
const addClientForm = document.getElementById('addClientForm');


//this is a function to show a toast message after adding client
function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


//this function checks localStorage when the page loads, retrieves the saved list of clients 
// and builds a new table row (tr) for each one so they are neatly displayed in the table.
function loadClientsOnStartup(limit = null) {
    const savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
    const tableBody = document.querySelector('.clients-table tbody');

    if (!tableBody || savedClients.length === 0) return;

    tableBody.innerHTML = '';

    const clientsToDisplay = limit ? savedClients.slice(0, limit) : savedClients;

    clientsToDisplay.forEach((client, index) => {
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



//this slices only recent 5 clients
document.addEventListener('DOMContentLoaded', () => {
    const isDashboard = window.location.pathname.includes('dashboard');
    loadClientsOnStartup(isDashboard ? 5 : null); 
});


//when user clicks on "add client", modar overlay appears
if (addClientBtn) {
    addClientBtn.addEventListener('click', () => {
        if (modalOverlay) modalOverlay.style.display = 'flex';
    });
}

//close modal overlay
const closeModal = () => {
    if (modalOverlay) modalOverlay.style.display = 'none';
    if (addClientForm) addClientForm.reset();
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});


//this is async function for addding clients
if (addClientForm) {
    addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const company = document.getElementById('clientCompany').value.trim();
        const dealValue = document.getElementById('clientDealValue').value;
        const status = document.getElementById('clientStatus').value;
    
        //checks name
        if (name.length < 3) {
            showToast("Name must be at least 3 characters");
            return;
        }

        //checks mail
        if (!email.includes('@') || !email.includes('.')) {
            showToast("Please enter a valid email address");
            return;
        }


        //checks mail and send error messages
        const existingClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        if (existingClients.some(c => c.email.toLowerCase() === email.toLowerCase())) {
            showToast("A client with this email already exists");
            return;
        }
        if (phone !== '' && phone.length < 6) {
            showToast("Phone number looks too short");
            return;
        }
        if (isNaN(dealValue) || Number(dealValue) <= 0) {
            showToast("Deal value must be a positive number");
            return;
        }

        // creates a new client object with all the gathered form data

        const newClientData = {
            name,
            email,
            phone,
            company: company || '-',
            dealValue: Number(dealValue),
            status,
            createdAt: new Date().toISOString()
        };

        // sends the new client data to the server saves it to localStorage if successful, and updates the table.

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClientData)
            });

            if (response.ok) {
                const serverResult = await response.json();
                newClientData.id = serverResult.id || Date.now();

                existingClients.unshift(newClientData);
                localStorage.setItem('crm_clients', JSON.stringify(existingClients));

                closeModal();

                loadClientsOnStartup();

                showToast("Client added  successfully!");
            } else {
                showToast("Failed to add client on server.");
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Connection error.");
        }
    });
}