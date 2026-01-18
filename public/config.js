// config.js - API Configuration
const API_CONFIG = {
    // Change this to your deployed backend URL
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000'  // Local development
        : 'https://your-backend-api.herokuapp.com', // Production - UPDATE THIS
    
    ENDPOINTS: {
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        PROFILE: '/users/profile',
        MEDICINES: '/medecines',
        PHARMACIES: '/pharmacies',
        INVENTORY: '/inventory',
        SEARCH: '/search'
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}