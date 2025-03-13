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
    // Helper to load external scripts dynamically
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
        // Load Three.js and VANTA.NET scripts
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        );
        // Once loaded, initialize the VANTA effect on the full-page background element.
        if (window.VANTA) {
          window.VANTA.NET({
            el: "#vanta-bg", // target the full-page background element
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xD4AF37,     //this changes line color
            backgroundColor: 0x000000, // this changes background color
          });
        }
      } catch (error) {
        console.error("Error initializing VANTA:", error);
      }
    };

    initVanta();
  }, []);

  return (
    <>
      {/* Full-page background container for VANTA */}
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
      {/* Login form container */}
      <div
        id="loginContainer"
        className="container active"
        style={{ position: "relative", zIndex: 1 }}
      >
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
    </>
  );
};

export default LoginForm;
