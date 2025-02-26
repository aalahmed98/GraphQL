const { useState, useEffect } = React;

function App() {
  // Retrieve any saved token and username from localStorage
  const [jwt, setJwt] = useState(localStorage.getItem('jwt') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [auditRatio, setAuditRatio] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Login function using your provided API endpoint
  async function login(usernameInput, passwordInput) {
    try {
      const credentials = btoa(`${usernameInput}:${passwordInput}`);
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
        // Store token and username in localStorage and state
        localStorage.setItem('jwt', data);
        localStorage.setItem('username', usernameInput);
        setJwt(data);
        setUsername(usernameInput);
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

  // Logout function clears stored data and resets state
  function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    setJwt('');
    setUsername('');
    setAuditRatio(null);
  }

  // useEffect hook to fetch audit ratio whenever a valid JWT exists
  useEffect(() => {
    if (jwt) {
      async function fetchAuditRatio() {
        try {
          const graphqlEndpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
          const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
              query:`
                    {
                      user {
                        auditRatio
                        totalUp
                        totalDown
                      }
                    }
                  `
            })
          });
          const data = await response.json();
          console.log('GraphQL response:', data);
          
          if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            setAuditRatio('error');
            return;
          }
      
          // Fix: Accessing auditRatio correctly from user array
          if (data.data && data.data.user.length > 0) {
            setAuditRatio(data.data.user[0].auditRatio);
          } else {
            setAuditRatio('No data available');
          }
          
        } catch (error) {
          console.error('Error fetching audit ratio:', error);
          setAuditRatio('error');
        }
      }
      
      fetchAuditRatio();
    }
  }, [jwt]);

  // Render the login form if the user is not logged in
  if (!jwt) {
    return (
      <div id="loginContainer" className="container active">
        <h2>Login</h2>
        <input
          id="username"
          placeholder="Username or Email"
          value={loginUsername}
          onChange={e => setLoginUsername(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
        />
        <button id="loginBtn" onClick={() => login(loginUsername, loginPassword)}>
          Login
        </button>
      </div>
    );
  }

  // Render the profile view with the audit ratio if the user is logged in
  return (
    <div id="profileContainer" className="container active">
      <h1 id="welcomeMessage">Hello, {username}!</h1>
      <p id="auditRatioDisplay">
        Audit Ratio: {auditRatio === null ? 'Loading...' : auditRatio === 'error' ? 'Error fetching audit ratio' : auditRatio}
      </p>
      <button id="logoutBtn" onClick={logout}>Logout</button>
    </div>
  );
}

// Render the React app into the #root element in index.html
ReactDOM.render(<App />, document.getElementById('root'));
