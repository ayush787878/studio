export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path
          d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z"
          fill="url(#logo-gradient)"
          fillOpacity="0.1"
        />
        <path
          d="M13.8829 6.23438C14.1942 5.72378 13.8055 5 13.2348 5H9.76518C9.19447 5 8.80582 5.72378 9.11712 6.23438L12 11H9.5C8.94772 11 8.5 11.4477 8.5 12C8.5 12.5523 8.94772 13 9.5 13H12L9.11712 17.7656C8.80582 18.2762 9.19447 19 9.76518 19H13.2348C13.8055 19 14.1942 18.2762 13.8829 17.7656L11 13H13.5C14.0523 13 14.5 12.5523 14.5 12C14.5 11.4477 14.0523 11 13.5 11H11L13.8829 6.23438Z"
          fill="url(#logo-gradient)"
        />
      </svg>
      <span className="font-semibold text-lg text-foreground">
        Facelyze
      </span>
    </div>
  );
}
