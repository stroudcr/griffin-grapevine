type IconProps = { className?: string };

/** A small grape cluster on the vine: the Grapevine's ornament for guide pages. */
export function VineIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 7.2V4.6c0-1.4.9-2.4 2.3-2.6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M12.6 5.2c1.3-2.2 4.4-3.2 7.4-2.1-.5 2.9-3.2 4.7-6.2 4.2"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 4.4c-1.1-.4-2.3-.1-3 .8" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
      <g fill="currentColor">
        <circle cx="7.6" cy="10" r="2.25" />
        <circle cx="12" cy="10" r="2.25" />
        <circle cx="16.4" cy="10" r="2.25" />
        <circle cx="9.8" cy="14" r="2.25" />
        <circle cx="14.2" cy="14" r="2.25" />
        <circle cx="12" cy="18" r="2.25" />
      </g>
    </svg>
  );
}

/** Thin rule, grape cluster, thin rule. Used under guide headings. */
export function VineRule({ className = "", tone = "text-accent" }: { className?: string; tone?: string }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-[linear-gradient(90deg,transparent,rgb(177_142_87_/_0.85))]" />
      <VineIcon className={`h-[18px] w-[18px] ${tone}`} />
      <span className="h-px w-14 bg-[linear-gradient(90deg,rgb(177_142_87_/_0.85),transparent)]" />
    </div>
  );
}
