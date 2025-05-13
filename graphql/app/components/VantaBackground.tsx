"use client";

import React, { useEffect, useRef } from "react";

const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      const loadScript = async (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
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
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
          await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js");
          
          if (window.VANTA && vantaRef.current) {
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: false,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x6366f1, // Using our primary color
              backgroundColor: 0x0a0a0a, // Using our background color
              points: 8.00,
              maxDistance: 25.00,
              spacing: 20.00,
            });
          }
        } catch (error) {
          console.error("Error initializing VANTA:", error);
        }
      };

      initVanta();
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10"
      style={{ background: "var(--background)" }}
    />
  );
};

export default VantaBackground;
