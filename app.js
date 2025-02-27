const { useState, useEffect } = React;

function App() {
  // Retrieve any saved token and username from localStorage
  const [jwt, setJwt] = useState(localStorage.getItem('jwt') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [auditRatio, setAuditRatio] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
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
    setUserSkills(null);
    setUserLevel(null);
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

      async function fetchUserSkills() {
        try {
          const graphqlEndpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
          const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
              query: `
                query {
                    transaction(
                        where: {
                            _and: [
                                {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
                                {type: {_like: "%skill%"}},
                                {object: {type: {_eq: "project"}}},
                                {type: {_in: [
                                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                                    "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                                    "skill_tcp", "skill_git", "skill_go", "skill_js", 
                                    "skill_html", "skill_css", "skill_unix", "skill_docker", 
                                    "skill_sql"
                                ]}}
                            ]
                        }
                        order_by: [{type: asc}, {createdAt: desc}]
                        distinct_on: type
                    ) {
                        amount
                        type
                    }
                }    
            `
            })
          });
      
          const data = await response.json();
          console.log('GraphQL response:', data);
          
          if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            setUserSkills('error');
            return;
          }
      
          // Ensure data structure is correct
          if (data.data && data.data.transaction) {
            setUserSkills(data.data.transaction); // Store the array directly
          } else {
            setUserSkills('No data available');
          }
      
        } catch (error) {
          console.error('Error fetching user skills:', error);
          setUserSkills('error');
        }
      }

      //added function
      async function fetchUserLevel() {
        try {
          const graphqlEndpoint = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
          const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
              query: `
                {
                  transaction(
                      order_by: {amount: desc}
                      limit: 1
                      where: {
                          type: {_eq: "level"},
                          path: {_like: "/bahrain/bh-module%"}
                      }
                  ) {
                      amount
                  }
                }
              `
            })
          });
      
          const data = await response.json();
          console.log('GraphQL response:', data);
      
          if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            setUserLevel('error');
            return;
          }
      
          if (data.data && Array.isArray(data.data.transaction) && data.data.transaction.length > 0) {
            setUserLevel(data.data.transaction[0].amount); // Correctly accessing user level
          } else {
            setUserLevel('No data available');
          }
      
        } catch (error) {
          console.error('Error fetching user level:', error);
          setUserLevel('error');
        }
      }
      
      fetchAuditRatio();
      fetchUserSkills();
      fetchUserLevel();
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
      <p id="userLevelDisplay">
        User Level: {userLevel === null ? 'Loading...' : userLevel === 'error' ? 'Error fetching user level' : userLevel}
      </p>

      <div id="userSkillsDisplay">
  <h3>User Skills:</h3>
  {userSkills === null ? (
    'Loading...'
  ) : userSkills === 'error' ? (
    'Error fetching user skills'
  ) : Array.isArray(userSkills) && userSkills.length > 0 ? (
    <ul>
      {userSkills.map((skill, index) => (
        <li key={index}>
          {skill.type}: {skill.amount}
        </li>
      ))}
    </ul>
  ) : (
    'No skills found'
  )}
</div>

      <button id="logoutBtn" onClick={logout}>Logout</button>
    </div>
  );
}

// Render the React app into the #root element in index.html
ReactDOM.render(<App />, document.getElementById('root'));
