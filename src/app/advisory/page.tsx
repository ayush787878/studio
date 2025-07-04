"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdvisoryContent, type AdvisoryContent } from '@/ai/flows/advisory';
import { Loader2, BookOpen, AlertTriangle } from 'lucide-react';

export default function AdvisoryPage() {
  const [content, setContent] = useState<AdvisoryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const advisoryContent = await getAdvisoryContent();
        setContent(advisoryContent);
      } catch (e) {
        console.error("Failed to fetch advisory content:", e);
        setError("Failed to load advisory content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Advisory & Learning</h1>
                <p className="text-muted-foreground">AI-curated principles and resources for aesthetic improvement.</p>
            </div>
        </div>

        {isLoading && (
            <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="text-lg font-semibold font-headline">Generating your personalized advisory...</p>
                    <p className="text-muted-foreground">This may take a moment.</p>
                </CardContent>
            </Card>
        )}

        {error && (
             <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px] text-destructive">
                    <AlertTriangle className="h-16 w-16" />
                    <p className="text-lg font-semibold font-headline">Error</p>
                    <p>{error}</p>
                </CardContent>
            </Card>
        )}

        {content && (
          <div className="space-y-8">
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Principles of Facial Aesthetics</CardTitle>
                <CardDescription>Core concepts for enhancing and maintaining your appearance, focusing on health and well-being.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.principles.map((principle, index) => (
                  <div key={index} className="p-4 bg-background rounded-md shadow-sm">
                    <h3 className="font-semibold text-primary text-lg">{principle.title}</h3>
                    <p className="text-muted-foreground mt-1">{principle.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Recommended Reading</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {content.bookRecommendations.map((book, index) => (
                  <Card key={index} className="flex flex-col">
                    <CardHeader className="items-center">
                        <Image
                            src="https://placehold.co/300x400.png"
                            alt={`${book.title} book cover`}
                            data-ai-hint="book cover"
                            width={200}
                            height={267}
                            className="rounded-md shadow-lg"
                        />
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <CardTitle className="font-headline text-lg">{book.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">by {book.author}</CardDescription>
                      <p className="text-muted-foreground text-sm mt-4 flex-grow">{book.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
