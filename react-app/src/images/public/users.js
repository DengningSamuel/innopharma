// Check authentication
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'signin.html';
        return false;
    }
    return token;
}

// Logout functionality
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
}

// Fetch and display users
async function fetchUsers() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch('/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.data);
        } else {
            document.getElementById('users-list').innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        document.getElementById('users-list').innerHTML = '<p>Error loading users</p>';
    }
}

// Display users in a table
function displayUsers(users) {
    const container = document.getElementById('users-list');
    
    if (users.length === 0) {
        container.innerHTML = '<p>No users found</p>';
        return;
    }

    const table = `
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead style="background: #33da2e; color: white;">
                <tr>
                    <th style="padding: 12px; text-align: left;">ID</th>
                    <th style="padding: 12px; text-align: left;">Username</th>
                    <th style="padding: 12px; text-align: left;">Email</th>
                    <th style="padding: 12px; text-align: left;">Full Name</th>
                    <th style="padding: 12px; text-align: left;">Phone</th>
                    <th style="padding: 12px; text-align: left;">Role</th>
                    <th style="padding: 12px; text-align: left;">Created</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px;">${user.user_id}</td>
                        <td style="padding: 12px;">${user.username}</td>
                        <td style="padding: 12px;">${user.email}</td>
                        <td style="padding: 12px;">${user.full_name || 'N/A'}</td>
                        <td style="padding: 12px;">${user.phone || 'N/A'}</td>
                        <td style="padding: 12px;"><span style="background: ${user.role === 'admin' ? '#dc3545' : '#28a745'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${user.role}</span></td>
                        <td style="padding: 12px;">${new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    fetchUsers();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});