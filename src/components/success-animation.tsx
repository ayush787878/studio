
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function SuccessAnimation({ onFinished }: { onFinished: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000); // Start fading out after 2 seconds

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 2800); // Remove from DOM after fade out (2000ms + 800ms)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in-0 zoom-in-75 duration-1000">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/10" />
            <div className="absolute h-32 w-32 animate-pulse rounded-full bg-primary/5" />
            <Logo />
        </div>
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline text-muted-foreground">Analysis Complete</h1>
            <p className="text-5xl text-foreground mt-2 font-bold font-headline">facelyze.com</p>
        </div>
      </div>
    </div>
  );
}
