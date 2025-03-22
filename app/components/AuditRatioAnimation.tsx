"use client";
import React, { useRef, useEffect } from "react";

interface AuditRatioAnimationProps {
  auditRatio: number;
}

const AuditRatioAnimation: React.FC<AuditRatioAnimationProps> = ({ auditRatio }) => {
  const progressPathRef = useRef<SVGPathElement>(null);
  const countUpRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (progressPathRef.current) {
      // Normalize auditRatio (expected 0–2) to a value between 0 and 1
      const targetProgress = Math.min(Math.max(auditRatio / 2, 0), 1);
      const path = progressPathRef.current;
      const pathLength = path.getTotalLength();

      // Set up the dash array and initial dash offset to hide the progress stroke
      path.style.strokeDasharray = `${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;

      let startTime: number | null = null;
      const duration = 3000;

      function animate(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease in-out cubic function
        const easeProgress =
          progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        // Calculate the current dash offset based on the target progress
        const currentOffset = pathLength - easeProgress * (targetProgress * pathLength);
        path.style.strokeDashoffset = `${currentOffset}`;
        if (elapsed < duration) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
    }
  }, [auditRatio]);

  // Animate the count-up text from 0 to auditRatio
  useEffect(() => {
    if (countUpRef.current) {
      animateCountUp(countUpRef.current, 0, auditRatio, 3000, 1);
    }
  }, [auditRatio]);

  function animateCountUp(
    el: HTMLElement,
    start: number,
    end: number,
    duration: number,
    decimalPlaces: number = 1
  ) {
    let startTime: number | null = null;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function update(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = easeInOutCubic(Math.min(elapsedTime / duration, 1));
      const current = start + (end - start) * progress;
      el.innerHTML = current.toFixed(decimalPlaces);
      if (elapsedTime < duration) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  return (
    <div className="audit-ratio-container flex flex-col items-center">
      <svg
        width="280"
        height="100"
        viewBox="0 0 280 100"
        className="mx-auto relative"
      >
        <defs>
          <filter id="big-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" />
          </filter>
          <clipPath id="cutoff">
            <rect x="0" y="0" width="280" height="100" />
          </clipPath>
        </defs>
        <path
          id="chart-path"
          d="M4.09863 85C29.6533 36.8181 80.3275 4 138.667 4C197.006 4 247.68 36.8181 273.235 85"
          stroke="#62676F"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Animated progress path */}
        <path
          id="chart-progress1"
          ref={progressPathRef}
          d="M4.09863 85C29.6533 36.8181 80.3275 4 138.667 4C197.006 4 247.68 36.8181 273.235 85"
          stroke="#2DB023"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#big-shadow)"
          clipPath="url(#cutoff)"
          fill="none"
        />
      </svg>
      <div className="balance-container text-center mt-4">
        <span className="label block text-gray-400 text-sm mb-1">Audit Ratio</span>
        <span className="amount2 text-white text-3xl font-bold">
          <span className="countup" ref={countUpRef}>0</span>
        </span>
      </div>
    </div>
  );
};

export default AuditRatioAnimation;
