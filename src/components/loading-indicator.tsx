
"use client";

import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function LoadingIndicator({ className, text }: { className?: string, text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className={cn("relative flex items-center justify-center", className)}>
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/20" />
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/10" />
        <Logo />
      </div>
      {text && <p className="text-lg font-semibold text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}
