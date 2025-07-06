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
          d="M20.93,3.48,17.7,4.21l-.22,3.8H14.22l-.15,2.56h3.11l-.22,3.8H13.84l-3.23,9.51H6.23L9.79,15.1,6.56,4.21h4.51l.22,3.8h3.23l.15-2.56H11.56L14.79,1,19.3,2.37Z"
          fill="currentColor"
        />
        <path
          d="M22.37,14.09l-1.63.38-1.62-1.25,1.62-1.25.75,1.25.88-.38-.38-.87,1.25-1.63-1.25-1.62-1.63,1.25,1.25,1.62-.38.88Z"
          fill="currentColor"
        />
        <path
          d="M6.08,19.26l-1.63.37-1.62-1.25,1.62-1.25.75,1.25.88-.37-.38-.88,1.25-1.63-1.25-1.62-1.63,1.25,1.25,1.62-.37.88Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-semibold text-lg text-foreground">
        Facelyze
      </span>
    </div>
  );
}
