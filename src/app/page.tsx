import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, History, ShieldCheck, Sparkles, Target, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'AI Face Analysis & Aesthetic Scoring',
  description: 'Upload your photo for a free AI-powered face analysis. Get your aesthetic score, detailed feature breakdown, and personalized improvement plans from Facelyz.',
};

export default function LandingPage() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered Analysis",
      description: "Receive a detailed, objective analysis of your facial features and skin condition powered by cutting-edge AI.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Personalized Plans",
      description: "Tell our AI your aesthetic goals and receive a custom step-by-step plan to help you achieve them.",
    },
    {
      icon: <History className="h-8 w-8 text-primary" />,
      title: "Track Your Progress",
      description: "Save your analyses to your personal history to track changes and improvements over time.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Expert Advisory",
      description: "Access AI-curated content on aesthetic principles and recommended reading for self-improvement.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Private & Secure",
      description: "Your privacy is paramount. Your data is securely stored and never shared.",
    }
  ];
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-border/20">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="sr-only">Facelyz</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" prefetch={false}>
            <Button variant="ghost">
              Login
            </Button>
          </Link>
          <Link href="/dashboard" prefetch={false}>
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-4 animate-in fade-in-0 slide-in-from-left-12 duration-1000">
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                  Unlock Your Aesthetic Potential with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get instant, data-driven insights into your facial features. Facelyz provides a comprehensive analysis, personalized scores, and actionable recommendations.
                </p>
                <div className="space-x-4">
                  <Link href="/dashboard" prefetch={false}>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Your Free Analysis
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center animate-in fade-in-0 slide-in-from-right-12 duration-1000">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="AI Face Analysis Illustration"
                  data-ai-hint="abstract technology"
                  width={600}
                  height={600}
                  className="rounded-xl object-cover aspect-square"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A New Look in Three Simple Steps
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our process is simple, secure, and designed to give you actionable insights quickly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1 text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background mb-4">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">1. Upload a Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a clear, front-facing photo. We offer a free preview analysis for all new users.
                </p>
              </div>
              <div className="grid gap-1 text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000" style={{"animationDelay": "200ms"}}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">2. AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your facial structure, harmony, and skin to generate your aesthetic score and recommendations.
                </p>
              </div>
              <div className="grid gap-1 text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000" style={{"animationDelay": "400ms"}}>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-headline">3. Get Your Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in to unlock your full, detailed analysis and receive a personalized plan to achieve your aesthetic goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need for Self-Improvement
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Facelyz is more than just an analysis tool. It's a complete platform for understanding and enhancing your aesthetics.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="bg-background/50 text-left">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-lg m-0">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Facelyz. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
