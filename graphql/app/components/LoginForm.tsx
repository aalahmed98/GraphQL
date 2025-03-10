import React from "react";

interface LoginFormProps {
  loginUsername: string;
  loginPassword: string;
  setLoginUsername: (value: string) => void;
  setLoginPassword: (value: string) => void;
  handleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginUsername,
  loginPassword,
  setLoginUsername,
  setLoginPassword,
  handleLogin,
}) => {
  return (
    <div id="loginContainer" className="container active">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
