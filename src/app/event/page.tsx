
"use client";

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clipboard, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const steps = [
  {
    title: "Create a Reel",
    description: "Make an engaging and creative Instagram Reel showcasing the Facelyze website and its features."
  },
  {
    title: "Upload to Instagram",
    description: "Post your Reel to your public Instagram account."
  },
  {
    title: "Mention & Tag Us",
    description: "In your Reel's caption, you must mention our official Instagram account @facelyze."
  },
  {
    title: "Use Our Caption & Hashtags",
    description: "Copy and use the official caption and hashtags provided below to be eligible for the prize."
  }
];

const officialCaption = `Unlocking my aesthetic potential with AI! ✨ Just used Facelyze.com to get a detailed analysis of my face. It's so cool to see the scores and get personalized recommendations. You have to try this out! #facelyze #aianalysis #beautytips #skincareai #glowup #lookmaxxing`;

export default function EventPage() {
  const { toast } = useToast();

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
      <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="flex items-center gap-4">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-headline">Facelyze Reels Challenge</h1>
            <p className="text-muted-foreground">Join our event, get creative, and win cash prizes!</p>
          </div>
        </div>

        <Card className="bg-accent/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" /> The Prize
            </CardTitle>
            <CardDescription>Views on your Reel can turn into real money.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-background p-6 rounded-lg">
              <p className="text-4xl md:text-5xl font-bold text-primary">₹500 INR</p>
              <p className="text-lg text-muted-foreground mt-2">(or USD equivalent)</p>
              <p className="text-xl font-semibold mt-4">For Every 200,000 Views!</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">There is no limit. The more views you get, the more you can win.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">How to Participate</CardTitle>
            <CardDescription>Follow these 4 simple steps to enter the challenge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 flex-grow-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex-grow-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Follow Us on Instagram</h3>
                  <p className="text-muted-foreground">Make sure you're following our official account to stay updated.</p>
                   <Button asChild variant="link" className="px-0">
                      <Link href="https://instagram.com/facelyze" target="_blank" rel="noopener noreferrer">Follow @facelyze</Link>
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Official Caption & Hashtags</CardTitle>
            <CardDescription>You must use this exact text in your Instagram Reel's caption.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md text-muted-foreground text-sm italic">
                {officialCaption}
            </div>
            <Button onClick={handleCopy} className="w-full md:w-auto">
              <Clipboard className="mr-2 h-4 w-4" /> Copy Caption
            </Button>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
