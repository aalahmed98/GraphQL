async function login(username, password) {
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        // HTTP status indicates success—treat the login as successful.
        alert('Login successful!');
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('username', username);
        console.log('JWT stored:', data.token);
        displayProfile();
      } else {
        // Use whichever error property is available.
        const errorMessage = data.error || data.message || "Unknown error";
        alert(`Login failed: ${errorMessage}`);
        console.error('Invalid credentials:', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network or server error during login. Check console for details.');
    }
  }
  
  
  function displayProfile() {
    const username = localStorage.getItem('username');
    if (username) {
      document.getElementById('welcomeMessage').innerText = `Hello, ${username}!`;
      // Use the switchTo() function from switcher.js to show the profile container
      switchTo('profileContainer');
    } else {
      alert('Unable to retrieve user profile.');
    }
  }
  
  function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    switchTo('loginContainer');
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginBtn');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
      });
    }
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  });
  