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
  // Handle Enter key press for login
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="mb-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-muted-foreground mb-0 block"
        >
          Username
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-muted-foreground"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 w-full"
            autoComplete="username"
          />
        </div>
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-muted-foreground mb-0 block"
        >
          Password
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-muted-foreground"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 w-full"
            autoComplete="current-password"
          />
        </div>
      </div>

      <button
        type="submit"
        onClick={handleLogin}
        className="w-full flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        Sign In
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a
          href="https://learn.reboot01.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Join Reboot01
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
