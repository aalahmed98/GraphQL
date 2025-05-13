"use client";

// AuditRatioAnimation.tsx
import React, { useEffect, useRef, useState } from "react";

interface AuditRatioAnimationProps {
  auditRatio: number;
}

const DURATION = 2000; // ms

const AuditRatioAnimation: React.FC<AuditRatioAnimationProps> = ({ auditRatio }) => {
  const [animatedRatio, setAnimatedRatio] = useState(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevRatioRef = useRef<number>(0);

  useEffect(() => {
    prevRatioRef.current = animatedRatio;
    setAnimatedRatio(0); // reset for new animation
    startTimeRef.current = null;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    function animate(ts: number) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // Ease in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const value = prevRatioRef.current + (auditRatio - prevRatioRef.current) * eased;
      setAnimatedRatio(value);
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedRatio(auditRatio);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditRatio]);

  // SVG progress is based on ratio (assuming max is 2.0)
  const normalized = Math.min(Math.max(animatedRatio / 2, 0), 1);
  const pathLength = 280;
  const strokeDashoffset = pathLength * (1 - normalized);

  return (
    <div className="audit-ratio-container flex flex-col items-center w-full">
      <svg
        width="100%"
        height="80"
        viewBox="0 0 280 100"
        className="mx-auto relative"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="big-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--primary)" />
          </filter>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        <path
          id="chart-path"
          d="M4.09863 85C29.6533 36.8181 80.3275 4 138.667 4C197.006 4 247.68 36.8181 273.235 85"
          stroke="var(--muted)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          id="chart-progress1"
          d="M4.09863 85C29.6533 36.8181 80.3275 4 138.667 4C197.006 4 247.68 36.8181 273.235 85"
          stroke="url(#progress-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#big-shadow)"
          fill="none"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
      </svg>
      <div className="balance-container text-center mt-2">
        <span className="label block text-muted-foreground text-sm mb-1">
          Audit Ratio
        </span>
        <span className="amount2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text">
          {animatedRatio.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default AuditRatioAnimation;
