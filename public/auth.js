// auth.js - Sign In & Sign Up Functionality

// Toggle Password Visibility
function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  const button = event.target;

  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

// Sign Up Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validation
    if (!fullname.trim()) {
      showError('Please enter your full name');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      showError('Please enter your phone number');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!terms) {
      showError('You must agree to the Terms & Conditions');
      return;
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          full_name: fullname,
          phone: phone
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          window.location.href = 'signin.html';
        }, 1500);
      } else {
        showError(data.error || 'Registration failed');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  });
}

// Sign In Form Handler
const signinForm = document.getElementById('signinForm');
if (signinForm) {
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      showError('Please enter your password');
      return;
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store the JWT token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Sign in successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showError(data.error || 'Login failed');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  });
}

// Show Error Message
function showError(message) {
  const notification = createNotification(message, 'error');
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Show Success Message
function showSuccess(message) {
  const notification = createNotification(message, 'success');
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Create Notification Element
function createNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'error' ? '❌' : '✅'}</span>
      <p>${message}</p>
    </div>
  `;

  // Add styles dynamically if not already in CSS
  if (!document.querySelector('style[data-notification]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification', 'true');
    style.innerHTML = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 90vw;
        z-index: 1000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
      }

      .notification.show {
        opacity: 1;
        transform: translateX(0);
      }

      .notification-error {
        border-left: 4px solid #ff6b6b;
      }

      .notification-success {
        border-left: 4px solid #39ff14;
      }

      .notification-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .notification-content p {
        margin: 0;
        font-size: 0.95rem;
        color: #333;
        font-weight: 500;
      }

      @media (max-width: 480px) {
        .notification {
          left: 10px;
          right: 10px;
          min-width: auto;
          top: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  return notification;
}

// Add Enter key support for forms
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const form = e.target.closest('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      }
    }
  }
});
