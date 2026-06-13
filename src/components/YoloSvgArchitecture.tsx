"use client";

import { motion } from "framer-motion";

function SvgArchitecture({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id="a1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AA412A" stopOpacity="0.12" /><stop offset="50%" stopColor="#AA412A" stopOpacity="0.04" /><stop offset="100%" stopColor="#AA412A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="a2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.08" /><stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="300" r="4" fill="#AA412A" opacity="0.25" />
      <circle cx="480" cy="180" r="6" fill="#AA412A" opacity="0.2" />
      <circle cx="720" cy="450" r="8" fill="#AA412A" opacity="0.15" />
      <circle cx="960" cy="250" r="5" fill="#AA412A" opacity="0.25" />
      <circle cx="1200" cy="350" r="4" fill="#AA412A" opacity="0.2" />
      <circle cx="640" cy="650" r="5" fill="#AA412A" opacity="0.2" />
      <circle cx="320" cy="550" r="3" fill="white" opacity="0.1" />
      <circle cx="1080" cy="600" r="6" fill="white" opacity="0.08" />
      <path d="M160,300 L480,180 L720,450 L960,250 L1200,350" stroke="url(#a1)" strokeWidth="0.5" />
      <path d="M480,180 L640,650 L320,550" stroke="url(#a2)" strokeWidth="0.3" />
      <path d="M720,450 L1080,600 L960,250" stroke="url(#a1)" strokeWidth="0.3" />
      <circle cx="720" cy="420" r="240" stroke="white" strokeWidth="0.3" opacity="0.04" strokeDasharray="6 8" />
      <circle cx="720" cy="420" r="360" stroke="white" strokeWidth="0.2" opacity="0.02" strokeDasharray="3 12" />
    </svg>
  );
}

function SvgHeatmap({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <radialGradient id="h1" cx="30%" cy="40%" r="40%"><stop offset="0%" stopColor="#AA412A" stopOpacity="0.12" /><stop offset="50%" stopColor="#AA412A" stopOpacity="0.04" /><stop offset="100%" stopColor="#AA412A" stopOpacity="0" /></radialGradient>
        <radialGradient id="h2" cx="70%" cy="60%" r="35%"><stop offset="0%" stopColor="#159AA9" stopOpacity="0.08" /><stop offset="100%" stopColor="#159AA9" stopOpacity="0" /></radialGradient>
      </defs>
      <motion.ellipse cx="430" cy="360" rx="300" ry="200" fill="url(#h1)" animate={{ rx: [300, 320, 300], ry: [200, 210, 200] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <ellipse cx="1010" cy="540" rx="280" ry="180" fill="url(#h2)" />
    </svg>
  );
}

export { SvgArchitecture, SvgHeatmap };
export default SvgArchitecture;
