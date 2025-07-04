export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-primary"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        <path
          d="M8 14C8.44444 15.3333 10 17 12 17C14 17 15.5556 15.3333 16 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 9.5H9.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 9.5H15.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-bold text-lg text-foreground font-headline">
        Facelyz
      </span>
    </div>
  );
}
