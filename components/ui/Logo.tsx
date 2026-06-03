export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="fc-logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B5BD6" />
          <stop offset="1" stopColor="#7A6CF0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#fc-logo)" />
      {/* Стилизованная буква F / «ядро» фермы */}
      <path
        d="M14 11h13v4.4h-8.4v3.6H26v4.3h-7.4V29H14V11Z"
        fill="white"
        fillOpacity="0.96"
      />
      <circle cx="28.5" cy="27" r="2.6" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
