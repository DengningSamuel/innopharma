// Check authentication on page load
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'signin.html';
        return false;
    }
    return true;
}

// Logout functionality
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
}

// Fetch and display dashboard stats
async function fetchDashboardStats() {
    try {
        const [users, medicines, pharmacies, inventory] = await Promise.all([
            fetch('/users/count').then(res => res.json()),
            fetch('/medecines').then(res => res.json()),
            fetch('/pharmacies').then(res => res.json()),
            fetch('/inventory').then(res => res.json()),
        ]);
        document.getElementById('users-count').textContent = users.count ?? users.data?.length ?? 0;
        document.getElementById('medicines-count').textContent = medicines.count ?? medicines.data?.length ?? 0;
        document.getElementById('pharmacies-count').textContent = pharmacies.count ?? pharmacies.data?.length ?? 0;
        document.getElementById('inventory-count').textContent = inventory.count ?? inventory.data?.length ?? 0;
    } catch (err) {
        console.error('Dashboard stats error:', err);
        document.getElementById('users-count').textContent = 'Error';
        document.getElementById('medicines-count').textContent = 'Error';
        document.getElementById('pharmacies-count').textContent = 'Error';
        document.getElementById('inventory-count').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    if (!checkAuth()) return;
    
    // Load dashboard stats
    fetchDashboardStats();
    
    // Add logout button event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
