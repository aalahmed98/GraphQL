// VantaBackground.tsx
import React, { useEffect } from "react";

const VantaBackground: React.FC = () => {
  useEffect(() => {
    // Helper function to load external scripts dynamically
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Adjust the paths as needed (for example, if they're in your public folder)
        await loadScript("/three.r134.min.js");
        await loadScript("/vanta.net.min.js");

        if ((window as any).VANTA) {
          (window as any).VANTA.NET({
            el: "#vanta-bg", // target the full-page background element
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xd4af35,
            showDots: false,
          });
        }
      } catch (error) {
        console.error("Error initializing VANTA:", error);
      }
    };

    initVanta();
  }, []);

  return (
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
  );
};

export default VantaBackground;
