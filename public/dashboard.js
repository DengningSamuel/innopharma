// Fetch and display dashboard stats
async function fetchDashboardStats() {
    try {
        const [users, medicines, pharmacies, inventory] = await Promise.all([
            fetch('/users').then(res => res.json()),
            fetch('/medecines').then(res => res.json()),
            fetch('/pharmacies').then(res => res.json()),
            fetch('/inventory').then(res => res.json()),
        ]);
        document.getElementById('users-count').textContent = users.count ?? users.data?.length ?? 0;
        document.getElementById('medicines-count').textContent = medicines.count ?? medicines.data?.length ?? 0;
        document.getElementById('pharmacies-count').textContent = pharmacies.count ?? pharmacies.data?.length ?? 0;
        document.getElementById('inventory-count').textContent = inventory.count ?? inventory.data?.length ?? 0;
    } catch (err) {
        document.getElementById('users-count').textContent = 'Error';
        document.getElementById('medicines-count').textContent = 'Error';
        document.getElementById('pharmacies-count').textContent = 'Error';
        document.getElementById('inventory-count').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', fetchDashboardStats);
