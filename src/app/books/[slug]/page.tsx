
"use client";

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { books } from '@/lib/books';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BookDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const book = books.find((b) => b.slug === params.slug);

  if (!book) {
    notFound();
  }

  const handleDownload = () => {
    toast({
      title: "Starting Download",
      description: "Your book will be downloaded shortly.",
    });
    // The link will handle the actual download
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto animate-in fade-in-0 duration-500">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/books">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Library
                </Link>
            </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden sticky top-24">
                <div className="aspect-[9/16] w-full">
                    <Image
                        src={`https://placehold.co/360x640.png`}
                        alt={`${book.title} book cover`}
                        data-ai-hint={book.coverImageHint}
                        width={360}
                        height={640}
                        className="object-cover w-full h-full"
                    />
                </div>
            </Card>
             <Button asChild size="lg" className="w-full" onClick={handleDownload}>
                <a href={book.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" /> Download Guide
                </a>
            </Button>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">{book.title}</CardTitle>
                <div className="flex items-center gap-4 pt-2">
                    <Badge variant="secondary">{book.downloads} Downloads</Badge>
                </div>
                <CardDescription className="pt-4 text-base">{book.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4 text-foreground">What You'll Learn:</h3>
                <ul className="space-y-3">
                  {book.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-green-100 rounded-full mt-1">
                        <Check className="h-4 w-4 text-green-700" />
                      </div>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
