import React from 'react';

export const PrimeAstraLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg
    className={`${className} shrink-0 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-transform duration-300 hover:scale-105`}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="paGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="paStarLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M250 18 Q250 65 285 65 Q250 65 250 112 Q250 65 215 65 Q250 65 250 18 Z" fill="url(#paStarLight)" />
    <path d="M220 85 C135 95 105 140 105 220 C105 330 175 425 250 480 C180 415 140 315 140 220 C140 160 160 125 220 105 Z" fill="url(#paGradLight)" />
    <path d="M280 85 C310 92 340 108 355 125 L328 148 C315 135 295 120 280 115 Z" fill="url(#paGradLight)" />
    <path d="M250 480 C290 435 345 375 370 300 L335 280 C315 340 275 395 250 435 Z" fill="url(#paGradLight)" />
    <path d="M135 430 C145 320 215 255 270 220 C320 185 350 125 370 55 L395 130 C370 180 335 225 285 260 C220 310 165 365 135 430 Z" fill="url(#paGradLight)" />
    <polygon points="380,55 305,108 335,122 360,170" fill="url(#paStarLight)" />
    <polygon points="380,55 335,122 360,170" fill="#6d28d9" />
    <path d="M250 140 L165 335 L200 335 L250 205 L275 270 L305 270 Z" fill="url(#paGradLight)" />
  </svg>
);