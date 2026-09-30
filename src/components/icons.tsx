import React from 'react';
import styles from './icons.module.css';

export type IconSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type IconProps = { className?: string; fill?: string; size?: IconSize };

function SvgIcon({
  className,
  fill = 'none',
  size = 'sm',
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={[styles.icon, styles[size], className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function GithubIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </SvgIcon>
  );
}

export function LinkedinIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size} fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.09h4.56V23H.22zM8.34 8.09h4.37v2.03h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-7.28c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.9-2.8 3.86V23H8.34z" />
    </SvgIcon>
  );
}

export function SunIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </SvgIcon>
  );
}

export function MoonIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </SvgIcon>
  );
}

export function MapPinIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </SvgIcon>
  );
}

export function GlobeIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </SvgIcon>
  );
}

export function ArrowLeftIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </SvgIcon>
  );
}

export function ArrowRightIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </SvgIcon>
  );
}

export function ChevronLeftIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M15 18l-6-6 6-6" />
    </SvgIcon>
  );
}

export function ChevronRightIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M9 18l6-6-6-6" />
    </SvgIcon>
  );
}

export function XIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M18 6 6 18M6 6l12 12" />
    </SvgIcon>
  );
}

export function MenuIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </SvgIcon>
  );
}

export function UsersIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </SvgIcon>
  );
}

export function Code2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </SvgIcon>
  );
}

export function BriefcaseIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="2" y="7" width="20" height="14" rx="2" />
    </SvgIcon>
  );
}

export function CalendarDaysIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </SvgIcon>
  );
}

export function ClockIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </SvgIcon>
  );
}

export function UserXIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="10" cy="7" r="4" />
      <path d="M14.3 21H5a2 2 0 0 1-2-2V9a2 2 0 0 1 .89-1.66l3.52-2.97" />
      <path d="M15 7h4.5M17.5 4.5l3 3-3 3" />
    </SvgIcon>
  );
}

export function SearchIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </SvgIcon>
  );
}

export function Building2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6" />
      <path d="M18 12h2a2 2 0 0 1 2 2v6" />
      <path d="M10 16h4" />
      <path d="M10 8h4" />
    </SvgIcon>
  );
}

export function MessageSquareIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </SvgIcon>
  );
}

export function SendIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </SvgIcon>
  );
}

export function CheckCircle2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </SvgIcon>
  );
}

export function AlertCircleIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </SvgIcon>
  );
}

export function MailIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </SvgIcon>
  );
}

export function LockIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgIcon>
  );
}

export function UserIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  );
}

export function DollarSignIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </SvgIcon>
  );
}

export function ExternalLinkIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </SvgIcon>
  );
}

export function BuildingIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </SvgIcon>
  );
}

export function SparklesIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </SvgIcon>
  );
}

export function ShieldIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </SvgIcon>
  );
}

export function HeartIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </SvgIcon>
  );
}

export function CompassIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 15 9 22 9 17 14 14 22 10 14 3 9 10 9 12 2" />
    </SvgIcon>
  );
}

export function StarIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 7 8.26 12 2" />
    </SvgIcon>
  );
}

export function Share2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 12 17l3.5-3.5M8.59 8.49 12 5l3.5 3.5" />
    </SvgIcon>
  );
}

export function ShieldCheckIcon({ className, size, fill }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </SvgIcon>
  );
}
export function UserCircle2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="2" />
      <path d="M16.2 16.2c-1.2-1-2.6-1.7-4.2-1.7s-3 .7-4.2 1.7" />
    </SvgIcon>
  );
}

export function PlusIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </SvgIcon>
  );
}

export function SaveIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </SvgIcon>
  );
}

export function Trash2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </SvgIcon>
  );
}

export function Edit3Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </SvgIcon>
  );
}

export function MapIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <polygon points="3 6 9 3 15 6 21 4 21 18 15 20 9 17 3 21" />
      <path d="M9 3v18" />
      <path d="M15 6v14" />
    </SvgIcon>
  );
}

export function Flower2Icon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3V8m-3 3a3 3 0 1 0-3-3m3 3h1m-1 0v1m9-1a3 3 0 1 1-3 3m3-3a3 3 0 1 0 3 3m-3-3v1M15 12a3 3 0 1 1-3 3m3-3a3 3 0 1 0 3 3m-3-3h-1m1 0v1M12 15v7" />
    </SvgIcon>
  );
}

