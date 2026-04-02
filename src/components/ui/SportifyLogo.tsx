interface SportifyLogoProps {
  size?: number;
  className?: string;
  /** 'color' = navy fill, 'white' = all white, 'navy' = navy on transparent */
  variant?: 'color' | 'white' | 'navy';
}

export default function SportifyLogo({ size = 36, variant = 'color', className = '' }: SportifyLogoProps) {
  const fieldColor = variant === 'white' ? '#ffffff' : '#0f2d5e';
  const lineColor = variant === 'white' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.6)';
  const ballColor = variant === 'white' ? '#ffffff' : '#38bdf8';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sportify logo"
    >
      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill={fieldColor} />

      {/* Field outline - inner rounded rect */}
      <rect x="6" y="8" width="28" height="24" rx="3" stroke={lineColor} strokeWidth="1.4" fill="none" />

      {/* Center line (vertical) */}
      <line x1="20" y1="8" x2="20" y2="32" stroke={lineColor} strokeWidth="1.2" />

      {/* Center circle */}
      <circle cx="20" cy="20" r="4" stroke={lineColor} strokeWidth="1.2" fill="none" />

      {/* Left penalty box */}
      <rect x="6" y="14" width="7" height="12" rx="1" stroke={lineColor} strokeWidth="1.1" fill="none" />

      {/* Right penalty box */}
      <rect x="27" y="14" width="7" height="12" rx="1" stroke={lineColor} strokeWidth="1.1" fill="none" />

      {/* Ball (top-right quadrant) */}
      <circle cx="28" cy="12" r="4" fill={ballColor} />
      {/* Ball pattern lines */}
      <path d="M25.5 10.5 L30.5 13.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <path d="M26 13.5 L30 10.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
