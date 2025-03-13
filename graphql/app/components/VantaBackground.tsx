// VantaBackground.tsx
import React, { useEffect } from "react";

const VantaBackground: React.FC = () => {
  useEffect(() => {
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
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js");
        if (window.VANTA) {
          window.VANTA.DOTS({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            showLines: false,
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
