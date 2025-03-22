import React, { useEffect } from "react";

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

  useEffect(() => {
    // Helper function to load external scripts dynamically
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Load Three.js r134 and VANTA.NET scripts
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js");
        // Once loaded, initialize the VANTA.NET effect on the full-page background element.
        if ((window as any).VANTA) {
          (window as any).VANTA.NET({
            el: "#vanta-bg", // target the full-page background element
            mouseControls: true,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xd4af35,       // Gold color for the lines (#d4af35)
            backgroundColor: 0x171717, // Background set to #171717
            showDots: false,       // Only lines, no dots
          });
        }
      } catch (error) {
        console.error("Error initializing VANTA:", error);
      }
    };

    initVanta();
  }, []);

  // Handle Enter key press for login
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();  // Trigger login when Enter is pressed
    }
  };
  

  return (
    <>
      {/* Full-page VANTA background container */}
      <div
        id="vanta-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      ></div>
      {/* Centered login form container */}
      <div
        id="loginContainer"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "black", // Login card background (you can adjust this for contrast)
          padding: "2rem",
          borderRadius: "8px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          minWidth: "300px",
          boxShadow: "0 0 10px rgba(212, 175, 53, 0.8)",
        }}
      >
        <input
          placeholder="Username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          onKeyDown={handleKeyDown}  // Detect Enter key press
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            display: "flex",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          onKeyDown={handleKeyDown}  // Detect Enter key press
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            display: "flex",
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            fontSize: "15px",
            padding: "0.7em 2.7em",
            letterSpacing: "0.06em",
            borderRadius: "0.6em",
            overflow: "hidden",
            transition: "all 0.3s",
            lineHeight: "1.4em",
            border: "2px solid #D4AF35",
            background: "linear-gradient(to right, rgba(212, 175, 53, 0.1) 1%, transparent 40%, transparent 60%, rgba(212, 175, 53, 0.1) 100%)",
            color: "#D4AF35",
            boxShadow: "inset 0 0 10px rgba(212, 175, 53, 0.4), 0 0 9px 3px rgba(212, 175, 53, 0.1)",
          }}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default LoginForm;
