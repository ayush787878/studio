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
        <path
          d="M13.5 3H6.5C4.567 3 3 4.567 3 6.5V17.5C3 19.433 4.567 21 6.5 21H10.5V13H15.5C17.433 13 19 11.433 19 9.5V6.5C19 4.567 17.433 3 15.5 3H13.5ZM10.5 5H13.5V8H15.5C16.3284 8 17 8.67157 17 9.5C17 10.3284 16.3284 11 15.5 11H10.5V5Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-bold text-lg text-foreground font-headline">
        Facelyze
      </span>
    </div>
  );
}
