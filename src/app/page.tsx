import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ShieldCheck, TrendingUp, ClipboardList } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: 'AI Aesthetic Scoring',
      description: 'Receive an objective score on your aesthetic appeal from our advanced AI, based on a holistic analysis of your features.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'In-Depth Feature Analysis',
      description: 'Get detailed feedback on individual characteristics, helping you understand your unique facial structure.',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: 'Progress Visualization',
      description: 'Track your aesthetic journey over time with a visual timeline of your photos, scores, and personal notes.',
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-primary" />,
      title: 'Personalized Beauty Plans',
      description: 'Unlock tailored advice on skincare, makeup, and lifestyle adjustments to enhance your natural beauty.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-border/20">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="sr-only">Aura</span>
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
                  Unlock Your Radiance with Aura
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover your unique aesthetic potential. Our AI analyzes, guides, and empowers you to become your most confident self.
                </p>
                <div className="space-x-4">
                  <Link href="/dashboard" prefetch={false}>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Analyze For Free
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center animate-in fade-in-0 slide-in-from-right-12 duration-1000">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Hero"
                  data-ai-hint="elegant woman portrait"
                  width={600}
                  height={600}
                  className="rounded-xl object-cover aspect-square"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A New Perspective on Beauty
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our suite of AI-powered tools offers a comprehensive way to explore and enhance your facial aesthetics.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 pt-12">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-in fade-in-0 slide-in-from-bottom-16" style={{animationDelay: `${index * 150}ms`, animationFillMode: 'backwards'}}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Aura. All rights reserved.</p>
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
