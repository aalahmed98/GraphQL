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
      alert('Login successful!');
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('username', username);
      console.log('JWT stored:', data.token);
      displayProfile();
    } else {
      const errorMessage = data.error || data.message || "Unknown error";
      alert(`Login failed: ${errorMessage}`);
      console.error('Invalid credentials:', errorMessage);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network or server error during login. Check console for details.');
  }
}

async function fetchAuditRatio() {
  const jwt = localStorage.getItem('jwt');
  try {
    const response = await fetch('https://learn.reboot01.com/graphiql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        query: `
          {
            user {
              auditRatio
            }
          }
        `
      })
    });
    const data = await response.json();
    console.log('GraphQL response:', data);
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: error';
      return;
    }
    const auditRatio = data.data.user.auditRatio;
    document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: ' + auditRatio;
  } catch (error) {
    console.error('Error fetching audit ratio:', error);
    document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: error';
  }
}

function displayProfile() {
  const username = localStorage.getItem('username');
  if (username) {
    document.getElementById('welcomeMessage').innerText = `Hello, ${username}!`;
    // Call the fetchAuditRatio function to load and display audit ratio
    fetchAuditRatio();
    switchTo('profileContainer');
  } else {
    alert('Unable to retrieve user profile.');
  }
}


async function fetchAuditRatio() {
  const jwt = localStorage.getItem('jwt');
  try {
    const graphqlEndpoint = 'https://learn.reboot01.com/api/graphql';
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        query: `
          {
            user {
              auditRatio
            }
          }
        `
      })
    });
    const data = await response.json();
    console.log('GraphQL response:', data);
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: error';
      return;
    }
    const auditRatio = data.data.user.auditRatio;
    document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: ' + auditRatio;
  } catch (error) {
    console.error('Error fetching audit ratio:', error);
    document.getElementById('auditRatioDisplay').innerText = 'Audit Ratio: error';
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