export function LayoutDashboardIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </SvgIcon>
  );
}

export function LogOutIcon({ className, size }: IconProps) {
  return (
    <SvgIcon className={className} size={size}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </SvgIcon>
  );
}

export type LogoIconProps = {
  /** px size of the rendered square. Default: 36 */
  size?: number;
  className?: string;
  /**
   * 'dark'  — deep navy bg (#0c1f2e), brackets in navy  — for dark surfaces
   * 'light' — Pantone 2026 C warm-white bg (#F5F0E8), brackets in warm-white — for light surfaces
   * 'auto'  — (default) switches via CSS: light theme uses the light variant,
   *            dark theme uses the dark variant. Requires the parent page to
   *            toggle a `.dark` class on <html> (the project standard).
   */
  variant?: 'dark' | 'light' | 'auto';
};

const BRAND_BG_DARK  = '#0c1f2e';
const BRAND_BG_LIGHT = '#F5F0E8'; // Pantone 2026 C warm white

/**
 * ManausDev brand mark — inline SVG that mirrors the favicon:
 * rounded square → gradient diamond → </> code brackets.
 *
 * Use variant="auto" (default) in the Header so the logo adapts to
 * the active color scheme without any JS re-render.
 */
export function LogoIcon({ size = 36, className, variant = 'auto' }: LogoIconProps) {
  // Stable gradient IDs — suffixed by variant to avoid collisions when
  // both variants are rendered on the same page (e.g., in Storybook).
  const gradId = `md-diamond-${variant}`;

  if (variant === 'auto') {
    // Render both rects and switch via CSS `display`. The gradient itself is
    // shared — only the background rect and bracket stroke color differ.
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="ManausDev logo"
      >
        <defs>
          <linearGradient id="md-diamond-auto" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#009BFD" />
            <stop offset="50%"  stopColor="#02B8B5" />
            <stop offset="100%" stopColor="#4BD76D" />
          </linearGradient>
        </defs>

        {/* Light theme layer — hidden in dark mode via CSS */}
        <g className="logo-layer-light">
          <rect width="36" height="36" rx="8" fill={BRAND_BG_LIGHT} />
          <rect x="9" y="9" width="18" height="18" rx="2"
            fill="url(#md-diamond-auto)" transform="rotate(45 18 18)" />
          <path d="M14 15.5 L11 18 L14 20.5"
            stroke={BRAND_BG_LIGHT} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M22 15.5 L25 18 L22 20.5"
            stroke={BRAND_BG_LIGHT} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M17.5 21.5 L18.5 14.5"
            stroke={BRAND_BG_LIGHT} strokeWidth="2"
            strokeLinecap="round" fill="none" />
        </g>

        {/* Dark theme layer — hidden in light mode via CSS */}
        <g className="logo-layer-dark">
          <rect width="36" height="36" rx="8" fill={BRAND_BG_DARK} />
          <rect x="9" y="9" width="18" height="18" rx="2"
            fill="url(#md-diamond-auto)" transform="rotate(45 18 18)" />
          <path d="M14 15.5 L11 18 L14 20.5"
            stroke={BRAND_BG_DARK} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M22 15.5 L25 18 L22 20.5"
            stroke={BRAND_BG_DARK} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M17.5 21.5 L18.5 14.5"
            stroke={BRAND_BG_DARK} strokeWidth="2"
            strokeLinecap="round" fill="none" />
        </g>
      </svg>
    );
  }

  const bg      = variant === 'dark' ? BRAND_BG_DARK : BRAND_BG_LIGHT;
  const brackets = bg; // bracket stroke matches bg so they read as cut-outs

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="ManausDev logo"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#009BFD" />
          <stop offset="50%"  stopColor="#02B8B5" />
          <stop offset="100%" stopColor="#4BD76D" />
        </linearGradient>
      </defs>

      <rect width="36" height="36" rx="8" fill={bg} />

      <rect x="9" y="9" width="18" height="18" rx="2"
        fill={`url(#${gradId})`} transform="rotate(45 18 18)" />

      <path d="M14 15.5 L11 18 L14 20.5"
        stroke={brackets} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 15.5 L25 18 L22 20.5"
        stroke={brackets} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17.5 21.5 L18.5 14.5"
        stroke={brackets} strokeWidth="2"
        strokeLinecap="round" fill="none" />
    </svg>
  );
}
