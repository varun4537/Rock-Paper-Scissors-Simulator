import React from 'react';
import sheldonImg from '../Sheldon2.jpg';

// AGENT ICON REACT COMPONENTS
export const RockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22a2.8 2.8 0 0 0 2-1 2.8 2.8 0 0 0 2-4 2.8 2.8 0 0 0-1-2 2.8 2.8 0 0 0-4-1 2.8 2.8 0 0 0-2 0 2.8 2.8 0 0 0-1 4 2.8 2.8 0 0 0 4 4Z" />
    <path d="M12 22a2.8 2.8 0 0 0-2-1 2.8 2.8 0 0 0-2-4 2.8 2.8 0 0 0 1-2 2.8 2.8 0 0 0 4-1 2.8 2.8 0 0 0 2 0 2.8 2.8 0 0 0 1 4 2.8 2.8 0 0 0-4 4Z" />
    <path d="m14 17-1-1" />
    <path d="m10 17 1-1" />
    <path d="M16 13.7A2.8 2.8 0 0 0 15 12a2.8 2.8 0 0 0-4-1" />
    <path d="M9.4 6.6a2.8 2.8 0 0 0-2-1.1 2.8 2.8 0 0 0-2.3 2.3 2.8 2.8 0 0 0 1 2.3 2.8 2.8 0 0 0 4 1.1 2.8 2.8 0 0 0 .3-3.6Z" />
    <path d="M14.6 6.6a2.8 2.8 0 1 2-1.1 2.3 2.8 2.8 0 0 1-1 2.3 2.8 2.8 0 0 1-4 1.1 2.8 2.8 0 0 1-.3-3.6Z" />
    <path d="M12 12a2.8 2.8 0 0 0-1.4 5.1" />
  </svg>
);
export const PaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
export const ScissorsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" x2="8.12" y1="4" y2="15.88" />
    <line x1="14.47" x2="20" y1="14.48" y2="20" />
    <line x1="8.12" x2="12" y1="8.12" y2="12" />
  </svg>
);
export const LizardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18.5 4.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
        <path d="M5.5 4.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
        <path d="M12 16.5a4.5 4.5 0 0 0-8-2.5c0 2.5 2 4.5 4.5 4.5"/>
        <path d="M12 16.5a4.5 4.5 0 0 1 8-2.5c0 2.5-2 4.5-4.5 4.5"/>
        <path d="M12.5 8.5c0-1.5-1-3-2.5-3s-2.5 1.5-2.5 3"/>
        <path d="M17 12c-2.5 0-4.5-2-4.5-4.5"/>
        <path d="M7 12c2.5 0 4.5-2 4.5-4.5"/>
    </svg>
);
export const SpockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5.1 14.3C4 13.2 3 11.7 3 10V6a2 2 0 0 1 2-2h2.2c.4 0 .9.2 1.2.6L10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2l1.6-1.4c.3-.4.8-.6 1.2-.6H19a2 2 0 0 1 2 2v4c0 1.7-1 3.2-2.1 4.3" />
        <path d="m12 12-1.4 1.4" />
        <path d="M12 12l1.4 1.4" />
        <path d="M12 12v6" />
        <path d="M7.1 18.9c.9-.9 2.1-1.4 3.4-1.4" />
        <path d="M16.9 18.9c-.9-.9-2.1-1.4-3.4-1.4" />
        <path d="M10.5 22H12h1.5" />
    </svg>
);
export const SheldonIcon: React.FC<React.HTMLProps<HTMLImageElement>> = (props) => (
    <img
        src={sheldonImg}
        alt="Sheldon Cooper"
        className={`rounded-full object-cover ${props.className ?? ''}`}
        style={{ width: 60, height: 60, objectFit: 'cover', ...props.style }}
    />
);


export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);
export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);
export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
);
export const RestartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M21 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M21 21v-5h-5" />
    </svg>
);
