'use client';

import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-1000">
        <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/10" />
            <div className="absolute h-32 w-32 animate-pulse rounded-full bg-primary/5" />
            <Logo />
        </div>
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline text-foreground">Facelyze</h1>
            <p className="text-lg text-muted-foreground mt-2">Powered by ONYXIAI</p>
        </div>
      </div>
    </div>
  );
}
