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
    filterAndRenderClients(limit);
}

async function loadUsersFromApi() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        
        // Transform API users to match your CRM client structure if needed
        const apiClients = data.users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || '+995 500 000 000',
            company: user.company ? user.company.name : 'N/A',
            dealValue: Math.floor(Math.random() * 5000) + 500,
            status: 'Lead',
            createdAt: new Date().toISOString()
        }));

        localStorage.setItem('crm_clients', JSON.stringify(apiClients));
        loadClientsOnStartup();
    } catch (error) {
        console.log("Failed to load clients from API", error);
    }
}
//this is async function for deleting client
async function deleteClient(clientId) {
    if (!clientId) return;
    if (!confirm("Delete this client? This cannot be undone.")) return;

    try {
        await fetch(`https://dummyjson.com/users/${clientId}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.log("Server delete skipped");
    }


    //this filters clients and reneews it
    let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
    savedClients = savedClients.filter(client => String(client.id) !== String(clientId));
    localStorage.setItem('crm_clients', JSON.stringify(savedClients));


    //this deletes user from the page
    const deleteBtn = document.querySelector(`.delete-btn[data-id="${clientId}"]`);
    if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (row) row.remove();
    }

    loadClientsOnStartup();
    showToast("Client deleted");
}

document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const clientId = deleteBtn.getAttribute('data-id');
        deleteClient(clientId);
    }
});

//this slices only recent 5 clients
document.addEventListener('DOMContentLoaded', () => {
    const isDashboard = window.location.pathname.includes('dashboard');
    loadClientsOnStartup(isDashboard ? 5 : null); 
});


//when user clicks on "add client" modar overlay appears
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
        if (existingClients.some(c => c.email && c.email.toLowerCase() === email.toLowerCase())) {
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

        // sends the new client data to the server saves it to localStorage if successful and updates the table.

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClientData)
            });

            if (response.ok) {
                await response.json(); 
                newClientData.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
            newClientData.id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            existingClients.unshift(newClientData);
            localStorage.setItem('crm_clients', JSON.stringify(existingClients));

            closeModal();
            loadClientsOnStartup();
            showToast("Client added locally (Connection error).");
        }
    });
}

//function for user details
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('details-btn')) {
        const clientId = e.target.getAttribute('data-id');
        
        const savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        const client = savedClients.find(c => String(c.id) === String(clientId));

        if (client) {
            document.getElementById('detailName').textContent = client.name || 'N/A';
            document.getElementById('detailEmail').textContent = client.email || 'N/A';
            document.getElementById('detailPhone').textContent = client.phone || 'N/A';
            document.getElementById('detailCompany').textContent = client.company || '-';
            document.getElementById('detailStatus').textContent = client.status || 'Lead';
            document.getElementById('detailDealValue').textContent = client.dealValue ? `$${client.dealValue}` : 'N/A';
            
            const formattedDate = client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'N/A';
            document.getElementById('detailCreatedAt').textContent = formattedDate;

            
            const modal = document.getElementById('clientDetailsModal');
            if (modal) {
                modal.setAttribute('data-current-id', client.id);
                fillNotes(client.notes || []);
                modal.style.display = 'flex';
            }
        }
    }
});


//closing modal overlay
document.addEventListener('click', (e) => {
    const modal = document.getElementById('clientDetailsModal');
    if (!modal) return;

    if (e.target.id === 'closeDetailsModal' || e.target === modal) {
        modal.style.display = 'none';
    }
});


//function for adding notes
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-note-btn')) {
        const modal = document.getElementById('clientDetailsModal');
        const clientId = modal.getAttribute('data-current-id');
        const textarea = document.getElementById('noteInput');
        const noteText = textarea.value.trim();

        if (!noteText) return;

        const newNote = {
            text: noteText,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        savedClients = savedClients.map(client => {
            if (String(client.id) === String(clientId)) {
                if (!client.notes) client.notes = [];
                client.notes.unshift(newNote);
            }
            return client;
        });
        localStorage.setItem('crm_clients', JSON.stringify(savedClients));

        const updatedClient = savedClients.find(c => String(c.id) === String(clientId));
        fillNotes(updatedClient.notes);
        textarea.value = '';
    }
});

//function for reminder
function fillNotes(notes) {
    const container = document.getElementById('notesListContainer');
    if (!container) return;
    container.innerHTML = '';

    notes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'note-item';
        item.innerHTML = `
            <div class="note-date">${note.date}</div>
            <p class="note-text">${note.text}</p>
        `;
        container.appendChild(item);
    });
}


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('reminder-btn')) {
        const modal = document.getElementById('clientDetailsModal');
        const clientId = modal.getAttribute('data-current-id');

        let savedClients = JSON.parse(localStorage.getItem('crm_clients')) || [];
        const client = savedClients.find(c => String(c.id) === String(clientId));
        const clientName = client ? client.name : 'Client';

        showToast("Reminder set ");

        setTimeout(() => {
            showToast(`Follow up: ${clientName}`);
        }, 6000);
    }
});



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


//function for filter and search
let currentFilter = 'All'; 
let currentSearch = '';

const filterChips = document.querySelectorAll('.filter-chips .chip'); 
const searchInput = document.querySelector('.filters-panel .search-box input');
const sortSelect = document.querySelector('.sort-box select');


filterChips.forEach(chip => { 
    chip.addEventListener('click', (e) => {
        filterChips.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.textContent.trim(); 
        filterAndRenderClients();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndRenderClients();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        filterAndRenderClients();
    });
}

function getVisibleClients() {
    let clients = JSON.parse(localStorage.getItem('crm_clients')) || []; 

    if (currentFilter !== 'All') {
        clients = clients.filter(client => client.status && client.status.toLowerCase() === currentFilter.toLowerCase());
    }

    if (currentSearch.trim() !== '') {
        const searchText = currentSearch.toLowerCase();
        clients = clients.filter(client => 
            (client.name && client.name.toLowerCase().includes(searchText)) || 
            (client.company && client.company.toLowerCase().includes(searchText))
        );
    }

    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === 'newest') {
            clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortValue === 'oldest') {
            clients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortValue === 'name') {
            clients.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
    }

    return clients;
}

function filterAndRenderClients(limit = null) {
    let visibleClients = getVisibleClients();
    
    if (limit) {
        visibleClients = visibleClients.slice(0, limit);
    }

    const tableBody = document.querySelector('.clients-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (visibleClients.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No clients found</td></tr>`;
        return;
    }

    visibleClients.forEach((client, index) => {
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
            <td>
                <button class="details-btn" data-id="${client.id}">Details</button>
                <button class="delete-btn" data-id="${client.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('crm_clients') || JSON.parse(localStorage.getItem('crm_clients')).length === 0) {
        loadUsersFromApi();
    } else {
        loadClientsOnStartup();
    }
});