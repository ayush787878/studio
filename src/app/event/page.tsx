
"use client";

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clipboard, Instagram, PartyPopper, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const steps = [
  {
    step: "Step 1",
    title: "Create a Reel",
    description: "Make an engaging and creative Instagram Reel showcasing the Facelyze website and its features.",
    icon: <PartyPopper className="h-8 w-8 text-pink-600" />,
    bgColor: "bg-pink-100",
  },
  {
    step: "Step 2",
    title: "Upload to Instagram",
    description: "Post your Reel to your public Instagram account.",
    icon: <Instagram className="h-8 w-8 text-purple-600" />,
    bgColor: "bg-purple-100",
  },
  {
    step: "Step 3",
    title: "Mention & Tag Us",
    description: "In your Reel's caption, you must mention our official Instagram account @facelyze.",
    icon: <CheckCircle className="h-8 w-8 text-teal-600" />,
    bgColor: "bg-teal-100",
  },
  {
    step: "Step 4",
    title: "Use Our Caption & Hashtags",
    description: "Copy and use the official caption and hashtags provided below to be eligible for the prize.",
    icon: <Clipboard className="h-8 w-8 text-blue-600" />,
    bgColor: "bg-blue-100",
  },
  {
    step: "Step 5",
    title: "Approval & Payout",
    description: "Our team will review your reel. Once approved, we will DM you on Instagram to arrange your payout.",
    icon: <Send className="h-8 w-8 text-orange-600" />,
    bgColor: "bg-orange-100",
  }
];

const officialCaption = `Unlocking my aesthetic potential with AI! ✨ Just used Facelyze.com to get a detailed analysis of my face. It's so cool to see the scores and get personalized recommendations. You have to try this out! #facelyze #aianalysis #beautytips #skincareai #glowup #lookmaxxing`;

export default function EventPage() {
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000); // Confetti for 8 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(officialCaption).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "The caption and hashtags are ready to be pasted.",
      });
    }, (err) => {
      toast({
        title: "Copy Failed",
        description: "Could not copy text. Please try again.",
        variant: "destructive",
      });
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <AppShell>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-2 animate-in zoom-in-50 duration-500">
              <PartyPopper className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Facelyze Reels Challenge
            </h1>
            <p className="text-lg text-muted-foreground">Join our event, get creative, and win cash prizes!</p>
        </div>

        <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-2xl animate-in slide-in-from-bottom-5 duration-700">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <Trophy className="h-6 w-6" /> The Prize
            </CardTitle>
            <CardDescription className="text-white/80">Views on your Reel can turn into real money.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-5xl md:text-6xl font-bold">$5 - $20 USD</p>
              <p className="text-xl font-semibold mt-4">For Every 200,000 Views!</p>
            </div>
            <p className="text-xs text-white/80 mt-4">Prize limit up to 10M views. Payouts available in all local currency equivalents.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">How to Participate</CardTitle>
            <CardDescription>Follow these 5 simple steps to enter the challenge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg">
                <div className={`flex-shrink-0 flex-grow-0 h-14 w-14 ${step.bgColor} rounded-full flex items-center justify-center font-bold text-lg shadow-inner`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">{step.step}: {step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Official Caption & Hashtags</CardTitle>
            <CardDescription>You must use this exact text in your Instagram Reel's caption.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md text-muted-foreground text-sm italic border-l-4 border-primary">
                {officialCaption}
            </div>
            <Button onClick={handleCopy} className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90 transition-opacity">
              <Clipboard className="mr-2 h-4 w-4" /> Copy Caption
            </Button>
          </CardContent>
        </Card>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Warning</AlertTitle>
          <AlertDescription>
            Any use of fake views or engagement will result in immediate disqualification from the event and a permanent ban from all future promotions.
          </AlertDescription>
        </Alert>

        <div className="text-center text-muted-foreground text-sm">
            <p>Make sure you're following our official account to stay updated.</p>
            <Button asChild variant="link" className="px-0 text-lg">
                <Link href="https://instagram.com/facelyze" target="_blank" rel="noopener noreferrer">Follow @facelyze on <Instagram className="inline-block ml-1" /></Link>
            </Button>
        </div>

      </div>
    </AppShell>
  );
}
