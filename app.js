// app.js - GraphQL Profile with JWT Authentication (Domain: learn.reboot01.com)

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
      
      // Clear old alerts and notify instantly
      alert(data.error ? `Login failed: ${data.error}` : 'Login successful!');
      
      if (response.ok && data.token) {
        localStorage.setItem('jwt', data.token);
        console.log('JWT stored:', data.token);
        displayProfile();
      } else {
        console.error('Invalid credentials:', data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network or server error during login. Check console for details.');
    }
  }
  
  async function queryGraphQL(query) {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('No valid JWT found. Please log in first.');
      return;
    }
    
    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    console.log('GraphQL Query Result:', result);
    
    if (response.ok && result.data) {
      return result.data;
    } else {
      alert(`GraphQL Error: ${result.errors?.[0]?.message || 'Unknown error'}`);
      throw new Error('GraphQL query failed. See console for details.');
    }
  }
  
  // Ensure the login button works by adding event listeners
  window.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginBtn');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
      });
    }
  });
  
  console.log('App.js loaded. Listening for login attempts.');
  